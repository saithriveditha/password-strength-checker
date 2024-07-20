const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const Password = require('./models/Password');


const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost/passwordStrengthChecker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.post('/password/save',  async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newPassword = new Password({ password: hashedPassword });
    await newPassword.save();

    res.json({ success: true, message: 'Password saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
