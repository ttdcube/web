
const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  getToken() {
    return localStorage.getItem('token');
  },
  
  setToken(token) {
    localStorage.setItem('token', token);
  },
  
  removeToken() {
    localStorage.removeItem('token');
  },
  
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Lỗi kết nối server!');
    }
    
    return data;
  },
  
  async register(data) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async login(data) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async getDoctors(specialty) {
    let url = '/doctors';
    if (specialty) {
      url += `?specialty=${encodeURIComponent(specialty)}`;
    }
    return this.request(url);
  },
  
  async getSpecialties() {
    return this.request('/specialties');
  },
  
  async getDoctorAvailability(doctorId, date) {
    return this.request(`/doctors/${doctorId}/availability?date=${encodeURIComponent(date)}`);
  },
  
  async createAppointment(data) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async getMyAppointments() {
    return this.request('/appointments/my');
  },
  
  async cancelAppointment(id) {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
  
  async getAdminAppointments() {
    return this.request('/admin/appointments');
  },
  
  async getAdminStats() {
    return this.request('/admin/stats');
  },
};
