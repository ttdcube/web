
/**
 * storage.js - Quản lý LocalStorage toàn bộ hệ thống
 * Đảm bảo tính nhất quán cho toàn bộ dữ liệu
 */

const Storage = {
  // KEYS
  KEYS: {
    USERS: 'clinicflow_users',
    PATIENTS: 'clinicflow_patients',
    DOCTORS: 'clinicflow_doctors',
    APPOINTMENTS: 'clinicflow_appointments',
    REVIEWS: 'clinicflow_reviews',
    SETTINGS: 'clinicflow_settings',
    SEED_VERSION: 'clinicflow_seed_version'
  },

  // Version để kiểm tra seed
  SEED_VERSION: '2.2.0',

  /**
   * Khởi tạo storage nếu chưa có
   */
  init: function() {
    // Không seed ở đây nữa, seed sau khi load xong toàn bộ script
  },

  /**
   * Lấy dữ liệu từ LocalStorage
   */
  get: function(key, defaultValue = []) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },

  /**
   * Lưu dữ liệu vào LocalStorage
   */
  set: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // ========== USERS ==========
  getUsers: function() {
    return this.get(this.KEYS.USERS, []);
  },
  setUsers: function(users) {
    this.set(this.KEYS.USERS, users);
  },
  getUserByEmail: function(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById: function(id) {
    return this.getUsers().find(u => u.id === id);
  },
  addUser: function(user) {
    const users = this.getUsers();
    users.push(user);
    this.setUsers(users);
    return user;
  },

  // ========== PATIENTS ==========
  getPatients: function() {
    return this.get(this.KEYS.PATIENTS, []);
  },
  setPatients: function(patients) {
    this.set(this.KEYS.PATIENTS, patients);
  },
  getPatientByUserId: function(userId) {
    return this.getPatients().find(p => p.userId === userId);
  },
  getPatientById: function(id) {
    return this.getPatients().find(p => p.id === id);
  },
  addPatient: function(patient) {
    const patients = this.getPatients();
    patients.push(patient);
    this.setPatients(patients);
    return patient;
  },
  updatePatient: function(patientId, updates) {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === patientId);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates };
      this.setPatients(patients);
      return patients[index];
    }
    return null;
  },

  // ========== DOCTORS ==========
  getDoctors: function() {
    return this.get(this.KEYS.DOCTORS, []);
  },
  setDoctors: function(doctors) {
    this.set(this.KEYS.DOCTORS, doctors);
  },
  getDoctorById: function(id) {
    return this.getDoctors().find(d => d.id === id);
  },
  getDoctorByUserId: function(userId) {
    return this.getDoctors().find(d => d.userId === userId);
  },
  updateDoctor: function(doctorId, updates) {
    const doctors = this.getDoctors();
    const index = doctors.findIndex(d => d.id === doctorId);
    if (index !== -1) {
      doctors[index] = { ...doctors[index], ...updates };
      this.setDoctors(doctors);
      return doctors[index];
    }
    return null;
  },
  addDoctor: function(doctor) {
    const doctors = this.getDoctors();
    doctors.push(doctor);
    this.setDoctors(doctors);
    return doctor;
  },

  // ========== APPOINTMENTS ==========
  getAppointments: function() {
    return this.get(this.KEYS.APPOINTMENTS, []);
  },
  setAppointments: function(appointments) {
    this.set(this.KEYS.APPOINTMENTS, appointments);
  },
  getAppointmentsByPatientId: function(patientId) {
    return this.getAppointments().filter(a => a.patientId === patientId).sort((a, b) => {
      const dateA = new Date(a.appointmentDate + 'T' + a.appointmentTime);
      const dateB = new Date(b.appointmentDate + 'T' + b.appointmentTime);
      return dateB - dateA;
    });
  },
  getAppointmentsByDoctorId: function(doctorId) {
    return this.getAppointments().filter(a => a.doctorId === doctorId);
  },
  getAppointmentById: function(id) {
    return this.getAppointments().find(a => a.id === id);
  },
  addAppointment: function(appointment) {
    const appointments = this.getAppointments();
    appointments.push(appointment);
    this.setAppointments(appointments);
    return appointment;
  },
  updateAppointment: function(id, updates) {
    const appointments = this.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates, updatedAt: new Date().toISOString() };
      this.setAppointments(appointments);
      return appointments[index];
    }
    return null;
  },
  isSlotAvailable: function(doctorId, date, time) {
    return !this.getAppointments().some(a =>
      a.doctorId === doctorId &&
      a.appointmentDate === date &&
      a.appointmentTime === time &&
      a.status !== 'cancelled'
    );
  },

  // ========== SETTINGS ==========
  getSettings: function() {
    const defaultSettings = { theme: 'light', currentUserId: null };
    const settings = this.get(this.KEYS.SETTINGS, defaultSettings);
    return { ...defaultSettings, ...settings };
  },
  setSettings: function(settings) {
    const currentSettings = this.getSettings();
    this.set(this.KEYS.SETTINGS, { ...currentSettings, ...settings });
  },
  getCurrentUserId: function() {
    return this.getSettings().currentUserId;
  },
  setCurrentUserId: function(userId) {
    this.setSettings({ currentUserId: userId });
  },
  getTheme: function() {
    return this.getSettings().theme;
  },
  setTheme: function(theme) {
    this.setSettings({ theme: theme });
  },

  // ========== SEED DATA ==========
  seed: function() {
    console.log('Seeding database with v2.0.0 data...');
    SeedData.run();
    localStorage.setItem(this.KEYS.SEED_VERSION, this.SEED_VERSION);
  }
};

