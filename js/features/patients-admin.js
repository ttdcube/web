
// patients-admin.js - Quản lý bệnh nhân cho Admin

const PatientsAdmin = {
  currentPage: 1,
  itemsPerPage: 6,
  filters: { search: '', status: 'All' }, // status: all, active, locked

  renderGrid: function(containerId) {
    const container = document.getElementById(containerId);
    UI.showSkeleton(containerId, 3);

    setTimeout(() => {
      let patients = Storage.getPatients();

      // Search
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        patients = patients.filter(p =>
          p.fullName.toLowerCase().includes(searchLower) ||
          p.email?.toLowerCase().includes(searchLower) ||
          p.phone.includes(this.filters.search)
        );
      }

      if (patients.length === 0) {
        UI.showEmpty(containerId, 'Không có bệnh nhân nào', '👥');
        this.renderPagination(containerId + '-pagination', { total: 0, totalPages: 0 });
        return;
      }

      // Pagination
      const totalPages = Math.ceil(patients.length / this.itemsPerPage);
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const pagePatients = patients.slice(start, end);

      // Lấy thêm thông tin user để có email
      const users = Storage.getUsers();

      container.innerHTML = pagePatients.map(patient => {
        const user = users.find(u => u.id === patient.userId);
        return `
          <div class="card patient-card" style="position:relative">
            <div class="patient-card-header">
              <img src="${patient.avatar}" alt="${patient.fullName}" class="patient-avatar" style="width:70px;height:70px">
              <div class="patient-info">
                <h3 class="patient-name">${patient.fullName}</h3>
                <p class="patient-email">${user ? user.email : '—'}</p>
              </div>
            </div>
            <div class="patient-details">
              <div class="detail-item"><span class="detail-label">Điện thoại:</span> ${patient.phone}</div>
              <div class="detail-item"><span class="detail-label">Ngày sinh:</span> ${patient.birthDate || '—'}</div>
              <div class="detail-item"><span class="detail-label">Giới tính:</span> ${patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}</div>
              <div class="detail-item"><span class="detail-label">Nhóm máu:</span> ${patient.bloodType}</div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem">
              <button class="btn btn-secondary btn-sm" onclick="PatientsAdmin.openEditModal('${patient.id}')">Sửa</button>
              <button class="btn btn-danger btn-sm" onclick="PatientsAdmin.deleteConfirm('${patient.id}')">Xóa</button>
            </div>
          </div>
        `;
      }).join('');

      this.renderPagination(containerId + '-pagination', { total: patients.length, totalPages: totalPages });
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
      html += `<button class="btn btn-secondary btn-sm" onclick="PatientsAdmin.goToPage(${this.currentPage - 1})">← Trước</button>`;
    }
    for (let i = 1; i <= data.totalPages; i++) {
      const activeClass = i === this.currentPage ? 'btn-primary' : 'btn-secondary';
      html += `<button class="btn ${activeClass} btn-sm" onclick="PatientsAdmin.goToPage(${i})">${i}</button>`;
    }
    if (this.currentPage < data.totalPages) {
      html += `<button class="btn btn-secondary btn-sm" onclick="PatientsAdmin.goToPage(${this.currentPage + 1})">Sau →</button>`;
    }
    html += '</div>';
    container.innerHTML = html;
  },

  goToPage: function(page) {
    this.currentPage = page;
    this.renderGrid('admin-patients-grid');
  },

  openEditModal: function(id) {
    const patient = Storage.getPatientById(id);
    if (!patient) return;

    document.getElementById('patient-modal-title').textContent = 'Sửa hồ sơ bệnh nhân';
    document.getElementById('patient-form-id').value = patient.id;
    document.getElementById('patient-name').value = patient.fullName;
    document.getElementById('patient-phone').value = patient.phone;
    document.getElementById('patient-birthdate').value = patient.birthDate;
    document.getElementById('patient-gender').value = patient.gender;
    document.getElementById('patient-bloodtype').value = patient.bloodType;
    document.getElementById('patient-allergies').value = patient.allergies;
    document.getElementById('patient-history').value = patient.medicalHistory;
    document.getElementById('patient-avatar-preview').src = patient.avatar;

    UI.openModal('patient-modal');
  },

  onAvatarChange: function(input) {
    const preview = document.getElementById('patient-avatar-preview');
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  },

  savePatient: function() {
    const id = document.getElementById('patient-form-id').value;
    const name = document.getElementById('patient-name').value.trim();
    const phone = document.getElementById('patient-phone').value.trim();
    const birthdate = document.getElementById('patient-birthdate').value;
    const gender = document.getElementById('patient-gender').value;
    const bloodtype = document.getElementById('patient-bloodtype').value;
    const allergies = document.getElementById('patient-allergies').value.trim();
    const history = document.getElementById('patient-history').value.trim();
    const avatar = document.getElementById('patient-avatar-preview').src;

    if (!name) { UI.toast('Vui lòng nhập họ tên', 'error'); return; }
    if (!phone) { UI.toast('Vui lòng nhập số điện thoại', 'error'); return; }

    const patients = Storage.getPatients();
    const index = patients.findIndex(p => p.id === id);

    if (index !== -1) {
      patients[index] = {
        ...patients[index],
        fullName: name,
        phone: phone,
        birthDate: birthdate,
        gender: gender,
        bloodType: bloodtype,
        allergies: allergies,
        medicalHistory: history,
        avatar: avatar
      };
      Storage.setPatients(patients);
      UI.toast('Cập nhật hồ sơ thành công', 'success');
      UI.closeModal('patient-modal');
      this.renderGrid('admin-patients-grid');
    }
  },

  deleteConfirm: function(id) {
    if (!confirm('Bạn chắc chắn muốn xóa hồ sơ bệnh nhân này?')) return;
    let patients = Storage.getPatients();
    patients = patients.filter(p => p.id !== id);
    Storage.setPatients(patients);
    UI.toast('Xóa hồ sơ thành công', 'success');
    this.renderGrid('admin-patients-grid');
  }
};
