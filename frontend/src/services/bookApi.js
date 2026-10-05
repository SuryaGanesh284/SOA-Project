import api from './api';

export const bookApi = {
  getBooks: async (params = {}) => {
    const response = await api.get('/books', { params });
    return response.data;
  },
  
  searchBooks: async (params = {}) => {
    const response = await api.get('/books/search', { params });
    return response.data;
  },

  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (data) => {
    const response = await api.post('/books', data);
    return response.data;
  },

  updateBook: async (id, data) => {
    const response = await api.put(`/books/${id}`, data);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  }
};
