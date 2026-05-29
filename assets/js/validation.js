const ClinicValidation = (() => {
  function phone(value) {
    return /^0\d{9}$/.test(String(value).replace(/\s/g, ""));
  }

  function email(value) {
    if (!value) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
  }

  function birthYear(value) {
    const year = Number(value);
    return year >= 1920 && year <= new Date().getFullYear();
  }

  function setFieldState(input, message) {
    const field = input.closest(".field");
    const error = field?.querySelector(".field-error");
    field?.classList.toggle("invalid", Boolean(message));
    if (error) error.textContent = message || "";
  }

  return { phone, email, birthYear, setFieldState };
})();
