
/**
 * ui.js - Quản lý toàn bộ phần giao diện: toast, modal, loading, theme
 */

const UI = {
  /**
   * Hiển thị Toast Notification
   * @param {string} message - Thông báo
   * @param {string} type - success | error | warning | info
   */
  toast: function(message, type = 'info') {
    const container = document.getElementById('toast-container') || this.createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Animation
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  createToastContainer: function() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
  },

  /**
   * Mở Modal
   * @param {string} id - ID của modal
   */
  openModal: function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  /**
   * Đóng Modal
   * @param {string} id - ID của modal
   */
  closeModal: function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  /**
   * Khởi tạo toggle đóng modal bằng nút X hoặc overlay
   */
  initModals: function() {
    document.querySelectorAll('.modal-overlay, .modal-close').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
          const modal = e.target.closest('.modal-overlay');
          if (modal) this.closeModal(modal.id);
        }
      });
    });
  },

  /**
   * Toggle Dark Mode
   */
  toggleTheme: function() {
    const currentTheme = Storage.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    Storage.setTheme(newTheme);
    this.applyTheme(newTheme);
    this.toast(`Đã chuyển sang ${newTheme === 'dark' ? 'chế độ tối' : 'chế độ sáng'}`, 'success');
  },

  /**
   * Áp dụng theme vào body
   */
  applyTheme: function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  },

  /**
   * Khởi tạo theme ban đầu
   */
  initTheme: function() {
    this.applyTheme(Storage.getTheme());
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggleTheme());
    }
  },

  /**
   * Hiển thị Loading Skeleton
   */
  showSkeleton: function(containerId, count = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let html = '';
    for (let i = 0; i < count; i++) {
      html += '<div class="skeleton"><div class="skeleton-line"></div><div class="skeleton-line w-75"></div></div>';
    }
    container.innerHTML = html;
  },

  /**
   * Hiển thị Empty State
   */
  showEmpty: function(containerId, message = 'Không có dữ liệu', icon = '📭', setInnerHtml = true) {
    const html = `
      <div class="empty-state">
        <div class="empty-state-icon">${icon}</div>
        <p>${message}</p>
      </div>
    `;
    if (containerId && setInnerHtml) {
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = html;
    }
    return html;
  },

  /**
   * Format tiền VND
   */
  formatCurrency: function(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  },

  /**
   * Đóng sidebar trên mobile
   */
  closeSidebar: function() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('active');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
  },

  /**
   * Mở sidebar trên mobile
   */
  openSidebar: function() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.add('active');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.classList.add('active');
  },

  /**
   * Toggle show/hide password
   */
  togglePassword: function(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      button.textContent = '🙈';
    } else {
      input.type = 'password';
      button.textContent = '👁️';
    }
  }
};

