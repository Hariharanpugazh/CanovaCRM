import User from '../models/User.js';
import Lead from '../models/Lead.js';

/**
 * Assign lead to user based on language and threshold
 * Uses round-robin distribution with 3 leads per user threshold
 */
export const assignLeadToUser = async (language) => {
  try {
    // Parse comma-separated languages
    const languages = language
      .split(',')
      .map(lang => lang.trim())
      .filter(lang => lang);

    if (languages.length === 0) {
      throw new Error('No valid languages provided');
    }

    // Get all active users with any of these languages
    const eligibleUsers = await User.find({
      languages: { $in: languages },
      status: 'Active',
      role: 'SalesUser'
    });

    if (eligibleUsers.length === 0) {
      throw new Error(`No active users found for languages: ${language}`);
    }

    // Get assigned lead count for each user
    const userLeadCounts = await Promise.all(
      eligibleUsers.map(async (user) => ({
        userId: user._id,
        count: await Lead.countDocuments({ assignedTo: user._id })
      }))
    );

    // Find user with least leads (round-robin with threshold)
    const availableUsers = userLeadCounts.filter(u => u.count < 3);

    let selectedUser;
    if (availableUsers.length > 0) {
      // Sort by lead count and select the one with least leads
      selectedUser = availableUsers.sort((a, b) => a.count - b.count)[0].userId;
    } else {
      // If all users reached threshold, select the one with least leads anyway
      selectedUser = userLeadCounts.sort((a, b) => a.count - b.count)[0].userId;
    }

    return selectedUser;
  } catch (error) {
    throw new Error(`Lead assignment failed: ${error.message}`);
  }
};

/**
 * Assign multiple leads in parallel with error handling per lead
 */
export const assignLeadsInBatch = async (leads) => {
  try {
    const assignmentPromises = leads.map(async (lead) => {
      try {
        const userId = await assignLeadToUser(lead.language);
        return {
          ...lead,
          assignedTo: userId,
          error: null
        };
      } catch (error) {
        // Return lead with error instead of throwing
        return {
          ...lead,
          error: error.message
        };
      }
    });

    const results = await Promise.all(assignmentPromises);
    
    // Check if all leads failed
    const failedLeads = results.filter(r => r.error);
    const successfulLeads = results.filter(r => !r.error);

    if (successfulLeads.length === 0 && failedLeads.length > 0) {
      // All leads failed - return the first error
      throw new Error(failedLeads[0].error);
    }

    // Return only successful leads for saving
    return successfulLeads;
  } catch (error) {
    throw new Error(`Batch lead assignment failed: ${error.message}`);
  }
};
