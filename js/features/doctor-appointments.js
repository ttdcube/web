
const DoctorAppointments = {
  render: function() {
    const doctor = Auth.getCurrentDoctor();
    if (!doctor) return;

    let appointments = Storage.getAppointmentsByDoctorId(doctor.id);

    const statusFilter = document.getElementById('filter-status').value;
    const dateFilter = document.getElementById('filter-date').value;
    const search = document.getElementById('search-patient').value.toLowerCase();

    if (statusFilter !== 'All') {
      appointments = appointments.filter(a => a.status === statusFilter);
    }
    if (dateFilter) {
      appointments = appointments.filter(a => a.appointmentDate === dateFilter);
    }
    if (search) {
      appointments = appointments.filter(a => {
        const patient = Storage.getPatientById(a.patientId);
        return patient && patient.fullName.toLowerCase().includes(search);
      });
    }

    appointments.sort((a, b) => {
      const dateA = a.appointmentDate + a.appointmentTime;
      const dateB = b.appointmentDate + b.appointmentTime;
      return dateB.localeCompare(dateA);
    });

    const container = document.getElementById('doctor-appointments-list');
    if (appointments.length === 0) {
      UI.showEmpty('doctor-appointments-list', 'Không có lịch khám', '📅');
      return;
    }

    container.innerHTML = appointments.map(appointment => {
      const patient = Storage.getPatientById(appointment.patientId);
      const statusClass = appointment.status;
      const statusText = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
      }[appointment.status];

      return `
        <div class="card" style="margin-bottom:1rem; padding:1.25rem;">
          <div class="appointment-card-header" style="margin-bottom:0.75rem;">
            <div>
              <div class="appointment-code">${appointment.appointmentCode}</div>
              <h4 style="font-size:1.1rem; margin-bottom:0.25rem;">${patient ? patient.fullName : 'Bệnh nhân'}</h4>
              <div style="color:var(--text-muted); font-size:0.9rem;">${patient ? patient.phone : ''}</div>
            </div>
            <span class="appointment-status status-${statusClass}">${statusText}</span>
          </div>
          <div class="appointment-info" style="padding:0.75rem; margin-bottom:0.75rem;">
            <div class="appointment-info-item">
              <span class="icon">📅</span>
              <div>
                <div class="label">Ngày khám</div>
                <div class="value">${Utils.formatDate(appointment.appointmentDate)}</div>
              </div>
            </div>
            <div class="appointment-info-item">
              <span class="icon">⏰</span>
              <div>
                <div class="label">Giờ khám</div>
                <div class="value">${appointment.appointmentTime}</div>
              </div>
            </div>
          </div>
          ${appointment.reason ? `<p class="appointment-reason"><strong>Lý do:</strong> ${appointment.reason}</p>` : ''}
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${appointment.status === 'pending' ? `
              <button class="btn btn-primary btn-sm" onclick="DoctorAppointments.changeStatus('${appointment.id}', 'confirmed')">Xác nhận</button>
              <button class="btn btn-danger btn-sm" onclick="DoctorAppointments.changeStatus('${appointment.id}', 'cancelled')">Hủy</button>
            ` : ''}
            ${appointment.status === 'confirmed' ? `
              <button class="btn btn-secondary btn-sm" onclick="DoctorAppointments.changeStatus('${appointment.id}', 'completed')">Hoàn thành</button>
              <button class="btn btn-danger btn-sm" onclick="DoctorAppointments.changeStatus('${appointment.id}', 'cancelled')">Hủy</button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  changeStatus: function(id, newStatus) {
    if (!confirm(`Bạn có chắc muốn đổi trạng thái thành ${newStatus}?`)) return;
    Storage.updateAppointment(id, { status: newStatus });
    UI.toast('Cập nhật trạng thái thành công!', 'success');
    this.render();
  }
};
