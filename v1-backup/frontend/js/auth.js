
// auth.js - Đăng ký, đăng nhập, đăng xuất
const Auth = {
  // Đăng ký
  register(userData) {
    const users = Storage.getUsers();
    
    // Kiểm tra email đã tồn tại chưa
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: "Email đã được sử dụng!" };
    }

    // Tạo user mới
    const newUser = {
      id: Date.now(),
      ...userData,
      role: "patient",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    Storage.setUsers(users);
    
    return { success: true, message: "Đăng ký thành công!" };
  },

  // Đăng nhập
  login(email, password) {
    const users = Storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      Storage.setCurrentUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, message: "Email hoặc mật khẩu không đúng!" };
  },

  // Đăng xuất
  logout() {
    Storage.clearCurrentUser();
    UI.showToast("Đăng xuất thành công!", "success");
    window.location.href = "index.html";
  },

  // Kiểm tra đã đăng nhập chưa
  isLoggedIn() {
    return !!Storage.getCurrentUser();
  },

  // Kiểm tra quyền admin
  isAdmin() {
    const user = Storage.getCurrentUser();
    return user?.role === 'admin';
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser() {
    return Storage.getCurrentUser();
  }
};
