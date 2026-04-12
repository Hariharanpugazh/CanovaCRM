import Lead from '../models/Lead.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Unassigned leads count
    const unassignedLeads = await Lead.countDocuments({ status: 'Ongoing', assignedTo: null });

    // Assigned this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const assignedThisWeek = await Lead.countDocuments({
      createdAt: { $gte: weekStart }
    });

    // Active sales people
    const activeSalesPeople = await User.countDocuments({
      role: 'SalesUser',
      status: 'Active'
    });

    // Conversion rate
    const totalAssignedLeads = await Lead.countDocuments({ status: { $ne: null } });
    const closedLeads = await Lead.countDocuments({ status: 'Closed' });
    const conversionRate = totalAssignedLeads > 0 ? ((closedLeads / totalAssignedLeads) * 100).toFixed(2) : 0;

    res.json({
      cards: {
        unassignedLeads,
        assignedThisWeek,
        activeSalesPeople,
        conversionRate: parseFloat(conversionRate)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSalesGraph = async (req, res) => {
  try {
    // Get last 14 days of data
    const data = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayLeads = await Lead.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });

      const dayClosedLeads = await Lead.countDocuments({
        createdAt: { $gte: date, $lt: nextDate },
        status: 'Closed'
      });

      const conversionRate = dayLeads > 0 ? ((dayClosedLeads / dayLeads) * 100).toFixed(2) : 0;

      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        conversionRate: parseFloat(conversionRate)
      });
    }

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(7);

    res.json({ activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActiveSalesPeople = async (req, res) => {
  try {
    const salesPeople = await User.find({
      role: 'SalesUser',
      status: 'Active'
    });

    // Enrich with lead counts
    const enrichedData = await Promise.all(
      salesPeople.map(async (person) => {
        const assignedLeads = await Lead.countDocuments({ assignedTo: person._id });
        const closedLeads = await Lead.countDocuments({ assignedTo: person._id, status: 'Closed' });

        return {
          _id: person._id,
          name: person.name,
          employeeId: person.employeeId,
          assignedLeads,
          closedLeads,
          status: person.status
        };
      })
    );

    res.json({ salesPeople: enrichedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchTeamMember = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({ results: [] });
    }

    const results = await User.find({
      role: 'SalesUser',
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { employeeId: { $regex: q, $options: 'i' } }
      ]
    }).select('_id name email employeeId status');

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
