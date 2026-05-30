
const Auth = {
  async register(data) {
    try {
      console.log('[Auth] Registering with:', data);
      const result = await api.register({
        name: data.fullName || data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      });
      console.log('[Auth] Register result:', result);
      
      api.setToken(result.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      
      UI.toast('Đăng ký thành công!', 'success');
      setTimeout(() =&gt; window.location.href = 'patient/index.html', 500);
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('[Auth] Register error:', error);
      UI.toast(error.message || 'Lỗi đăng ký!', 'error');
      return { success: false, message: error.message || 'Lỗi đăng ký!' };
    }
  },

  async login(email, password) {
    try {
      console.log('[Auth] Logging in with:', email);
      const result = await api.login({ email, password });
      console.log('[Auth] Login result:', result);
      
      api.setToken(result.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      
      UI.toast('Đăng nhập thành công!', 'success');
      
      let targetPage = 'patient/index.html';
      if (result.user.role === 'admin') {
        targetPage = 'admin/index.html';
      } else if (result.user.role === 'doctor') {
        targetPage = 'doctor/dashboard.html';
      }
      
      console.log('[Auth] Redirecting to:', targetPage);
      setTimeout(() =&gt; window.location.href = targetPage, 500);
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('[Auth] Login error:', error);
      UI.toast(error.message || 'Lỗi đăng nhập!', 'error');
      return { success: false, message: error.message || 'Lỗi đăng nhập!' };
    }
  },

  logout() {
    api.removeToken();
    localStorage.removeItem('currentUser');
    UI.toast('Đăng xuất thành công!', 'info');
    setTimeout(() =&gt; window.location.href = '../index.html', 300);
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
      window.location.href = '../login.html';
      return false;
    }
    return true;
  },

  requireAdmin() {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'admin') {
      UI.toast('Bạn không có quyền truy cập', 'error');
      window.location.href = '../index.html';
      return false;
    }
    return true;
  },

  getDefaultAvatar(name) {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&amp;background=3498db&amp;color=fff&amp;size=200`;
  }
};
