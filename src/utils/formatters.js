export function formatDate(dateValue) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(`${dateValue}T00:00:00`));
}

export function statusText(status) {
  return {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    done: "Đã khám",
    cancelled: "Đã hủy",
  }[status];
}
