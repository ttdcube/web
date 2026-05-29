
// api.js - Goi API backend
const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  // Luu token vao localStorage
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  },
  getAuthToken() {
    return localStorage.getItem('authToken');
  },
  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    this.setAuthToken(json.token);
    this.setCurrentUser(json.user);
    return json;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    this.setAuthToken(json.token);
    this.setCurrentUser(json.user);
    return json;
  },

  // Doctors
  async getDoctors(specialty) {
    const url = new URL(`${API_BASE_URL}/doctors`);
    if (specialty) url.searchParams.set('specialty', specialty);
    const res = await fetch(url);
    return res.json();
  },

  async getSpecialties() {
    const res = await fetch(`${API_BASE_URL}/specialties`);
    return res.json();
  },

  async getDoctorAvailability(doctorId, date) {
    const res = await fetch(`${API_BASE_URL}/doctors/${doctorId}/availability?date=${date}`);
    return res.json();
  },

  // Appointments
  async bookAppointment(data) {
    const token = this.getAuthToken();
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    return json;
  },

  async getMyAppointments() {
    const token = this.getAuthToken();
    const res = await fetch(`${API_BASE_URL}/appointments/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async cancelAppointment(id) {
    const token = this.getAuthToken();
    const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Admin
  async getAllAppointments() {
    const token = this.getAuthToken();
    const res = await fetch(`${API_BASE_URL}/admin/appointments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async getAdminStats() {
    const token = this.getAuthToken();
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};
