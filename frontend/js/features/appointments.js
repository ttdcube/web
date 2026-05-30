
/**
 * appointments.js - Quản lý lịch khám: xem, hủy, chi tiết
 */

const Appointments = {
  currentFilter: 'All',

  /**
   * Render lịch khám của bệnh nhân
   */
  renderPatientList: function(containerId) {
    const container = document.getElementById(containerId);
    UI.showSkeleton(containerId, 3);

    setTimeout(() => {
      const patient = Auth.getCurrentPatient();
      if (!patient) {
        UI.showEmpty(containerId, 'Vui lòng đăng nhập', '⚠️');
        return;
      }

      let appointments = Storage.getAppointmentsByPatientId(patient.id);
      
      // Apply status filter
      if (this.currentFilter !== 'All') {
        appointments = appointments.filter(a => a.status === this.currentFilter);
      }

      if (appointments.length === 0) {
        UI.showEmpty(containerId, 'Không có lịch khám nào', '📅');
        return;
      }

      // Sort by date desc
      appointments.sort((a, b) => {
        const dateA = a.appointmentDate + a.appointmentTime;
        const dateB = b.appointmentDate + b.appointmentTime;
        return dateB.localeCompare(dateA);
      });

      container.innerHTML = appointments.map(appointment => {
        const doctor = Storage.getDoctorById(appointment.doctorId);
        const statusClass = appointment.status;
        const statusText = {
          'pending': 'Chờ xác nhận',
          'confirmed': 'Đã xác nhận',
          'completed': 'Hoàn thành',
          'cancelled': 'Đã hủy'
        }[appointment.status];

        return `
          <div class="appointment-card card">
            <div class="appointment-card-header">
              <div>
                <div class="appointment-code">${appointment.appointmentCode}</div>
                <h3 class="appointment-doctor-name">${doctor ? doctor.fullName : 'Bác sĩ'}</h3>
                <p class="appointment-doctor-specialty">${doctor ? doctor.specialty : ''}</p>
              </div>
              <span class="appointment-status status-${statusClass}">${statusText}</span>
            </div>
            <div class="appointment-info">
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
            ${['pending', 'confirmed'].includes(appointment.status) ? `
              <div class="appointment-actions">
                <button class="btn btn-danger btn-sm" onclick="Appointments.cancel('${appointment.id}')">Hủy lịch</button>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }, 400);
  },

  /**
   * Hủy lịch khám
   */
  cancel: function(id) {
    if (!confirm('Bạn có chắc muốn hủy lịch khám này?')) {
      return;
    }
    Storage.updateAppointment(id, { status: 'cancelled' });
    UI.toast('Hủy lịch thành công!', 'success');
    this.renderPatientList('patient-appointments');
  },

  /**
   * Render tất cả lịch cho admin
   */
  renderAdminList: function(containerId, filters = {}) {
    const container = document.getElementById(containerId);
    UI.showSkeleton(containerId, 4);

    setTimeout(() => {
      let appointments = Storage.getAppointments();

      // Filter
      if (filters.status && filters.status !== 'All') {
        appointments = appointments.filter(a => a.status === filters.status);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        appointments = appointments.filter(a => {
          const patient = Storage.getPatientById(a.patientId);
          const doctor = Storage.getDoctorById(a.doctorId);
          return (patient && patient.fullName.toLowerCase().includes(searchLower)) ||
                 (doctor && doctor.fullName.toLowerCase().includes(searchLower)) ||
                 a.appointmentCode.toLowerCase().includes(searchLower);
        });
      }

      // Sort by date desc
      appointments.sort((a, b) => {
        const dateA = new Date(a.appointmentDate + 'T' + a.appointmentTime);
        const dateB = new Date(b.appointmentDate + 'T' + b.appointmentTime);
        return dateB - dateA;
      });

      if (appointments.length === 0) {
        UI.showEmpty(containerId, 'Không có lịch khám nào', '📅');
        return;
      }

      container.innerHTML = appointments.map(appointment => {
        const patient = Storage.getPatientById(appointment.patientId);
        const doctor = Storage.getDoctorById(appointment.doctorId);
        const statusClass = appointment.status;
        const statusText = {
          'pending': 'Chờ xác nhận',
          'confirmed': 'Đã xác nhận',
          'completed': 'Hoàn thành',
          'cancelled': 'Đã hủy'
        }[appointment.status];

        return `
          <div class="appointment-card card">
            <div class="appointment-card-header">
              <div>
                <div class="appointment-code">${appointment.appointmentCode}</div>
                <h3 class="appointment-doctor-name">${patient ? patient.fullName : 'Bệnh nhân'} → ${doctor ? doctor.fullName : 'Bác sĩ'}</h3>
              </div>
              <span class="appointment-status status-${statusClass}">${statusText}</span>
            </div>
            <div class="appointment-info">
              <div class="appointment-info-item">
                <span class="icon">📅</span>
                <div>
                  <div class="label">Ngày</div>
                  <div class="value">${Utils.formatDateShort(appointment.appointmentDate)}</div>
                </div>
              </div>
              <div class="appointment-info-item">
                <span class="icon">⏰</span>
                <div>
                  <div class="label">Giờ</div>
                  <div class="value">${appointment.appointmentTime}</div>
                </div>
              </div>
            </div>
            <div class="appointment-actions">
              <button class="btn btn-primary btn-sm" onclick="Appointments.updateStatus('${appointment.id}')">Cập nhật</button>
            </div>
          </div>
        `;
      }).join('');
    }, 400);
  },

  /**
   * Cập nhật trạng thái (admin)
   */
  updateStatus: function(id) {
    const appointment = Storage.getAppointmentById(id);
    if (!appointment) return;

    const nextStatus = {
      'pending': 'confirmed',
      'confirmed': 'completed',
      'completed': 'completed',
      'cancelled': 'cancelled'
    }[appointment.status];

    Storage.updateAppointment(id, { status: nextStatus });
    UI.toast('Cập nhật trạng thái thành công!', 'success');
    this.renderAdminList('admin-appointments');
  }
};

