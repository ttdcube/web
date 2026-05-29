
// storage.js - Quản lý toàn bộ dữ liệu trong LocalStorage
const Storage = {
  // Khóa lưu trữ
  KEYS: {
    USERS: 'clinicflow_users',
    DOCTORS: 'clinicflow_doctors',
    APPOINTMENTS: 'clinicflow_appointments',
    CURRENT_USER: 'clinicflow_current_user'
  },

  // Khởi tạo dữ liệu mặc định
  init() {
    if (!localStorage.getItem(this.KEYS.DOCTORS)) {
      localStorage.setItem(this.KEYS.DOCTORS, JSON.stringify(INITIAL_DATA.doctors));
    }
    if (!localStorage.getItem(this.KEYS.USERS)) {
      // Tài khoản admin mặc định
      const defaultUsers = [
        {
          id: 1,
          name: "Admin Clinic",
          email: "admin@clinicflow.com",
          phone: "0900000000",
          password: "admin123", // Lưu ý: Không làm thế này trong sản phẩm thật (nên mã hóa)
          role: "admin",
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem(this.KEYS.APPOINTMENTS)) {
      localStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify([]));
    }
  },

  // Lấy dữ liệu
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  // Lưu dữ liệu
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Người dùng
  getUsers() { return this.get(this.KEYS.USERS) || []; },
  setUsers(users) { this.set(this.KEYS.USERS, users); },
  
  // Bác sĩ
  getDoctors() { return this.get(this.KEYS.DOCTORS) || []; },
  setDoctors(doctors) { this.set(this.KEYS.DOCTORS, doctors); },

  // Lịch hẹn
  getAppointments() { return this.get(this.KEYS.APPOINTMENTS) || []; },
  setAppointments(appointments) { this.set(this.KEYS.APPOINTMENTS, appointments); },

  // Người dùng hiện tại
  getCurrentUser() { return this.get(this.KEYS.CURRENT_USER); },
  setCurrentUser(user) { this.set(this.KEYS.CURRENT_USER, user); },
  clearCurrentUser() { localStorage.removeItem(this.KEYS.CURRENT_USER); }
};

// Khởi tạo khi load file
Storage.init();
