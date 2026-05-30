
// ==================== UUID ====================
const Utils = {};

Utils.uuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

Utils.generateAppointmentCode = function() {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(100 + Math.random() * 900);
  return `CF-${year}-${random}`;
};

// ==================== DATE ====================
Utils.formatDate = function(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('vi-VN', options);
};

Utils.formatDateShort = function(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

Utils.isDateInPast = function(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

Utils.isSameDay = function(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

Utils.getToday = function() {
  return new Date().toISOString().split('T')[0];
};

Utils.addDays = function(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// ==================== VALIDATE ====================
Utils.validateEmail = function(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

Utils.validatePhone = function(phone) {
  const re = /^0[1-9]\d{8,9}$/;
  return re.test(phone);
};

Utils.validatePassword = function(password) {
  return password.length >= 6;
};

Utils.validateRequired = function(value) {
  return value !== null && value !== undefined && value.trim() !== '';
};
