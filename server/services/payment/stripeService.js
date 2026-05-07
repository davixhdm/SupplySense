import Stripe from 'stripe';
import env from '../../config/env.js';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async ({ plan, billingCycle, amount, currency, organizationId, userEmail, successUrl, cancelUrl }) => {
  const priceInCents = Math.round(amount * 100);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: `SupplySense ${plan} Plan - ${billingCycle}`,
          description: `${billingCycle} subscription for ${plan} plan`
        },
        unit_amount: priceInCents
      },
      quantity: 1
    }],
    mode: billingCycle === 'permanent' ? 'payment' : 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    metadata: {
      organizationId: organizationId.toString(),
      plan,
      billingCycle
    }
  });
  
  return session;
};

export const verifyWebhookSignature = (payload, signature) => {
  return stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
};

export const retrieveSession = async (sessionId) => {
  return stripe.checkout.sessions.retrieve(sessionId);
};

export const createRefund = async (paymentIntentId, amount) => {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: Math.round(amount * 100)
  });
};

export const cancelSubscription = async (subscriptionId) => {
  return stripe.subscriptions.cancel(subscriptionId);
};