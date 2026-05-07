import Employee from '../../models/client/EmployeeModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';

const getEmployees = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;
    const { page = 1, limit = 20, department, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { organizationId: tenantId, isActive: true };
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .populate('manager', 'fullName')
        .sort({ fullName: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Employee.countDocuments(query)
    ]);

    res.json({
      employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    }).populate('manager', 'fullName');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { fullName, email, phone, department, position, employeeId, hireDate, manager, notes } = req.body;

    if (!fullName || !email || !department) {
      return res.status(400).json({ message: 'Full name, email, and department are required.' });
    }

    const existing = await Employee.findOne({ organizationId: req.user.organizationId, email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Employee with this email already exists.' });
    }

    const employee = await Employee.create({
      organizationId: req.user.organizationId,
      fullName,
      email: email.toLowerCase(),
      phone: phone || '',
      department,
      position: position || '',
      employeeId: employeeId || '',
      hireDate: hireDate || new Date(),
      manager: manager || null,
      notes: notes || ''
    });

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Employee created',
      actionType: 'user_created',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: employee._id,
      targetModel: 'Employee',
      description: `Employee ${employee.fullName} created`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const { fullName, email, phone, department, position, employeeId, hireDate, manager, notes } = req.body;

    if (fullName) employee.fullName = fullName;
    if (email) employee.email = email.toLowerCase();
    if (phone !== undefined) employee.phone = phone;
    if (department) employee.department = department;
    if (position !== undefined) employee.position = position;
    if (employeeId !== undefined) employee.employeeId = employeeId;
    if (hireDate) employee.hireDate = hireDate;
    if (manager !== undefined) employee.manager = manager;
    if (notes !== undefined) employee.notes = notes;

    await employee.save();

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Employee updated',
      actionType: 'user_updated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: employee._id,
      targetModel: 'Employee',
      description: `Employee ${employee.fullName} updated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json(employee);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const recordPerformance = async (req, res) => {
  try {
    const { tasksCompleted, tasksAssigned, efficiency, attendanceRate } = req.body;

    const employee = await Employee.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    if (tasksCompleted !== undefined) employee.tasksCompleted = tasksCompleted;
    if (tasksAssigned !== undefined) employee.tasksAssigned = tasksAssigned;
    if (efficiency !== undefined) employee.efficiency = efficiency;
    if (attendanceRate !== undefined) employee.attendanceRate = attendanceRate;

    await employee.calculatePerformanceScore();

    res.json(employee);
  } catch (error) {
    console.error('Record performance error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deactivateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      { isActive: false, terminationDate: new Date() },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Employee deactivated',
      actionType: 'user_deleted',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: employee._id,
      targetModel: 'Employee',
      description: `Employee ${employee.fullName} deactivated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json({ message: 'Employee deactivated.' });
  } catch (error) {
    console.error('Deactivate employee error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getDepartmentPerformance = async (req, res) => {
  try {
    const stats = await Employee.aggregate([
      { $match: { organizationId: req.user.organizationId, isActive: true } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgPerformance: { $avg: '$performanceScore' },
          avgEfficiency: { $avg: '$efficiency' },
          avgAttendance: { $avg: '$attendanceRate' }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Department performance error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  recordPerformance,
  deactivateEmployee,
  getDepartmentPerformance
};