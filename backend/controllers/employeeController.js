import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Attendance from '../models/Attendance.js';

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

export const checkIn = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create attendance record for today
    let attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (!attendance) {
      attendance = new Attendance({
        userId: req.user._id,
        date: today,
        checkInTime: new Date(),
        breaks: []
      });
    } else if (!attendance.checkInTime) {
      attendance.checkInTime = new Date();
    }

    await attendance.save();

    // Log activity
    const activity = new Activity({
      type: 'LeadAssigned',
      userId: req.user._id,
      description: `${req.user.name} checked in`,
      details: { action: 'check_in' }
    });
    await activity.save();

    res.json({
      message: 'Checked in successfully',
      checkInTime: attendance.checkInTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record
    let attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (!attendance) {
      return res.status(404).json({ error: 'No check-in found for today' });
    }

    attendance.checkOutTime = new Date();
    await attendance.save();

    // Log activity
    const activity = new Activity({
      type: 'LeadAssigned',
      userId: req.user._id,
      description: `${req.user.name} checked out`,
      details: { action: 'check_out' }
    });
    await activity.save();

    res.json({
      message: 'Checked out successfully',
      checkOutTime: attendance.checkOutTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const startBreak = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record
    let attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (!attendance) {
      return res.status(404).json({ error: 'Please check in first' });
    }

    // Check if there's an active break
    const activeBreak = attendance.breaks.find(b => !b.endTime);
    if (activeBreak) {
      return res.status(400).json({ error: 'Break already in progress' });
    }

    // Start new break
    attendance.breaks.push({
      startTime: new Date()
    });

    await attendance.save();

    // Log activity
    const activity = new Activity({
      type: 'LeadAssigned',
      userId: req.user._id,
      description: `${req.user.name} started a break`,
      details: { action: 'break_start' }
    });
    await activity.save();

    res.json({
      message: 'Break started',
      breakStartTime: attendance.breaks[attendance.breaks.length - 1].startTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const endBreak = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (!attendance) {
      return res.status(404).json({ error: 'No check-in found for today' });
    }

    // Find active break
    const activeBreak = attendance.breaks.find(b => !b.endTime);
    if (!activeBreak) {
      return res.status(400).json({ error: 'No active break to end' });
    }

    activeBreak.endTime = new Date();
    await attendance.save();

    // Log activity
    const activity = new Activity({
      type: 'LeadAssigned',
      userId: req.user._id,
      description: `${req.user.name} ended a break`,
      details: { action: 'break_end' }
    });
    await activity.save();

    res.json({
      message: 'Break ended',
      breakEndTime: activeBreak.endTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBreakLogs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Get last 4 days of attendance records using UTC dates
    const fourDaysAgo = new Date();
    fourDaysAgo.setUTCHours(0, 0, 0, 0);
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    today.setDate(today.getDate() + 1); // End of today

    const attendanceRecords = await Attendance.find({
      userId: req.user._id,
      date: { $gte: fourDaysAgo, $lt: today }
    }).sort({ date: -1 });

    const breakLogs = [];
    attendanceRecords.forEach(record => {
      record.breaks.forEach(breakRecord => {
        if (breakRecord.endTime) {
          breakLogs.push({
            date: new Date(record.date).toLocaleDateString('en-US', { 
              month: '2-digit', 
              day: '2-digit', 
              year: '2-digit' 
            }),
            startTime: new Date(breakRecord.startTime).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            endTime: new Date(breakRecord.endTime).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          });
        }
      });
    });

    res.json({ breakLogs: breakLogs.slice(0, 4) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Use UTC dates to match database timestamps
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get today's attendance
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    let checkInTime = null;
    let checkOutTime = null;
    let isBreakActive = false;
    let activeBreakStartTime = null;
    let todayBreakStartTime = null;
    let todayBreakEndTime = null;

    if (attendance) {
      checkInTime = attendance.checkInTime;
      checkOutTime = attendance.checkOutTime; // Only today's checkout
      const activeBreak = attendance.breaks.find(b => !b.endTime);
      isBreakActive = !!activeBreak;
      activeBreakStartTime = activeBreak ? activeBreak.startTime : null;
      
      // Get the last break's end time for today's break display
      if (attendance.breaks.length > 0) {
        const lastBreak = attendance.breaks[attendance.breaks.length - 1];
        if (lastBreak.endTime) {
          todayBreakStartTime = lastBreak.startTime;
          todayBreakEndTime = lastBreak.endTime;
        } else {
          todayBreakStartTime = lastBreak.startTime;
        }
      }
    }

    // Don't need yesterday's checkout anymore - just show today's data
    res.json({
      checkInTime,
      checkOutTime,
      isBreakActive,
      activeBreakStartTime,
      todayBreakStartTime,
      todayBreakEndTime: attendance && attendance.breaks.length > 0 ? attendance.breaks[attendance.breaks.length - 1].endTime : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const activities = await Activity.find({
      userId: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(7)
      .lean();

    const formattedActivities = activities.map(activity => {
      const now = new Date();
      const activityTime = new Date(activity.createdAt);
      const diffMinutes = Math.floor((now - activityTime) / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeAgo = '';
      if (diffMinutes < 60) {
        timeAgo = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      }

      return {
        id: activity._id,
        message: activity.description,
        time: timeAgo,
        type: activity.type
      };
    });

    res.json({ activities: formattedActivities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
