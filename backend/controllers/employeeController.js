import User from '../models/User.js';
import Activity from '../models/Activity.js';

export const getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 8, search = '' } = req.query;
    
    const query = {
      role: 'SalesUser',
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ]
    };

    const total = await User.countDocuments(query);
    const employees = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json({
      employees,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, languages } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Generate employee ID
    const employeeCount = await User.countDocuments({ role: 'SalesUser' });
    const employeeId = `EMP${String(employeeCount + 1).padStart(5, '0')}`;

    const employee = new User({
      name,
      email,
      password: email, // Default password = email
      role: 'SalesUser',
      employeeId,
      languages: languages || [],
      status: 'Active'
    });

    await employee.save();

    // Log activity
    const activity = new Activity({
      type: 'EmployeeCreated',
      userId: req.user._id,
      description: `Employee ${name} created`,
      details: { employeeId: employee._id, name }
    });
    await activity.save();

    res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        status: employee.status,
        languages: employee.languages
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, languages } = req.body;

    const employee = await User.findByIdAndUpdate(
      id,
      {
        name: name || undefined,
        status: status || undefined,
        languages: languages || undefined,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Log activity
    const activity = new Activity({
      type: 'EmployeeUpdated',
      userId: req.user._id,
      description: `Employee ${employee.name} updated`,
      details: { employeeId: employee._id }
    });
    await activity.save();

    res.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Log activity
    const activity = new Activity({
      type: 'EmployeeDeleted',
      userId: req.user._id,
      description: `Employee ${employee.name} deleted`,
      details: { employeeId: id }
    });
    await activity.save();

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkDeleteEmployees = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid employee IDs' });
    }

    const result = await User.deleteMany({ _id: { $in: ids } });

    // Log activity
    const activity = new Activity({
      type: 'EmployeeDeleted',
      userId: req.user._id,
      description: `Bulk deleted ${result.deletedCount} employees`,
      details: { count: result.deletedCount }
    });
    await activity.save();

    res.json({
      message: `${result.deletedCount} employees deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
