import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const parseCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(new Error(`CSV read error: ${err.message}`));
        return;
      }

      const lines = data.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        reject(new Error('CSV file is empty or has no data rows'));
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredFields = ['name', 'email', 'source', 'date', 'location', 'language'];

      const missingFields = requiredFields.filter(field => !headers.includes(field));
      if (missingFields.length > 0) {
        reject(new Error(`Missing required CSV columns: ${missingFields.join(', ')}`));
        return;
      }

      const leads = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length !== headers.length) continue;

        const lead = {};
        headers.forEach((header, index) => {
          lead[header] = values[index];
        });

        // Validate required fields
        if (lead.name && lead.email && lead.source && lead.date && lead.location && lead.language) {
          leads.push({
            name: lead.name,
            email: lead.email,
            source: lead.source,
            date: new Date(lead.date),
            location: lead.location,
            language: lead.language,
            status: 'Ongoing',
            type: 'Warm'
          });
        }
      }

      resolve(leads);
    });
  });
};

export const validateCSVRow = (row) => {
  const requiredFields = ['name', 'email', 'source', 'date', 'location', 'language'];
  const missingFields = requiredFields.filter(field => !row[field]);

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Missing fields: ${missingFields.join(', ')}`
    };
  }

  // Validate email format
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(row.email)) {
    return {
      valid: false,
      error: 'Invalid email format'
    };
  }

  // Validate language
  const validLanguages = ['Marathi', 'Kannada', 'Hindi', 'English', 'Bengali'];
  if (!validLanguages.includes(row.language)) {
    return {
      valid: false,
      error: `Invalid language. Allowed: ${validLanguages.join(', ')}`
    };
  }

  return { valid: true };
};

export const cleanupFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('File cleanup error:', error.message);
  }
};
