
const UI = {
  toast: function(message, type = 'info') {
    const container = document.getElementById('toast-container') || this.createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() =&gt; toast.classList.add('show'), 10);
    setTimeout(() =&gt; {
      toast.classList.remove('show');
      setTimeout(() =&gt; toast.remove(), 300);
    }, 4000);
  },

  createToastContainer: function() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
  },

  openModal: function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal: function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  initModals: function() {
    document.querySelectorAll('.modal-overlay, .modal-close').forEach(el =&gt; {
      el.addEventListener('click', (e) =&gt; {
        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
          const modal = e.target.closest('.modal-overlay');
          if (modal) this.closeModal(modal.id);
        }
      });
    });
  },

  applyTheme: function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  },

  initTheme: function() {
    this.applyTheme('light');
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () =&gt; {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        this.applyTheme(next);
      });
    }
  },

  showSkeleton: function(containerId, count = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let html = '';
    for (let i = 0; i &lt; count; i++) {
      html += '&lt;div class="skeleton"&gt;&lt;div class="skeleton-line"&gt;&lt;/div&gt;&lt;div class="skeleton-line w-75"&gt;&lt;/div&gt;&lt;/div&gt;';
    }
    container.innerHTML = html;
  },

  showEmpty: function(containerId, message = 'Không có dữ liệu', icon = '📭') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
      &lt;div class="empty-state"&gt;
        &lt;div class="empty-state-icon"&gt;${icon}&lt;/div&gt;
        &lt;p&gt;${message}&lt;/p&gt;
      &lt;/div&gt;
    `;
  },

  formatCurrency: function(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  },

  closeSidebar: function() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('active');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
  },

  openSidebar: function() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.add('active');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.classList.add('active');
  },

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
