import AuditLog from '../../models/admin/AuditLogModel.js';

const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, organizationId, actionType, severity, startDate, endDate } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};
    if (organizationId) query.organizationId = organizationId;
    if (actionType) query.actionType = actionType;
    if (severity) query.severity = severity;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('performedBy', 'fullName email')
        .populate('organizationId', 'organizationName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments(query)
    ]);

    res.json({ logs, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate('performedBy', 'fullName email')
      .populate('organizationId', 'organizationName');
    if (!log) return res.status(404).json({ message: 'Log not found.' });
    res.json(log);
  } catch (error) {
    console.error('Get log error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getLogs, getLogById };