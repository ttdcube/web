import { readData, writeData } from "./api.js";

function nextId(prefix, items) {
  const max = items.reduce((highest, item) => {
    const value = Number(String(item.id).replace(prefix, ""));
    return Number.isFinite(value) && value > highest ? value : highest;
  }, 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export function getDoctors() {
  return readData().doctors;
}

export function getAppointments() {
  return readData().appointments;
}

export function saveAppointment(payload) {
  const data = readData();
  data.appointments.push({ id: nextId("LK", data.appointments), status: payload.status || "pending", ...payload });
  return writeData(data);
}

export function updateAppointmentStatus(id, status) {
  const data = readData();
  const appointment = data.appointments.find((item) => item.id === id);
  if (appointment) appointment.status = status;
  return writeData(data);
}
