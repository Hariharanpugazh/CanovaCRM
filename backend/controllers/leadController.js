import Lead from '../models/Lead.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { assignLeadToUser, assignLeadsInBatch } from '../utils/leadAssignment.js';
import { parseCSV } from '../utils/csvParser.js';

export const uploadCSVLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const leads = await parseCSV(req.file.path);

    if (leads.length === 0) {
      return res.status(400).json({ error: 'No valid leads found in CSV' });
    }

    // Assign leads in batch (handles partial failures)
    const assignedLeads = await assignLeadsInBatch(leads);

    if (assignedLeads.length === 0) {
      return res.status(400).json({ error: 'No leads could be assigned. Please ensure you have active users with matching languages.' });
    }

    // Insert all successfully assigned leads in parallel
    const createdLeads = await Promise.all(
      assignedLeads.map(lead => new Lead(lead).save())
    );

    // Log activity
    const activity = new Activity({
      type: 'LeadAssigned',
      userId: req.user._id,
      description: `${createdLeads.length} leads imported from CSV`,
      details: { count: createdLeads.length }
    });
    await activity.save();

    res.status(201).json({
      message: `${createdLeads.length} leads imported successfully`,
      leadsCount: createdLeads.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLead = async (req, res) => {
  try {
    const { name, email, source, date, location, language } = req.body;

    if (!name || !email || !source || !date || !location || !language) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Assign to user
    const assignedTo = await assignLeadToUser(language);

    const lead = new Lead({
      name,
      email,
      source,
      date: new Date(date),
      location,
      language,
      assignedTo,
      status: 'Ongoing',
      type: 'Warm'
    });

    await lead.save();

    // Log activity
    const activity = new Activity({
      type: 'LeadAssigned',
      userId: req.user._id,
      leadId: lead._id,
      description: `Lead ${name} created and assigned`,
      details: { leadId: lead._id }
    });
    await activity.save();

    res.status(201).json({
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, type, scheduledDate } = req.body;

    // Fetch current lead to check if it has a scheduled date
    const currentLead = await Lead.findById(id);
    if (!currentLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // VALIDATION: If lead already has a scheduledDate, prevent type from being changed to 'Scheduled'
    if (currentLead.scheduledDate && type === 'Scheduled') {
      return res.status(400).json({ 
        error: 'Cannot change type to "Scheduled" - lead is already scheduled. You can only change between Hot/Warm/Cold priorities.' 
      });
    }

    // Build update object based on what was actually changed
    const updateData = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (type) updateData.type = type;
    
    // Handle scheduledDate logic:
    // 1. If setting type to 'Scheduled', include the scheduledDate from request
    // 2. If type is Hot/Warm/Cold BUT lead is already scheduled, KEEP the scheduled date
    // 3. If type is Hot/Warm/Cold AND lead is not scheduled, clear scheduledDate (shouldn't happen normally)
    if (type === 'Scheduled') {
      updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
    } else if (type && !currentLead.scheduledDate) {
      // Only clear scheduledDate if lead wasn't previously scheduled
      updateData.scheduledDate = null;
    }
    // If type && currentLead.scheduledDate exists, DON'T modify scheduledDate (keep it intact for priority changes)

    const lead = await Lead.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Log activity with proper description of what changed
    let changeDescription = 'Lead updated';
    if (type && status) {
      changeDescription = `Lead type changed to ${type} and status to ${status}`;
    } else if (type) {
      changeDescription = `Lead type changed to ${type}`;
    } else if (status) {
      changeDescription = `Lead status changed to ${status}`;
    }
    if (updateData.scheduledDate) {
      changeDescription += ` and scheduled`;
    }

    const activity = new Activity({
      type: 'LeadStatusUpdated',
      userId: req.user._id,
      leadId: lead._id,
      description: changeDescription,
      details: { leadId: lead._id, status, type }
    });
    await activity.save();

    res.json({
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, assignedTo, status, language, search } = req.query;

    const query = {};
    if (assignedTo) query.assignedTo = assignedTo;
    if (status) query.status = status;
    if (language) query.language = language;

    // Support searching by 'name', 'email', and 'location' with case-insensitive regex
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { location: searchRegex }
      ];
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email employeeId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json({
      leads,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLeadsByUser = async (req, res) => {
  try {
    const { page = 1, limit = 8, status, search } = req.query;

    const query = { assignedTo: req.user._id };
    if (status) query.status = status;

    // Support searching by 'name', 'email', and 'location' with case-insensitive regex
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { location: searchRegex }
      ];
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json({
      leads,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getScheduledLeads = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;

    console.log('User ID from request:', req.user._id);

    // FILTER: Only leads that have a scheduledDate (type can be Hot/Warm/Cold with a scheduled time)
    const query = {
      assignedTo: req.user._id,
      scheduledDate: { $ne: null }
    };

    // Check all leads for this user first (DEBUG)
    const allLeadsForUser = await Lead.find({ assignedTo: req.user._id });
    console.log('Total leads assigned to this user:', allLeadsForUser.length);
    console.log('Leads assigned to user:', allLeadsForUser.map(l => ({ name: l.name, type: l.type, scheduled: l.scheduledDate })));

    // Support searching by 'name', 'email', 'source', and 'location' with case-insensitive regex
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { source: searchRegex },
        { location: searchRegex }
      ];
    }

    const total = await Lead.countDocuments(query);
    console.log('Scheduled leads found:', total);

    const leads = await Lead.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ scheduledDate: 1 });

    res.json({
      leads,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    console.error('Error in getScheduledLeads:', error);
    res.status(500).json({ error: error.message });
  }
};
