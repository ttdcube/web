
// ui.js - Quản lý giao diện (toast, modal, loading, format, validation)
const UI = {
  // Toast notification
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || this.createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
  },

  // Modal
  openModal(id) {
    document.getElementById(id)?.classList.add('active');
  },

  closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
  },

  // Loading
  showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="loading">
          <div class="spinner"></div>
        </div>
      `;
    }
  },

  hideLoading(containerId, content) {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = content;
  },

  // Empty state
  showEmpty(containerId, message = "Không có dữ liệu") {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>${message}</p>
        </div>
      `;
    }
  },

  // Định dạng tiền
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  },

  // Định dạng ngày
  formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  },

  // Validation
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validatePhone(phone) {
    return /^0[0-9]{9,10}$/.test(phone);
  },

  // Kiểm tra ngày quá khứ
  isDateInPast(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    return date < today;
  },

  // Cập nhật navbar theo người dùng
  updateNavbar(user) {
    const navLinks = document.querySelectorAll('.navbar-nav');
    const navbarUser = document.querySelector('.navbar-user');
    
    if (user) {
      if (navbarUser) {
        navbarUser.innerHTML = `
          <span>Xin chào, ${user.name}</span>
          <button class="btn btn-secondary btn-sm" id="logout-btn">Đăng xuất</button>
        `;
        document.getElementById('logout-btn')?.addEventListener('click', () => {
          Auth.logout();
        });
      }
    }
  }
};

// Đóng modal khi click vào overlay
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});
