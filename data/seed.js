
/**
 * seed.js - Dữ liệu mẫu cho hệ thống v2.0
 * Tạo dữ liệu người dùng, bác sĩ, lịch khám mẫu
 */

const SeedData = {
  run: function() {
    console.log('Starting seed...');

    // 1. Tạo tài khoản admin
    const adminId = Utils.uuid();
    const adminPassword = Auth.hashPassword('admin123');
    const adminUser = {
      id: adminId,
      email: 'admin@clinicflow.com',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    Storage.setUsers([adminUser]);

    // 2. Tạo tài khoản bệnh nhân mẫu
    const patientUsers = [
      { id: Utils.uuid(), email: 'nguyen.van.a@example.com', password: Auth.hashPassword('123456'), role: 'patient', createdAt: new Date().toISOString() },
      { id: Utils.uuid(), email: 'tran.thi.b@example.com', password: Auth.hashPassword('123456'), role: 'patient', createdAt: new Date().toISOString() }
    ];
    Storage.setUsers([adminUser, ...patientUsers]);

    // 3. Tạo bệnh nhân profiles
    const patients = [
      {
        id: Utils.uuid(),
        userId: patientUsers[0].id,
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=2ecc71&color=fff&size=200',
        birthDate: '1990-05-15',
        gender: 'male',
        bloodType: 'A',
        allergies: 'Không',
        medicalHistory: 'Không có bệnh nền'
      },
      {
        id: Utils.uuid(),
        userId: patientUsers[1].id,
        fullName: 'Trần Thị B',
        phone: '0912345678',
        avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=9b59b6&color=fff&size=200',
        birthDate: '1995-08-20',
        gender: 'female',
        bloodType: 'O',
        allergies: 'Phấn hoa',
        medicalHistory: 'Hen nhẹ'
      }
    ];
    Storage.setPatients(patients);

    // 4. Tạo danh sách bác sĩ mẫu
    const testDoctorUserId = Utils.uuid();
    const specialties = ['Nội khoa', 'Nhi khoa', 'Tim mạch', 'Da liễu', 'Tai mũi họng', 'Nha khoa', 'Khoa thần kinh'];
    const doctorNames = [
      'Nguyễn Thanh Tùng', 'Trần Thị Mai', 'Lê Văn Hưng', 'Phạm Thị Hương',
      'Hoàng Văn Dũng', 'Đỗ Thị Hà', 'Nguyễn Văn Hải', 'Bùi Thị Thảo'
    ];
    const doctors = [];
    for (let i = 0; i < 8; i++) {
      doctors.push({
        id: Utils.uuid(),
        userId: i === 0 ? testDoctorUserId : null,
        fullName: doctorNames[i],
        specialty: specialties[i % specialties.length],
        phone: '09' + String(i).repeat(2) + '12345' + (i % 10),
        email: 'bacsi.' + doctorNames[i].toLowerCase().replace(/\s+/g, '.') + '@clinicflow.com',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorNames[i])}&background=${['3498db', '2ecc71', 'e74c3c', '9b59b6', 'f1c40f', '1abc9c', '34495e', 'e67e22'][i]}&color=fff&size=200`,
        bio: `Bác sĩ ${doctorNames[i]} có hơn ${10 + i} năm kinh nghiệm làm việc tại các bệnh viện lớn. Chuyên môn sâu về ${specialties[i % specialties.length]}.`,
        availableDays: [1, 2, 3, 4, 5].slice(0, 3 + (i % 3)), // 3-5 ngày làm việc/tuần
        availableTimeStart: '08:00',
        availableTimeEnd: ['17:00', '18:00', '16:30'][i % 3],
        price: [300000, 350000, 500000, 280000, 320000, 400000, 450000, 330000][i],
        rating: 4.0 + Math.random() * 1.0,
        totalReviews: Math.floor(20 + Math.random() * 100)
      });
    }
    Storage.setDoctors(doctors);

    // 4.1 Add test doctor user
    const doctorUser = {
      id: testDoctorUserId,
      email: 'doctor@clinicflow.com',
      password: Auth.hashPassword('123456'),
      role: 'doctor',
      createdAt: new Date().toISOString()
    };
    Storage.setUsers([adminUser, ...patientUsers, doctorUser]);

    // 5. Tạo lịch khám mẫu
    const appointments = [];
    const statuses = ['confirmed', 'completed', 'cancelled'];
    for (let i = 0; i < 12; i++) {
      const doctor = doctors[i % doctors.length];
      const patient = patients[i % patients.length];
      const daysAgo = Math.floor(Math.random() * 30) - 5; // Từ 5 ngày trước đến 25 ngày sau
      const appointmentDate = Utils.addDays(Utils.getToday(), daysAgo);
      const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '14:00', '14:30', '15:00', '15:30'];
      const time = timeSlots[Math.floor(Math.random() * timeSlots.length)];

      appointments.push({
        id: Utils.uuid(),
        appointmentCode: Utils.generateAppointmentCode(),
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentDate: appointmentDate,
        appointmentTime: time,
        reason: ['Kiểm tra sức khỏe định kỳ', 'Đau đầu', 'Khám theo dõi', 'Tư vấn sức khỏe'][Math.floor(Math.random() * 4)],
        status: daysAgo < 0 ? 'completed' : statuses[Math.floor(Math.random() * statuses.length)],
        notes: '',
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    Storage.setAppointments(appointments);

    // 6. Khởi tạo settings
    Storage.setSettings({ theme: 'light', currentUserId: null });

    console.log('Seed completed successfully!');
  }
};

