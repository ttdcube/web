
// database.js - Khoi tao va ket noi CSDL SQLite
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'clinicflow.db'));
db.pragma('journal_mode = WAL');

// Tao bang Users
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'patient',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Tao bang Doctors
db.exec(`
  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    avatar TEXT,
    bio TEXT,
    available_days TEXT,
    available_time_start TEXT,
    available_time_end TEXT,
    price INTEGER DEFAULT 300000
  )
`);

// Tao bang Appointments
db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    UNIQUE(doctor_id, appointment_date, appointment_time)
  )
`);

// Chen du lieu mac dinh (admin va doctors)
const insertUser = db.prepare('INSERT OR IGNORE INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)');
const insertDoctor = db.prepare('INSERT OR IGNORE INTO doctors (name, specialty, phone, email, bio, available_days, available_time_start, available_time_end, price, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

// Admin mat khau: admin123 (ma hoa)
const bcrypt = require('bcryptjs');
insertUser.run('Admin Clinic', 'admin@clinicflow.com', '0900000000', bcrypt.hashSync('admin123', 10), 'admin');

// Dữ liệu bác sĩ
const doctors = [
  {
    name: 'BS. Nguyen Thanh Tung',
    specialty: 'Noi khoa',
    phone: '0901234567',
    email: 'tung.nguyen@clinicflow.com',
    bio: 'Kinh nghiem 15 nam kham va dieu tri cac benh noi khoa',
    available_days: '1,2,3,4,5',
    available_time_start: '08:00',
    available_time_end: '17:00',
    price: 300000,
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thanh+Tung&background=3498db&color=fff&size=128'
  },
  {
    name: 'BS. Tran Thi Mai',
    specialty: 'Nhi khoa',
    phone: '0912345678',
    email: 'mai.tran@clinicflow.com',
    bio: 'Chuyen gia ve benh tre em, nhiet tinh va thuong yeu tre em',
    available_days: '1,2,4,5,6',
    available_time_start: '07:30',
    available_time_end: '16:30',
    price: 350000,
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+Mai&background=2ecc71&color=fff&size=128'
  },
  {
    name: 'BS. Le Van Hung',
    specialty: 'Tim mach',
    phone: '0923456789',
    email: 'hung.le@clinicflow.com',
    bio: 'Giao su, Tien si chuyen nganh tim mach',
    available_days: '2,3,5,6',
    available_time_start: '09:00',
    available_time_end: '18:00',
    price: 500000,
    avatar: 'https://ui-avatars.com/api/?name=Le+Van+Hung&background=e74c3c&color=fff&size=128'
  },
  {
    name: 'BS. Pham Thi Huong',
    specialty: 'Da lieu',
    phone: '0934567890',
    email: 'huong.pham@clinicflow.com',
    bio: 'Cham soc va dieu tri cac benh ve da',
    available_days: '1,3,4,6',
    available_time_start: '08:30',
    available_time_end: '17:30',
    price: 280000,
    avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+Huong&background=9b59b6&color=fff&size=128'
  }
];

doctors.forEach(d => {
  insertDoctor.run(d.name, d.specialty, d.phone, d.email, d.bio, d.available_days, d.available_time_start, d.available_time_end, d.price, d.avatar);
});

console.log('Database initialized!');

module.exports = db;
