const STORAGE_KEY = "clinicflow-pro-data";

export const seedData = {
  patients: [
    { id: "BN001", name: "Nguyễn Văn An", phone: "0901234567", birthYear: 1994, gender: "Nam" },
    { id: "BN002", name: "Trần Thị Bình", phone: "0912345678", birthYear: 1981, gender: "Nữ" },
  ],
  doctors: [
    {
      id: "D001",
      name: "BS. Phạm Hoàng Nam",
      department: "Nội tổng quát",
      room: "201",
      slots: ["08:00 - 10:00", "10:00 - 11:30", "14:00 - 16:00"],
      capacity: 3,
    },
    {
      id: "D002",
      name: "BS. Đỗ Thu Hà",
      department: "Tim mạch",
      room: "305",
      slots: ["08:00 - 10:00", "13:30 - 15:00", "15:00 - 16:30"],
      capacity: 2,
    },
  ],
  appointments: [
    {
      id: "LK001",
      patientId: "BN001",
      doctorId: "D001",
      date: new Date().toISOString().slice(0, 10),
      slot: "08:00 - 10:00",
      reason: "Đau đầu, mệt mỏi",
      status: "confirmed",
    },
  ],
};

export function readData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : structuredClone(seedData);
}

export function writeData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function resetData() {
  return writeData(structuredClone(seedData));
}
