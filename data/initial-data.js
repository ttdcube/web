
// Dữ liệu mẫu cho hệ thống
const INITIAL_DATA = {
  // Danh sách bác sĩ
  doctors: [
    {
      id: 1,
      name: "BS. Nguyễn Thanh Tùng",
      specialty: "Nội khoa",
      phone: "0901234567",
      email: "tung.nguyen@clinicflow.com",
      avatar: "https://ui-avatars.com/api/?name=Nguyễn+Thanh+Tùng&background=3498db&color=fff&size=128",
      bio: "Kinh nghiệm 15 năm khám và điều trị các bệnh nội khoa",
      availableDays: [1, 2, 3, 4, 5], // 2-6 (Thứ 2 đến Thứ 6)
      availableTime: { start: "08:00", end: "17:00" },
      price: 300000
    },
    {
      id: 2,
      name: "BS. Trần Thị Mai",
      specialty: "Nhi khoa",
      phone: "0912345678",
      email: "mai.tran@clinicflow.com",
      avatar: "https://ui-avatars.com/api/?name=Trần+Thị+Mai&background=2ecc71&color=fff&size=128",
      bio: "Chuyên gia về bệnh trẻ em, nhiệt tình và thương yêu trẻ",
      availableDays: [1, 2, 4, 5, 6],
      availableTime: { start: "07:30", end: "16:30" },
      price: 350000
    },
    {
      id: 3,
      name: "BS. Lê Văn Hùng",
      specialty: "Tim mạch",
      phone: "0923456789",
      email: "hung.le@clinicflow.com",
      avatar: "https://ui-avatars.com/api/?name=Lê+Văn+Hùng&background=e74c3c&color=fff&size=128",
      bio: "Giáo sư, Tiến sĩ chuyên ngành tim mạch",
      availableDays: [2, 3, 5, 6],
      availableTime: { start: "09:00", end: "18:00" },
      price: 500000
    },
    {
      id: 4,
      name: "BS. Phạm Thị Hương",
      specialty: "Da liễu",
      phone: "0934567890",
      email: "huong.pham@clinicflow.com",
      avatar: "https://ui-avatars.com/api/?name=Phạm+Thị+Hương&background=9b59b6&color=fff&size=128",
      bio: "Chăm sóc và điều trị các bệnh về da",
      availableDays: [1, 3, 4, 6],
      availableTime: { start: "08:30", end: "17:30" },
      price: 280000
    }
  ],

  // Danh sách chuyên khoa (để lọc bác sĩ)
  specialties: ["Tất cả", "Nội khoa", "Nhi khoa", "Tim mạch", "Da liễu", "Ngoại khoa"],

  // Thời gian khám (mỗi 30 phút)
  timeSlots: [
    "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ]
};
