// controllers/fileController.js
const multer = require('multer');
const xlsx = require('xlsx');
const Data = require('../models/Data');

// Set up Multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(new Error('Only .xlsx files are allowed'), false);
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

// File validation and processing
const processFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const errors = [];
    const validRows = [];

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

      rows.forEach((row, index) => {
        const rowIndex = index + 2; // Because the first row is the header
        const errorRow = { sheetName, rowNumber: rowIndex, description: '' };

        if (!row.Name || !row.Amount || !row.Date) {
          errorRow.description = 'Name, Amount, and Date are mandatory';
          errors.push(errorRow);
        } else if (isNaN(row.Amount) || row.Amount <= 0) {
          errorRow.description = 'Amount must be a valid number greater than zero';
          errors.push(errorRow);
        } else if (new Date(row.Date).toString() === 'Invalid Date') {
          errorRow.description = 'Date must be valid';
          errors.push(errorRow);
        } else if (new Date(row.Date).getMonth() !== new Date().getMonth()) {
          errorRow.description = 'Date must be within the current month';
          errors.push(errorRow);
        } else {
          validRows.push({
            name: row.Name,
            amount: parseFloat(row.Amount),
            date: new Date(row.Date),
            verified: row.Verified === 'Yes',
          });
        }
      });
    });

    await Data.insertMany(validRows);

    res.status(200).json({ message: 'File processed successfully', errors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { upload, processFile };
