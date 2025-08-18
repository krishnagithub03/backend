
const RegisteredUser = require('../Models/RegisteredUser');
const XLSX = require('xlsx');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Register a new user
exports.register = async (req, res) => {
    try {
        const { phoneNumber, name, email, accessToken, role } = req.body;
        const newRegisteredUser = new RegisteredUser({ phoneNumber, name, email, accessToken, role });
        await newRegisteredUser.save();
        res.status(201).json({ message: 'User registered successfully', registeredUser: newRegisteredUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Upload and register users from Excel file
exports.uploadExcel = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const results = [];
      for (const row of data) {
        // Map Excel columns to model fields
        const name = row.Name || row.name;
        const email = row.Email || row.email;
        const phoneNumber = row.phone || row.phoneNumber;
        if (!name || (!email && !phoneNumber)) continue;
        try {
          const user = new RegisteredUser({ name, email, phoneNumber });
          await user.save();
          results.push({ name, email, phoneNumber, status: 'success' });
        } catch (err) {
          results.push({ name, email, phoneNumber, status: 'failed', error: err.message });
        }
      }
      res.status(200).json({ message: 'Upload complete', results });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

// Get all registered users
exports.getAll = async (req, res) => {
    try {
        const users = await RegisteredUser.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a registered user by ID
exports.getById = async (req, res) => {
    try {
        const user = await RegisteredUser.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a registered user
exports.delete = async (req, res) => {
    try {
        const user = await RegisteredUser.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
