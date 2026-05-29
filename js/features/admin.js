
/**
 * admin.js - Quản lý admin: quản lý bệnh nhân, bác sĩ
 */

const Admin = {
  /**
   * Render danh sách bệnh nhân cho admin
   */
  renderPatients: function(containerId) {
    const container = document.getElementById(containerId);
    UI.showSkeleton(containerId, 3);

    setTimeout(() => {
      const patients = Storage.getPatients();
      if (patients.length === 0) {
        UI.showEmpty(containerId, 'Không có bệnh nhân nào', '👥');
        return;
      }

      container.innerHTML = patients.map(patient => {
        const user = Storage.getUserById(patient.userId);
        return `
          <div class="patient-card card">
            <div class="patient-card-header">
              <img src="${patient.avatar}" alt="${patient.fullName}" class="patient-avatar">
              <div class="patient-info">
                <h3 class="patient-name">${patient.fullName}</h3>
                <p class="patient-email">${user ? user.email : ''}</p>
              </div>
            </div>
            <div class="patient-details">
              <div class="detail-item"><span class="detail-label">Điện thoại:</span> ${patient.phone}</div>
              <div class="detail-item"><span class="detail-label">Giới tính:</span> ${patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}</div>
              <div class="detail-item"><span class="detail-label">Nhóm máu:</span> ${patient.bloodType === 'unknown' ? 'Chưa cập nhật' : patient.bloodType}</div>
            </div>
          </div>
        `;
      }).join('');
    }, 400);
  },

  /**
   * Render danh sách bác sĩ cho admin
   */
  renderDoctors: function(containerId) {
    const container = document.getElementById(containerId);
    UI.showSkeleton(containerId, 3);

    setTimeout(() => {
      const doctors = Storage.getDoctors();
      if (doctors.length === 0) {
        UI.showEmpty(containerId, 'Không có bác sĩ nào', '👨‍⚕️');
        return;
      }

      container.innerHTML = doctors.map(doctor => `
        <div class="doctor-card card">
          <div class="doctor-card-header">
            <img src="${doctor.avatar}" alt="${doctor.fullName}" class="doctor-card-avatar">
            <div class="doctor-card-info">
              <h3 class="doctor-card-name">${doctor.fullName}</h3>
              <p class="doctor-card-specialty">${doctor.specialty}</p>
            </div>
          </div>
          <p class="doctor-card-bio">${doctor.bio}</p>
          <div class="doctor-card-footer">
            <div class="doctor-card-price">${UI.formatCurrency(doctor.price)}</div>
            <div class="doctor-card-rating">
              <span class="rating-star">⭐</span> ${doctor.rating.toFixed(1)} (${doctor.totalReviews})
            </div>
          </div>
        </div>
      `).join('');
    }, 400);
  }
};

