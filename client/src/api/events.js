import api from './index';

export const eventsAPI = {
    getAll: () => api.get('/events'),
    create: (eventData) => api.post('/events', eventData),
    update: (id, eventData) => api.put(`/events/${id}`, eventData),
};