import { readData, writeData } from "./api.js";

function nextId(prefix, items) {
  const max = items.reduce((highest, item) => {
    const value = Number(String(item.id).replace(prefix, ""));
    return Number.isFinite(value) && value > highest ? value : highest;
  }, 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export function getPatients() {
  return readData().patients;
}

export function savePatient(payload) {
  const data = readData();
  const existing = data.patients.find((patient) => patient.phone === payload.phone);
  if (existing) {
    Object.assign(existing, payload);
    return writeData(data);
  }

  data.patients.push({ id: nextId("BN", data.patients), ...payload });
  return writeData(data);
}
