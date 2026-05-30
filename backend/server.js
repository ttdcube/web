
// server.js - Backend chinh
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'clinicflow-secret-key-2026';

app.use(cors());
app.use(express.json());

// Middleware xac thuc JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API: DANG KY
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Thieu thong tin bat buoc!' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(name, email, phone, hashedPassword, 'patient');
    const token = jwt.sign({ userId: result.lastInsertRowid, role: 'patient', name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.lastInsertRowid, name, email, role: 'patient' } });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Email da duoc su dung!' });
    } else {
      res.status(500).json({ error: 'Loi he thong!' });
    }
  }
});

// API: DANG NHAP
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(400).json({ error: 'Email hoac mat khau khong dung!' });
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Email hoac mat khau khong dung!' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// API: LAY DANH SACH BAC SI
app.get('/api/doctors', (req, res) => {
  const { specialty } = req.query;
  let stmt = db.prepare('SELECT * FROM doctors');
  if (specialty && specialty !== 'All') {
    stmt = db.prepare('SELECT * FROM doctors WHERE specialty = ?');
    const doctors = stmt.all(specialty);
    return res.json(doctors);
  }
  const doctors = stmt.all();
  res.json(doctors);
});

// API: LAY DANH SACH CHUYEN KHOA
app.get('/api/specialties', (req, res) => {
  const specialties = db.prepare('SELECT DISTINCT specialty FROM doctors').all().map(d => d.specialty);
  res.json(['All', ...specialties]);
});

// API: LAY GIO TRONG CUA BAC SI
app.get('/api/doctors/:id/availability', (req, res) => {
  const doctorId = req.params.id;
  const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(doctorId);
  const { date } = req.query;

  if (!doctor || !date) {
    return res.status(400).json({ error: 'Thieu thong tin!' });
  }

  // Kiem tra ngay co trong ngay lam viec khong
  const dayOfWeek = new Date(date).getDay();
  if (!doctor.available_days.split(',').includes(String(dayOfWeek))) {
    return res.json([]);
  }

  // Tao gio kham (moi 30 phut)
  const slots = [];
  let [startHour, startMin] = doctor.available_time_start.split(':').map(Number);
  let [endHour, endMin] = doctor.available_time_end.split(':').map(Number);
  let currentHour = startHour;
  let currentMin = startMin;

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
    slots.push(timeStr);
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour++;
    }
  }

  // Loai bo gio da dat
  const bookedSlots = db.prepare('SELECT appointment_time FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND status = "confirmed"').all(doctorId, date).map(a => a.appointment_time);
  const availableSlots = slots.filter(s => !bookedSlots.includes(s));

  res.json(availableSlots);
});

// API: DAT LICH KHAM (can dang nhap)
app.post('/api/appointments', authenticateToken, (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(req.user.userId, doctorId, date, time, reason || '');
    res.json({ id: result.lastInsertRowid, message: 'Dat lich thanh cong!' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Gio nay da duoc dat!' });
    } else {
      res.status(500).json({ error: 'Loi he thong!' });
    }
  }
});

// API: LAY LICH CUA BENH NHAN
app.get('/api/appointments/my', authenticateToken, (req, res) => {
  const appointments = db.prepare(`
    SELECT a.*, d.name as doctor_name, d.specialty FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    WHERE a.patient_id = ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
  `).all(req.user.userId);
  res.json(appointments);
});

// API: HUY LICH
app.delete('/api/appointments/:id', authenticateToken, (req, res) => {
  db.prepare('UPDATE appointments SET status = "cancelled" WHERE id = ?').run(req.params.id);
  res.json({ message: 'Huy lich thanh cong!' });
});

// API ADMIN: Lay tat ca lich
app.get('/api/admin/appointments', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  const appointments = db.prepare(`
    SELECT a.*, d.name as doctor_name, u.name as patient_name 
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    JOIN users u ON a.patient_id = u.id
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
  `).all();
  res.json(appointments);
});

// API ADMIN: Thong ke
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const doctorCount = db.prepare('SELECT COUNT(*) as count FROM doctors').get().count;
  const appointmentCount = db.prepare('SELECT COUNT(*) as count FROM appointments').get().count;
  res.json({ userCount, doctorCount, appointmentCount });
});

// Khoi dong server
app.listen(PORT, () => {
  console.log(`✅ Backend server dang chay tai http://localhost:${PORT}`);
});
