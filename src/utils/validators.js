export function validatePhone(phone) {
  return /^0\d{9}$/.test(String(phone).replace(/\s/g, ""));
}

export function validateBirthYear(year) {
  const value = Number(year);
  return value >= 1920 && value <= new Date().getFullYear();
}
