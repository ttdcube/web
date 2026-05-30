
// doctors-admin.js - Quản lý bác sĩ cho Admin

const DoctorsAdmin = {
  currentPage: 1,
  itemsPerPage: 6,
  filters: { search: '', specialty: 'All' },

  getSpecialties: function() {
    const doctors = Storage.getDoctors();
    const specs = new Set(doctors.map(d => d.specialty));
    return ['All', ...specs];
  },

  renderGrid: function(containerId) {
    const container = document.getElementById(containerId);
    UI.showSkeleton(containerId, 3);

    setTimeout(() => {
      let doctors = Storage.getDoctors();

      // Filter
      if (this.filters.specialty !== 'All') {
        doctors = doctors.filter(d => d.specialty === this.filters.specialty);
      }
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        doctors = doctors.filter(d =>
          d.fullName.toLowerCase().includes(searchLower) ||
          d.email.toLowerCase().includes(searchLower)
        );
      }

      if (doctors.length === 0) {
        UI.showEmpty(containerId, 'Không có bác sĩ nào', '👨‍⚕️');
        this.renderPagination(containerId + '-pagination', { total: 0, totalPages: 0 });
        return;
      }

      // Pagination
      const totalPages = Math.ceil(doctors.length / this.itemsPerPage);
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const pageDoctors = doctors.slice(start, end);

      container.innerHTML = pageDoctors.map(doctor => `
        <div class="card doctor-card" style="position:relative;overflow:hidden">
          <div class="doctor-card-header">
            <img src="${doctor.avatar}" alt="${doctor.fullName}" class="doctor-card-avatar">
            <div class="doctor-card-info">
              <h3 class="doctor-card-name">${doctor.fullName}</h3>
              <p class="doctor-card-specialty">${doctor.specialty}</p>
            </div>
          </div>
          <p class="doctor-card-bio">${doctor.bio}</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:1rem;font-size:0.875rem;color:var(--text-muted)">
            <div>📞 ${doctor.phone}</div>
            <div>📧 ${doctor.email}</div>
          </div>
          <div class="doctor-card-footer">
            <div style="display:flex;flex-direction:column;gap:0.25rem">
              <div class="doctor-card-price">${UI.formatCurrency(doctor.price)}</div>
              <div style="font-size:0.875rem;color:var(--text-muted)">
                <span class="rating-star">⭐</span> ${doctor.rating.toFixed(1)} (${doctor.totalReviews})
              </div>
            </div>
            <div style="display:flex;gap:0.5rem">
              <button class="btn btn-secondary btn-sm" onclick="DoctorsAdmin.openEditModal('${doctor.id}')">Sửa</button>
              <button class="btn btn-danger btn-sm" onclick="DoctorsAdmin.deleteConfirm('${doctor.id}')">Xóa</button>
            </div>
          </div>
        </div>
      `).join('');

      this.renderPagination(containerId + '-pagination', { total: doctors.length, totalPages: totalPages });
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
      html += `<button class="btn btn-secondary btn-sm" onclick="DoctorsAdmin.goToPage(${this.currentPage - 1})">← Trước</button>`;
    }
    for (let i = 1; i <= data.totalPages; i++) {
      const activeClass = i === this.currentPage ? 'btn-primary' : 'btn-secondary';
      html += `<button class="btn ${activeClass} btn-sm" onclick="DoctorsAdmin.goToPage(${i})">${i}</button>`;
    }
    if (this.currentPage < data.totalPages) {
      html += `<button class="btn btn-secondary btn-sm" onclick="DoctorsAdmin.goToPage(${this.currentPage + 1})">Sau →</button>`;
    }
    html += '</div>';
    container.innerHTML = html;
  },

  goToPage: function(page) {
    this.currentPage = page;
    this.renderGrid('admin-doctors-grid');
  },

  renderSpecialtySelect: function(selectId, includeAll = true) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const specs = this.getSpecialties();
    select.innerHTML = specs.map(s => `<option value="${s}">${s}</option>`).join('');
  },

  openAddModal: function() {
    document.getElementById('doctor-modal-title').textContent = 'Thêm bác sĩ mới';
    document.getElementById('doctor-form-id').value = '';
    document.getElementById('doctor-name').value = '';
    document.getElementById('doctor-specialty').innerHTML = this.getSpecialties().slice(1).map(s => `<option value="${s}">${s}</option>`).join('');
    document.getElementById('doctor-phone').value = '';
    document.getElementById('doctor-email').value = '';
    document.getElementById('doctor-bio').value = '';
    document.getElementById('doctor-price').value = '300000';
    document.getElementById('doctor-avatar-preview').src = 'https://ui-avatars.com/api/?name=New+Doctor&background=3498db&color=fff&size=200';
    UI.openModal('doctor-modal');
  },

  openEditModal: function(id) {
    const doctor = Storage.getDoctorById(id);
    if (!doctor) return;
    document.getElementById('doctor-modal-title').textContent = 'Sửa thông tin bác sĩ';
    document.getElementById('doctor-form-id').value = doctor.id;
    document.getElementById('doctor-name').value = doctor.fullName;
    document.getElementById('doctor-specialty').innerHTML = this.getSpecialties().slice(1).map(s =>
      `<option value="${s}" ${s === doctor.specialty ? 'selected' : ''}>${s}</option>`
    ).join('');
    document.getElementById('doctor-phone').value = doctor.phone;
    document.getElementById('doctor-email').value = doctor.email;
    document.getElementById('doctor-bio').value = doctor.bio;
    document.getElementById('doctor-price').value = doctor.price;
    document.getElementById('doctor-avatar-preview').src = doctor.avatar;
    UI.openModal('doctor-modal');
  },

  onAvatarChange: function(input) {
    const preview = document.getElementById('doctor-avatar-preview');
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  },

  saveDoctor: function() {
    const id = document.getElementById('doctor-form-id').value;
    const name = document.getElementById('doctor-name').value.trim();
    const specialty = document.getElementById('doctor-specialty').value;
    const phone = document.getElementById('doctor-phone').value.trim();
    const email = document.getElementById('doctor-email').value.trim();
    const bio = document.getElementById('doctor-bio').value.trim();
    const price = parseInt(document.getElementById('doctor-price').value) || 300000;
    const avatar = document.getElementById('doctor-avatar-preview').src;

    // Validate
    if (!name) { UI.toast('Vui lòng nhập họ tên bác sĩ', 'error'); return; }
    if (!specialty) { UI.toast('Vui lòng chọn chuyên khoa', 'error'); return; }
    if (!phone) { UI.toast('Vui lòng nhập số điện thoại', 'error'); return; }

    const doctors = Storage.getDoctors();

    if (id) {
      // Edit
      const index = doctors.findIndex(d => d.id === id);
      if (index !== -1) {
        doctors[index] = {
          ...doctors[index],
          fullName: name,
          specialty: specialty,
          phone: phone,
          email: email,
          bio: bio,
          price: price,
          avatar: avatar
        };
        UI.toast('Cập nhật bác sĩ thành công', 'success');
      }
    } else {
      // Add
      const newDoctor = {
        id: Utils.uuid(),
        userId: null,
        fullName: name,
        specialty: specialty,
        phone: phone,
        email: email,
        avatar: avatar,
        bio: bio || `Bác sĩ ${name} chuyên môn về ${specialty}.`,
        availableDays: [1,2,3,4,5],
        availableTimeStart: '08:00',
        availableTimeEnd: '17:00',
        price: price,
        rating: 4.5,
        totalReviews: 10
      };
      doctors.push(newDoctor);
      UI.toast('Thêm bác sĩ thành công', 'success');
    }

    Storage.setDoctors(doctors);
    UI.closeModal('doctor-modal');
    this.renderGrid('admin-doctors-grid');
  },

  deleteConfirm: function(id) {
    if (!confirm('Bạn chắc chắn muốn xóa bác sĩ này?')) return;
    let doctors = Storage.getDoctors();
    doctors = doctors.filter(d => d.id !== id);
    Storage.setDoctors(doctors);
    UI.toast('Xóa bác sĩ thành công', 'success');
    this.renderGrid('admin-doctors-grid');
  }
};
