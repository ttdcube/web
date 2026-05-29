
const DoctorDashboard = {
  render: function() {
    const doctor = Auth.getCurrentDoctor();
    if (!doctor) return;

    const appointments = Storage.getAppointmentsByDoctorId(doctor.id);
    const today = Utils.getToday();

    const todayAppointments = appointments.filter(
      a => a.appointmentDate === today && a.status !== 'cancelled'
    );
    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    const completedAppointments = appointments.filter(a => a.status === 'completed');
    const uniquePatients = new Set(appointments.map(a => a.patientId)).size;

    const statsHtml = `
      <div class="card stat-card">
        <div class="stat-value">${todayAppointments.length}</div>
        <div class="stat-label">Lịch hôm nay</div>
      </div>
      <div class="card stat-card">
        <div class="stat-value">${uniquePatients}</div>
        <div class="stat-label">Bệnh nhân</div>
      </div>
      <div class="card stat-card">
        <div class="stat-value">${pendingAppointments.length}</div>
        <div class="stat-label">Chờ xác nhận</div>
      </div>
      <div class="card stat-card">
        <div class="stat-value">${completedAppointments.length}</div>
        <div class="stat-label">Hoàn thành</div>
      </div>
    `;

    document.getElementById('doctor-stats').innerHTML = statsHtml;

    const todayHtml =
      todayAppointments.length === 0
        ? UI.showEmpty('doctor-today-appointments', 'Không có lịch hôm nay', '📅', false)
        : todayAppointments
            .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))
            .map(appointment => {
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
                      <button class="btn btn-primary btn-sm" onclick="DoctorDashboard.changeStatus('${appointment.id}', 'confirmed')">Xác nhận</button>
                      <button class="btn btn-danger btn-sm" onclick="DoctorDashboard.changeStatus('${appointment.id}', 'cancelled')">Hủy</button>
                    ` : ''}
                    ${appointment.status === 'confirmed' ? `
                      <button class="btn btn-secondary btn-sm" onclick="DoctorDashboard.changeStatus('${appointment.id}', 'completed')">Hoàn thành</button>
                      <button class="btn btn-danger btn-sm" onclick="DoctorDashboard.changeStatus('${appointment.id}', 'cancelled')">Hủy</button>
                    ` : ''}
                  </div>
                </div>
              `;
            })
            .join('');

    const container = document.getElementById('doctor-today-appointments');
    if (container) container.innerHTML = todayHtml;
  },

  changeStatus: function(id, newStatus) {
    if (!confirm(`Bạn có chắc muốn đổi trạng thái thành ${newStatus}?`)) return;
    Storage.updateAppointment(id, { status: newStatus });
    UI.toast('Cập nhật trạng thái thành công!', 'success');
    this.render();
  }
};
