import Payment from '../../models/admin/PaymentModel.js';
import PendingActivation from '../../models/admin/PendingActivationModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';
import { createCheckoutSession, retrieveSession, createRefund, cancelSubscription } from '../../services/payment/stripeService.js';
import { initiateSTKPush, querySTKStatus } from '../../services/payment/mpesaService.js';
import { createOrder, captureOrder } from '../../services/payment/paypalService.js';
import env from '../../config/env.js';

const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, method } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};
    if (status) query.status = status;
    if (method) query.paymentMethod = method;

    const [payments, total] = await Promise.all([
      Payment.find(query).populate('organizationId', 'organizationName').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Payment.countDocuments(query)
    ]);

    res.json({ payments, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('organizationId', 'organizationName email');
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });
    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const refundPayment = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });
    if (payment.status !== 'completed') return res.status(400).json({ message: 'Only completed payments can be refunded.' });

    const refundAmount = amount || payment.amount;
    let refundResult;
    if (payment.paymentMethod === 'stripe' && payment.paymentProviderRef?.startsWith('pi_')) {
      refundResult = await createRefund(payment.paymentProviderRef, refundAmount);
    } else if (payment.paymentMethod === 'paypal' && payment.paymentProviderRef) {
      await createRefund(payment.paymentProviderRef, refundAmount, payment.currency);
      refundResult = { status: 'completed' };
    } else {
      return res.status(400).json({ message: 'Refund not supported for this method.' });
    }

    payment.status = 'refunded';
    payment.refundedAt = new Date();
    payment.refundAmount = refundAmount;
    payment.refundReason = reason || '';
    await payment.save();

    await AuditLog.create({
      action: 'Payment refunded',
      actionType: 'admin_action',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: payment._id,
      targetModel: 'Payment',
      description: `Refund of ${refundAmount} issued`,
      severity: 'info'
    });

    res.json(payment);
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = await stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orgId = session.metadata?.organizationId;
    if (orgId) {
      const payment = await Payment.create({
        organizationId: orgId,
        amount: session.amount_total / 100,
        currency: session.currency?.toUpperCase() || 'USD',
        plan: session.metadata.plan,
        billingCycle: session.metadata.billingCycle,
        paymentMethod: 'stripe',
        paymentProviderRef: session.payment_intent,
        status: 'completed',
        paymentConfirmedAt: new Date()
      });

      await PendingActivation.create({
        organizationId: orgId,
        userEmail: session.customer_details.email,
        fullName: session.customer_details.name || '',
        plan: session.metadata.plan,
        billingCycle: session.metadata.billingCycle,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: 'stripe',
        paymentConfirmed: true,
        confirmationMethod: 'auto_stripe',
        paymentDetails: { stripeSessionId: session.id },
        paymentId: payment._id,
        submittedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
    }
  }

  res.json({ received: true });
};

const handleMpesaCallback = async (req, res) => {
  const body = req.body;
  const stkCallback = body.Body?.stkCallback;
  if (stkCallback?.ResultCode === 0) {
    const metadata = stkCallback.CallbackMetadata?.Item;
    const amount = metadata?.find(i => i.Name === 'Amount')?.Value;
    const phone = metadata?.find(i => i.Name === 'PhoneNumber')?.Value;
    const receipt = metadata?.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
    const checkoutRequestId = stkCallback.CheckoutRequestID;

    const existing = await PendingActivation.findOne({ 'paymentDetails.mpesaCheckoutRequestId': checkoutRequestId });
    if (existing) {
      existing.paymentConfirmed = true;
      existing.confirmationMethod = 'auto_mpesa_callback';
      existing.paymentDetails.mpesaReceiptNumber = receipt;
      existing.paymentDetails.transactionCode = receipt;
      await existing.save();
    }
  }
  res.json({ ResultCode: 0, ResultDesc: 'Success' });
};

const createStripeSession = async (req, res) => {
  try {
    const { organizationId, plan, billingCycle, amount, currency, userEmail } = req.body;
    const session = await createCheckoutSession({
      plan, billingCycle, amount, currency, organizationId, userEmail,
      successUrl: `${env.CLIENT_APP_URL}/payment/success`,
      cancelUrl: `${env.CLIENT_APP_URL}/payment/cancel`
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ message: 'Failed to create payment session.' });
  }
};

const initiateMpesaPayment = async (req, res) => {
  try {
    const { phoneNumber, amount, reference } = req.body;
    const result = await initiateSTKPush({ phoneNumber, amount, accountReference: reference, transactionDesc: 'SupplySense License' });
    res.json(result);
  } catch (error) {
    console.error('Mpesa init error:', error);
    res.status(500).json({ message: 'Failed to initiate payment.' });
  }
};
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });

    if (payment.status !== 'completed' && payment.status !== 'refunded' && payment.status !== 'rejected') {
      return res.status(400).json({ message: 'Only completed, refunded, or rejected payments can be deleted.' });
    }

    await Payment.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      action: 'Payment record deleted',
      actionType: 'admin_action',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: req.params.id,
      description: `Payment record ${payment._id} deleted`,
      severity: 'warning'
    });

    res.json({ message: 'Payment record deleted.' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPaymentHistory, getPaymentById, refundPayment, handleStripeWebhook, handleMpesaCallback, createStripeSession, initiateMpesaPayment, deletePayment };