import api from './index';

export const profilesAPI = {
    getAll: () => api.get('/profiles'),
    create: (profileData) => api.post('/profiles', profileData),
};