
const Auth = {
  async register(data) {
    try {
      const result = await api.register({
        name: data.fullName || data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      });
      
      api.setToken(result.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      
      UI.toast('Đăng ký thành công!', 'success');
      setTimeout(() =&gt; window.location.href = 'patient/index.html', 500);
      
      return { success: true, user: result.user };
    } catch (error) {
      UI.toast(error.message, 'error');
      return { success: false, message: error.message };
    }
  },

  async login(email, password) {
    try {
      const result = await api.login({ email, password });
      
      api.setToken(result.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      
      UI.toast('Đăng nhập thành công!', 'success');
      
      if (result.user.role === 'admin') {
        setTimeout(() =&gt; window.location.href = 'pages/admin/index.html', 500);
      } else if (result.user.role === 'doctor') {
        setTimeout(() =&gt; window.location.href = 'pages/doctor/dashboard.html', 500);
      } else {
        setTimeout(() =&gt; window.location.href = 'pages/patient/index.html', 500);
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      UI.toast(error.message, 'error');
      return { success: false, message: error.message };
    }
  },

  logout() {
    api.removeToken();
    localStorage.removeItem('currentUser');
    UI.toast('Đăng xuất thành công!', 'info');
    setTimeout(() =&gt; window.location.href = 'index.html', 300);
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  getCurrentPatient() {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'patient') return null;
    return user;
  },

  getCurrentDoctor() {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'doctor') return null;
    return user;
  },

  isAuthenticated() {
    return !!api.getToken() &amp;&amp; !!this.getCurrentUser();
  },

  requireAuth() {
    if (!this.isAuthenticated()) {
      UI.toast('Vui lòng đăng nhập để tiếp tục', 'warning');
      const path = window.location.pathname;
      window.location.href = path.includes('pages/') ? '../login.html' : 'pages/login.html';
      return false;
    }
    return true;
  },

  requireAdmin() {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'admin') {
      UI.toast('Bạn không có quyền truy cập', 'error');
      window.location.href = '../../index.html';
      return false;
    }
    return true;
  },

  getDefaultAvatar(name) {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&amp;background=3498db&amp;color=fff&amp;size=200`;
  }
};
