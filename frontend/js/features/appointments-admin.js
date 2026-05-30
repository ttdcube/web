
// appointments-admin.js - Quản lý lịch hẹn cho Admin

const AppointmentsAdmin = {
  currentPage: 1,
  itemsPerPage: 8,
  filters: { search: '', doctorId: 'All', status: 'All', dateFrom: '', dateTo: '' },

  renderList: function(containerId) {
    const container = document.getElementById(containerId);
    UI.showSkeleton(containerId, 4);

    setTimeout(() => {
      let appointments = Storage.getAppointments();
      const doctors = Storage.getDoctors();
      const patients = Storage.getPatients();

      // Filter
      if (this.filters.status !== 'All') {
        appointments = appointments.filter(a => a.status === this.filters.status);
      }
      if (this.filters.doctorId !== 'All') {
        appointments = appointments.filter(a => a.doctorId === this.filters.doctorId);
      }
      if (this.filters.dateFrom) {
        appointments = appointments.filter(a => a.appointmentDate >= this.filters.dateFrom);
      }
      if (this.filters.dateTo) {
        appointments = appointments.filter(a => a.appointmentDate <= this.filters.dateTo);
      }
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        appointments = appointments.filter(a => {
          const patient = patients.find(p => p.id === a.patientId);
          const doctor = doctors.find(d => d.id === a.doctorId);
          return (patient && patient.fullName.toLowerCase().includes(searchLower)) ||
                 (doctor && doctor.fullName.toLowerCase().includes(searchLower)) ||
                 a.appointmentCode.toLowerCase().includes(searchLower);
        });
      }

      // Sort by date desc
      appointments.sort((a, b) => {
        const keyA = a.appointmentDate + a.appointmentTime;
        const keyB = b.appointmentDate + b.appointmentTime;
        return keyB.localeCompare(keyA);
      });

      if (appointments.length === 0) {
        UI.showEmpty(containerId, 'Không có lịch hẹn nào', '📅');
        this.renderPagination(containerId + '-pagination', { total: 0, totalPages: 0 });
        return;
      }

      // Pagination
      const totalPages = Math.ceil(appointments.length / this.itemsPerPage);
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const pageAppointments = appointments.slice(start, end);

      container.innerHTML = pageAppointments.map(appointment => {
        const doctor = doctors.find(d => d.id === appointment.doctorId);
        const patient = patients.find(p => p.id === appointment.patientId);
        const statusClass = appointment.status;
        const statusText = {
          pending: 'Chờ xác nhận',
          confirmed: 'Đã xác nhận',
          completed: 'Hoàn thành',
          cancelled: 'Đã hủy'
        }[appointment.status];
        const statusColors = { pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'danger' };

        return `
          <div class="card appointment-card">
            <div class="appointment-card-header">
              <div>
                <div class="appointment-code">${appointment.appointmentCode}</div>
                <h3 class="appointment-doctor-name">${patient ? patient.fullName : '—'} → ${doctor ? doctor.fullName : '—'}</h3>
              </div>
              <span class="appointment-status status-${statusClass}">${statusText}</span>
            </div>
            <div class="appointment-info">
              <div class="appointment-info-item">
                <span class="icon">📅</span>
                <div>
                  <div class="label">Ngày khám</div>
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
            ${appointment.reason ? `<p class="appointment-reason"><strong>Lý do:</strong> ${appointment.reason}</p>` : ''}
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
              ${appointment.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="AppointmentsAdmin.changeStatus('${appointment.id}', 'confirmed')">Xác nhận</button>` : ''}
              ${appointment.status === 'confirmed' ? `<button class="btn btn-secondary btn-sm" onclick="AppointmentsAdmin.changeStatus('${appointment.id}', 'completed')">Hoàn thành</button>` : ''}
              ${['pending', 'confirmed'].includes(appointment.status) ? `<button class="btn btn-danger btn-sm" onclick="AppointmentsAdmin.changeStatus('${appointment.id}', 'cancelled')">Hủy</button>` : ''}
            </div>
          </div>
        `;
      }).join('');

      this.renderPagination(containerId + '-pagination', { total: appointments.length, totalPages: totalPages });
    }, 400);
  },

  renderPagination: function(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container || data.totalPages <= 1) {
      if (container) container.innerHTML = '';
      return;
    }

    let html = '<div class="pagination">';
    if (this.currentPage > 1) {
      html += `<button class="btn btn-secondary btn-sm" onclick="AppointmentsAdmin.goToPage(${this.currentPage - 1})">← Trước</button>`;
    }
    for (let i = 1; i <= data.totalPages; i++) {
      const activeClass = i === this.currentPage ? 'btn-primary' : 'btn-secondary';
      html += `<button class="btn ${activeClass} btn-sm" onclick="AppointmentsAdmin.goToPage(${i})">${i}</button>`;
    }
    if (this.currentPage < data.totalPages) {
      html += `<button class="btn btn-secondary btn-sm" onclick="AppointmentsAdmin.goToPage(${this.currentPage + 1})">Sau →</button>`;
    }
    html += '</div>';
    container.innerHTML = html;
  },

  goToPage: function(page) {
    this.currentPage = page;
    this.renderList('admin-appointments-grid');
  },

  changeStatus: function(id, newStatus) {
    const appointments = Storage.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], status: newStatus, updatedAt: new Date().toISOString() };
      Storage.setAppointments(appointments);
      UI.toast('Cập nhật trạng thái thành công', 'success');
      this.renderList('admin-appointments-grid');
    }
  },

  renderDoctorFilter: function(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const doctors = Storage.getDoctors();
    select.innerHTML = `<option value="All">Tất cả bác sĩ</option>` +
      doctors.map(d => `<option value="${d.id}">${d.fullName} - ${d.specialty}</option>`).join('');
  }
};
