import Alert from '../../models/client/AlertModel.js';

const getAlerts = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;
    const { page = 1, limit = 20, severity, alertType, isRead } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { organizationId: tenantId, isDismissed: false };
    if (severity) query.severity = severity;
    if (alertType) query.alertType = alertType;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const [alerts, total] = await Promise.all([
      Alert.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Alert.countDocuments(query)
    ]);

    res.json({
      alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found.' });
    }

    await alert.markAsRead(req.user._id);
    res.json(alert);
  } catch (error) {
    console.error('Mark alert read error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Alert.updateMany(
      { organizationId: req.user.organizationId, isRead: false },
      { isRead: true, readAt: new Date(), readBy: req.user._id }
    );
    res.json({ message: 'All alerts marked as read.' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const actionAlert = async (req, res) => {
  try {
    const { actionTaken } = req.body;
    const alert = await Alert.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found.' });
    }

    await alert.markAsActioned(actionTaken || 'Action taken');
    res.json(alert);
  } catch (error) {
    console.error('Action alert error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const dismissAlert = async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found.' });
    }

    await alert.dismiss();
    res.json({ message: 'Alert dismissed.' });
  } catch (error) {
    console.error('Dismiss alert error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Alert.countDocuments({
      organizationId: req.user.organizationId,
      isRead: false,
      isDismissed: false
    });
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getAlerts,
  markAsRead,
  markAllRead,
  actionAlert,
  dismissAlert,
  getUnreadCount
};