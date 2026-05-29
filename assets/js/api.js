const ClinicAPI = (() => {
  const STORAGE_KEY = "clinicflow-html-data";

  const seedData = {
    patients: [
      {
        id: "BN001",
        name: "Nguyễn Văn An",
        phone: "0901234567",
        email: "an.nguyen@example.com",
        birthYear: 1994,
        gender: "Nam",
        bloodType: "O+",
        allergies: "Penicillin",
        medicalHistory: "Viêm xoang mãn tính",
      },
    ],
    doctors: [
      {
        id: "D001",
        name: "BS. Phạm Hoàng Nam",
        department: "Nội tổng quát",
        room: "201",
        capacity: 3,
        slots: ["08:00 - 10:00", "10:00 - 11:30", "14:00 - 16:00"],
      },
      {
        id: "D002",
        name: "BS. Đỗ Thu Hà",
        department: "Tim mạch",
        room: "305",
        capacity: 2,
        slots: ["08:00 - 10:00", "13:30 - 15:00", "15:00 - 16:30"],
      },
      {
        id: "D003",
        name: "BS. Nguyễn Quốc Huy",
        department: "Nhi khoa",
        room: "102",
        capacity: 4,
        slots: ["07:30 - 09:00", "09:00 - 10:30", "14:00 - 16:00"],
      },
    ],
    appointments: [],
  };

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function read() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const initial = structuredClone(seedData);
      initial.appointments.push({
        id: "LK001",
        patientId: "BN001",
        doctorId: "D001",
        date: today(),
        slot: "08:00 - 10:00",
        reason: "Đau đầu, mệt mỏi",
        status: "confirmed",
      });
      write(initial);
      return initial;
    }
    return JSON.parse(saved);
  }

  function write(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  function nextId(prefix, items) {
    const max = items.reduce((highest, item) => {
      const value = Number(String(item.id).replace(prefix, ""));
      return Number.isFinite(value) && value > highest ? value : highest;
    }, 0);
    return `${prefix}${String(max + 1).padStart(3, "0")}`;
  }

  function savePatient(profile) {
    const data = read();
    const phone = profile.phone.replace(/\s/g, "");
    const existing = data.patients.find((patient) => patient.phone === phone);
    if (existing) {
      Object.assign(existing, { ...profile, phone });
    } else {
      data.patients.push({ id: nextId("BN", data.patients), ...profile, phone });
    }
    return write(data);
  }

  function saveAppointment(payload) {
    const data = read();
    data.appointments.push({ id: nextId("LK", data.appointments), status: payload.status || "pending", ...payload });
    return write(data);
  }

  function updateAppointmentStatus(id, status) {
    const data = read();
    const appointment = data.appointments.find((item) => item.id === id);
    if (appointment) appointment.status = status;
    return write(data);
  }

  function countBooked(data, doctorId, date, slot) {
    return data.appointments.filter(
      (item) => item.doctorId === doctorId && item.date === date && item.slot === slot && item.status !== "cancelled"
    ).length;
  }

  return { read, write, savePatient, saveAppointment, updateAppointmentStatus, countBooked, today };
})();

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector("#menuButton");
  const mainNav = document.querySelector("#mainNav");
  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => mainNav.classList.toggle("open"));
  }
});
