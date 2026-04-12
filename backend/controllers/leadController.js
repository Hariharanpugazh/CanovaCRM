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

    // Assign leads in batch
    const assignedLeads = await assignLeadsInBatch(leads);

    // Insert all leads in parallel
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

    // Build update object based on what was actually changed
    const updateData = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (type) updateData.type = type;
    
    // Explicitly handle scheduledDate (allow null if type changes away from Scheduled)
    if (type === 'Scheduled') {
      updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
    } else if (type) {
      updateData.scheduledDate = null;
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Log activity
    const activity = new Activity({
      type: 'LeadStatusUpdated',
      userId: req.user._id,
      leadId: lead._id,
      description: `Lead status updated to ${status}`,
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
    const { page = 1, limit = 10, assignedTo, status, language } = req.query;

    const query = {};
    if (assignedTo) query.assignedTo = assignedTo;
    if (status) query.status = status;
    if (language) query.language = language;

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
        currentPage: page
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLeadsByUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { assignedTo: req.user._id };
    if (status) query.status = status;

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
        currentPage: page
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
