
// appointment.js - Đặt lịch, xem lịch, hủy lịch
const Appointment = {
  // Đặt lịch
  create(appointmentData) {
    const appointments = Storage.getAppointments();

    // Kiểm tra trùng lịch
    const conflict = appointments.find(a =>
      a.doctorId === appointmentData.doctorId &&
      a.date === appointmentData.date &&
      a.time === appointmentData.time &&
      a.status !== 'cancelled'
    );
    if (conflict) {
      return { success: false, message: "Giờ này đã được đặt!" };
    }

    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    Storage.setAppointments(appointments);
    return { success: true, message: "Đặt lịch thành công!", appointment: newAppointment };
  },

  // Lấy lịch của bệnh nhân
  getByPatient(patientId) {
    const appointments = Storage.getAppointments();
    return appointments.filter(a => a.patientId === patientId);
  },

  // Lấy lịch của bác sĩ
  getByDoctor(doctorId) {
    const appointments = Storage.getAppointments();
    return appointments.filter(a => a.doctorId === doctorId);
  },

  // Lấy tất cả lịch (admin)
  getAll() {
    return Storage.getAppointments();
  },

  // Hủy lịch
  cancel(id) {
    const appointments = Storage.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index].status = 'cancelled';
      Storage.setAppointments(appointments);
      return { success: true, message: "Hủy lịch thành công!" };
    }
    return { success: false, message: "Không tìm thấy lịch!" };
  },

  // Kiểm tra giờ trống
  getAvailableSlots(doctorId, date) {
    const doctor = Storage.getDoctors().find(d => d.id === doctorId);
    if (!doctor) return [];
    
    const dayOfWeek = new Date(date).getDay(); // 0 = Chủ nhật
    if (!doctor.availableDays.includes(dayOfWeek)) return [];

    const appointments = Storage.getAppointments().filter(a =>
      a.doctorId === doctorId &&
      a.date === date &&
      a.status !== 'cancelled'
    );

    const bookedTimes = appointments.map(a => a.time);
    
    // Lọc thời gian trong khoảng làm việc của bác sĩ
    return INITIAL_DATA.timeSlots.filter(time => {
      if (bookedTimes.includes(time)) return false;
      return time >= doctor.availableTime.start && time <= doctor.availableTime.end;
    });
  },

  // Render danh sách lịch hẹn
  renderList(containerId, appointments, showActions = true) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (appointments.length === 0) {
      UI.showEmpty(containerId, "Chưa có lịch hẹn nào");
      return;
    }

    const doctors = Storage.getDoctors();
    const users = Storage.getUsers();

    container.innerHTML = appointments.map(apt => {
      const doctor = doctors.find(d => d.id === apt.doctorId);
      const patient = users.find(u => u.id === apt.patientId);
      return `
        <div class="card" style="margin-bottom:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
            <div>
              <h4 style="margin-bottom:0.25rem;">${doctor?.name || 'Bác sĩ'}</h4>
              <p style="color:var(--color-gray-600);font-size:0.875rem;">
                ${UI.formatDate(apt.date)} - ${apt.time}
              </p>
              ${apt.reason ? `<p style="margin-top:0.5rem;">${apt.reason}</p>` : ''}
            </div>
            <div style="display:flex;flex-direction:column;gap:0.5rem;align-items:flex-end;">
              <span class="badge badge-${apt.status}">
                ${apt.status === 'confirmed' ? 'Đã xác nhận' : apt.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
              </span>
              ${showActions && apt.status === 'confirmed' ? `
                <button class="btn btn-danger btn-sm" onclick="Appointment.handleCancel(${apt.id})">
                  Hủy lịch
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  handleCancel(id) {
    if (confirm("Bạn chắc chắn muốn hủy lịch này?")) {
      const result = this.cancel(id);
      if (result.success) {
        UI.showToast(result.message, 'success');
        if (window.location.pathname.includes('patient')) {
          this.renderPatientList();
        } else if (window.location.pathname.includes('doctor')) {
          this.renderDoctorList();
        } else {
          this.renderAdminList();
        }
      }
    }
  },

  // Render cho bệnh nhân
  renderPatientList() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    const apts = this.getByPatient(user.id).sort((a, b) => new Date(b.date) - new Date(a.date));
    this.renderList('patient-appointments', apts, true);
  },

  // Render cho admin
  renderAdminList() {
    const apts = this.getAll().sort((a, b) => new Date(b.date) - new Date(a.date));
    this.renderList('admin-appointments', apts, false);
  }
};
