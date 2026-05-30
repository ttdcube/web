
/**
 * auth.js - Xử lý đăng nhập, đăng ký, đăng xuất, quản lý phiên đăng nhập
 * Sử dụng bcryptjs để mã hóa mật khẩu (mô phỏng bằng thư viện thu gọn)
 */

const Auth = {
  /**
   * Đăng ký tài khoản mới
   * @param {object} data - { email, password, fullName, phone }
   * @returns {object} - { success: boolean, message: string, user?: object }
   */
  register: function(data) {
    // Validate
    if (!Utils.validateEmail(data.email)) {
      return { success: false, message: 'Email không hợp lệ' };
    }
    if (!Utils.validatePhone(data.phone)) {
      return { success: false, message: 'Số điện thoại không hợp lệ (phải là 10-11 số, bắt đầu bằng 0)' };
    }
    if (!Utils.validatePassword(data.password)) {
      return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
    }
    const fullName = data.fullName || data.name;
    if (!Utils.validateRequired(fullName)) {
      return { success: false, message: 'Vui lòng nhập họ tên' };
    }

    // Kiểm tra email đã tồn tại chưa
    if (Storage.getUserByEmail(data.email)) {
      return { success: false, message: 'Email này đã được đăng ký' };
    }

    // Mã hóa mật khẩu (mô phỏng bcrypt bằng đơn giản hóa)
    // Lưu ý: Trong thực tế phải dùng bcryptjs thật!
    const hashedPassword = this.hashPassword(data.password);

    // Tạo user
    const userId = Utils.uuid();
    const user = {
      id: userId,
      email: data.email,
      password: hashedPassword,
      role: 'patient',
      createdAt: new Date().toISOString()
    };
    Storage.addUser(user);

    // Tạo patient profile
    const patient = {
      id: Utils.uuid(),
      userId: userId,
      fullName: fullName,
      phone: data.phone,
      avatar: this.getDefaultAvatar(fullName),
      birthDate: '',
      gender: 'other',
      bloodType: 'unknown',
      allergies: '',
      medicalHistory: ''
    };
    Storage.addPatient(patient);

    return { success: true, message: 'Đăng ký thành công!', user };
  },

  /**
   * Đăng nhập
   * @param {string} email
   * @param {string} password
   * @returns {object}
   */
  login: function(email, password) {
    const user = Storage.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }
    if (!this.verifyPassword(password, user.password)) {
      return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }

    // Lưu phiên đăng nhập
    Storage.setCurrentUserId(user.id);
    UI.toast('Đăng nhập thành công!', 'success');

    // Chuyển hướng
    if (user.role === 'admin') {
      setTimeout(() => window.location.href = 'admin/index.html', 500);
    } else if (user.role === 'doctor') {
      setTimeout(() => window.location.href = 'doctor/dashboard.html', 500);
    } else {
      setTimeout(() => window.location.href = 'patient/index.html', 500);
    }
    return { success: true, user };
  },

  /**
   * Đăng xuất
   */
  logout: function() {
    Storage.setCurrentUserId(null);
    UI.toast('Đăng xuất thành công!', 'info');
    setTimeout(() => window.location.href = '../../index.html', 300);
  },

  /**
   * Lấy user hiện tại
   * @returns {object|null}
   */
  getCurrentUser: function() {
    const userId = Storage.getCurrentUserId();
    if (!userId) return null;
    return Storage.getUserById(userId);
  },

  /**
   * Lấy patient hiện tại (nếu có)
   */
  getCurrentPatient: function() {
    const userId = Storage.getCurrentUserId();
    if (!userId) return null;
    return Storage.getPatientByUserId(userId);
  },

  /**
   * Lấy doctor hiện tại (nếu có)
   */
  getCurrentDoctor: function() {
    const userId = Storage.getCurrentUserId();
    if (!userId) return null;
    return Storage.getDoctorByUserId(userId);
  },

  /**
   * Kiểm tra đã đăng nhập chưa
   * @returns {boolean}
   */
  isAuthenticated: function() {
    return !!Storage.getCurrentUserId();
  },

  /**
   * Yêu cầu đăng nhập nếu chưa
   */
  requireAuth: function() {
    if (!this.isAuthenticated()) {
      UI.toast('Vui lòng đăng nhập để tiếp tục', 'warning');
      const path = window.location.pathname;
      const isAdmin = path.includes('/admin/');
      window.location.href = isAdmin ? '../../login.html' : '../login.html';
      return false;
    }
    return true;
  },

  /**
   * Yêu cầu quyền admin
   */
  requireAdmin: function() {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'admin') {
      UI.toast('Bạn không có quyền truy cập', 'error');
      window.location.href = '../../index.html';
      return false;
    }
    return true;
  },

  // ========== Helper functions ==========
  hashPassword: function(password) {
    // Mô phỏng bcrypt bằng cách mã hóa đơn giản (KHÔNG dùng trong production thật!)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'hashed_' + Math.abs(hash);
  },

  verifyPassword: function(password, hashedPassword) {
    return this.hashPassword(password) === hashedPassword;
  },

  getDefaultAvatar: function(name) {
    // Tạo avatar dùng ui-avatars.com
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=3498db&color=fff&size=200`;
  }
};

