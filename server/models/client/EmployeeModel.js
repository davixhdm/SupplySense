import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientOrg', required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    department: { type: String, enum: ['finance', 'hr', 'procurement', 'sales', 'warehouse', 'logistics', 'management', 'other'], default: 'other' },
    position: { type: String, default: '', trim: true },
    employeeId: { type: String, default: '', trim: true },
    hireDate: { type: Date, default: null },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    performanceScore: { type: Number, default: 0, min: 0, max: 100 },
    efficiency: { type: Number, default: 0, min: 0, max: 100 },
    tasksCompleted: { type: Number, default: 0 },
    tasksAssigned: { type: Number, default: 0 },
    attendanceRate: { type: Number, default: 100, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
    terminationDate: { type: Date, default: null },
    notes: { type: String, default: '', trim: true },
    source: { type: String, default: 'manual' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

employeeSchema.index({ organizationId: 1, department: 1 });
employeeSchema.index({ organizationId: 1, email: 1 }, { unique: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;