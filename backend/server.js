const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || 'supersecretkey123';
const PORT = process.env.PORT || 5000;

// --- CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS   
  }
});

// RAZORPAY INSTANCE
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,     
  key_secret: process.env.RAZORPAY_KEY_SECRET 
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  isBlocked: { type: Boolean, default: false },
  profileImage: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});
const UserModel = mongoose.model('User', UserSchema);

const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  location: String,
  price: Number,
  capacity: Number,
  category: String,
  mode: String,
  status: String,
  description: String,
  imageUrl: { type: String }
});
const EventModel = mongoose.model('Event', EventSchema);

const demoEvents = require('./demoEvents');

async function seedDemoEvents() {
  try {
    let count = 0;
    for (const dEvent of demoEvents) {
      const res = await EventModel.updateOne(
        { title: dEvent.title },
        { $set: dEvent },
        { upsert: true }
      );
      if (res.upsertedCount > 0 || res.modifiedCount > 0) {
        count++;
      }
    }
    if (count > 0) {
      console.log(`Seeded or updated ${count} demo event(s).`);
    } else {
      console.log('Demo events already exist and are up to date; skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding demo events:', err);
  }
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await seedDemoEvents();
  })
  .catch(err => console.log(err));

const RegistrationSchema = new mongoose.Schema({
  eventId: String,
  eventTitle: String,
  eventDate: String,
  eventLocation: String,
  userId: String,
  userName: String,
  userEmail: String,
  registrationDate: { type: Date, default: Date.now },
  
  isTeamRegistration: { type: Boolean, default: false },
  teamName: String,
  teamLeaderMobile: String,
  teamMembers: [{ name: String, email: String, mobile: String }],

  paymentId: String,
  orderId: String,
  amount: Number,
  paymentStatus: { type: String, default: 'Pending' }
});
const RegistrationModel = mongoose.model('Registration', RegistrationSchema);

const NotificationSchema = new mongoose.Schema({
  message: String,
  type: { type: String, default: 'security' },
  userEmail: String,
  userName: String,
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});
const NotificationModel = mongoose.model('Notification', NotificationSchema);

// --- ROUTES ---

// 1. PAYMENT ROUTES
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    
    // --- FIX: USE YOUR REAL SECRET KEY HERE ---
    const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // Use env variable
    .update(sign.toString())
    .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.json({ message: "Payment Verified Successfully" });
    } else {
      res.status(400).json({ error: "Invalid Signature" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. AUTH
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) { res.status(500).json({ error: 'Error registering user' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.isBlocked) return res.status(403).json({ error: 'Account restricted.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY);
    res.json({ token, id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage });
  } catch (err) { res.status(500).json({ error: 'Login failed' }); }
});

app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/auth/update-profile', upload.single('profileImage'), async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) return res.status(400).json({ error: "Email is already in use." });
    const updateData = { name, email };
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get('host');
      updateData.profileImage = `${protocol}://${host}/uploads/${req.file.filename}`;
    }
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, profileImage: updatedUser.profileImage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) { console.log(`Password reset requested for non-existent email: ${email}`); return res.status(404).json({ error: 'User not found' }); }
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();
    const resetLink = `http://localhost:5173/reset-password/${token}`;
    const mailOptions = {
      from: '"Eventia Support" <rr493377@gmail.com>', 
      to: user.email,
      subject: 'Reset Your Password',
      text: `Reset Link: ${resetLink}`
    };
    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent successfully to ${user.email}`);
    res.json({ message: 'Email sent' });
  } catch (err) { console.error(">>> EMAIL ERROR:", err); res.status(500).json({ error: 'Error sending email. Check server logs.' }); }
});

app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const user = await UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: 'Token invalid/expired' });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// NOTIFICATIONS
app.post('/api/notifications', async (req, res) => { const n = new NotificationModel(req.body); await n.save(); res.json(n); });
app.get('/api/notifications', async (req, res) => { const n = await NotificationModel.find().sort({ date: -1 }); res.json(n); });
app.delete('/api/notifications/:id', async (req, res) => { await NotificationModel.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });

// EVENTS
app.get('/api/events', async (req, res) => { const e = await EventModel.find(); res.json(e); });
app.get('/api/events/:id', async (req, res) => { const e = await EventModel.findById(req.params.id); res.json(e); });
app.post('/api/events', upload.single('image'), async (req, res) => {
    const d = req.body; if (req.file) d.imageUrl = `http://${req.get('host')}/uploads/${req.file.filename}`;
    const n = new EventModel(d); await n.save(); res.json(n);
});
app.put('/api/events/:id', upload.single('image'), async (req, res) => {
    const d = req.body; if (req.file) d.imageUrl = `http://${req.get('host')}/uploads/${req.file.filename}`;
    const u = await EventModel.findByIdAndUpdate(req.params.id, d, { new: true }); res.json(u);
});
app.delete('/api/events/:id', async (req, res) => { await EventModel.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });

// 3. REGISTRATION
app.post('/api/register', async (req, res) => {
    try {
      const { eventId, userEmail, paymentId, orderId } = req.body;
      
      const existingRegistration = await RegistrationModel.findOne({ eventId, userEmail });
      if (existingRegistration) return res.status(400).json({ error: "You are already registered!" });
      
      const event = await EventModel.findById(eventId);
      if (!event || event.capacity <= 0) return res.status(400).json({ error: "Event is full or not found" });
  
      // Save Registration with Payment Details
      const newRegistration = new RegistrationModel({
        ...req.body,
        paymentId: paymentId || 'FREE',
        orderId: orderId || 'N/A',
        paymentStatus: paymentId ? 'Paid' : 'Free'
      });
      await newRegistration.save();
  
      event.capacity -= 1;
      await event.save();
  
      res.json({ message: "Registration successful!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/my-registrations', async (req, res) => {
    const regs = await RegistrationModel.find({ userEmail: req.query.email });
    const resData = await Promise.all(regs.map(async (r) => {
        const e = await EventModel.findById(r.eventId);
        return { ...r.toObject(), currentStatus: e ? e.status : 'deleted', currentCapacity: e ? e.capacity : 0 };
    })); res.json(resData);
});

app.get('/api/admin/registrations', async (req, res) => {
    const regs = await RegistrationModel.find().sort({ registrationDate: -1 });
    const resData = await Promise.all(regs.map(async (r) => {
        let name = r.userName; if (!name) { const u = await UserModel.findOne({ email: r.userEmail }); name = u ? u.name : 'Unknown'; }
        return { ...r.toObject(), userName: name };
    })); res.json(resData);
});

// ADMIN USERS
app.get('/api/admin/users', async (req, res) => { const u = await UserModel.find({ role: { $ne: 'admin' } }); res.json(u); });
app.put('/api/admin/users/:id/restrict', async (req, res) => { const u = await UserModel.findById(req.params.id); u.isBlocked = !u.isBlocked; await u.save(); res.json(u); });
app.delete('/api/admin/users/:id', async (req, res) => {
    const u = await UserModel.findById(req.params.id); if (!u) return res.status(404).json({ error: "Not found" });
    await RegistrationModel.deleteMany({ userEmail: u.email }); await UserModel.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' });
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });