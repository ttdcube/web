
// ui.js - Quan ly giao dien
const UI = {
  // Toast notification
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || this.createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
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
    if (container) container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  },

  hideLoading(containerId, content) {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = content;
  },

  // Empty state
  showEmpty(containerId, message = 'Khong co du lieu') {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><p>${message}</p></div>`;
  },

  // Format tien
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  },

  // Format ngay
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  },

  // Cap nhat navbar
  updateNavbar(user) {
    const navbarUser = document.querySelector('.navbar-user');
    const loginBtn = document.querySelector('.navbar-nav .login-btn');

    if (user) {
      if (loginBtn) loginBtn.remove();
      if (navbarUser) {
        navbarUser.innerHTML = `
          <span>Xin chao, ${user.name}</span>
          <button class="btn btn-secondary btn-sm" id="logout-btn">Dang xuat</button>
        `;
        document.getElementById('logout-btn').addEventListener('click', () => {
          api.clearAuth();
          UI.showToast('Dang xuat thanh cong!', 'success');
          window.location.href = 'index.html';
        });
      }
    }
  }
};

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
});
