
const DoctorPatients = {
  render: function() {
    const doctor = Auth.getCurrentDoctor();
    if (!doctor) return;

    const appointments = Storage.getAppointmentsByDoctorId(doctor.id);
    const patientIds = new Set(appointments.map(a => a.patientId));

    const search = (document.getElementById('search-patient')?.value || '').toLowerCase();

    const patients = Array.from(patientIds)
      .map(id => Storage.getPatientById(id))
      .filter(p => p)
      .filter(p => !search || p.fullName.toLowerCase().includes(search));

    const container = document.getElementById('doctor-patients-list');

    if (patients.length === 0) {
      UI.showEmpty('doctor-patients-list', 'Chưa có bệnh nhân nào', '👥');
      return;
    }

    container.innerHTML = patients.map(patient => {
      const patientAppointments = appointments.filter(a => a.patientId === patient.id);
      const lastVisit = patientAppointments
        .filter(a => a.status === 'completed')
        .sort((a, b) => b.appointmentDate.localeCompare(a.appointmentDate))[0];

      return `
        <div class="card" style="margin-bottom:1rem;">
          <div class="patient-card-header" style="margin-bottom:1rem;">
            <img src="${patient.avatar}" alt="${patient.fullName}" class="patient-avatar">
            <div>
              <h4 style="font-size:1.1rem; margin-bottom:0.25rem;">${patient.fullName}</h4>
              <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:0;">${patient.phone} • ${patient.birthDate || 'Chưa có thông tin'}</p>
            </div>
          </div>
          <div class="patient-details" style="margin-bottom:0.75rem;">
            <div class="detail-item">
              <span class="detail-label">Giới tính:</span> ${patient.gender}
            </div>
            <div class="detail-item">
              <span class="detail-label">Nhóm máu:</span> ${patient.bloodType}
            </div>
            <div class="detail-item">
              <span class="detail-label">Địa chỉ:</span> ${patient.allergies || 'Chưa có'}
            </div>
          </div>
          ${patient.medicalHistory ? `<p style="color:var(--text-muted);"><strong>Lịch sử:</strong> ${patient.medicalHistory}</p>` : ''}
          ${lastVisit ? `
            <p style="margin-top:0.5rem; color:var(--text-muted);">
              <strong>Lần khám gần nhất:</strong> ${Utils.formatDate(lastVisit.appointmentDate)}
            </p>
          ` : ''}
        </div>
      `;
    }).join('');
  }
};
