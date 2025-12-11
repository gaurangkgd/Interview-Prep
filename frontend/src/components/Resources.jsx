import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function Resources() {
  const { user, logout } = useAuth();
  const [resources, setResources] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ topic: '', type: '', studied: '' });
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'Article',
    topic: '',
    description: '',
    companyId: '',
    rating: 3,
    notes: ''
  });

  // Set body background color
  React.useEffect(() => {
    document.body.style.backgroundColor = '#FFF5F7';
    return () => {
      document.body.style.backgroundColor = '#0f172a';
    };
  }, []);

  const types = ['Article', 'Video', 'Course', 'Book', 'Tutorial', 'Documentation'];
  const topics = ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Algorithms', 'Data Structures', 'System Design', 'Behavioral', 'SQL', 'MongoDB', 'AWS', 'Docker', 'REST APIs'];

  useEffect(() => {
    fetchResources();
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchResources();
  }, [filter]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams(filter).toString();
      const response = await api.get(`/resources?${params}`);
      setResources(response.data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.companyId) delete dataToSubmit.companyId;
      if (!dataToSubmit.notes) delete dataToSubmit.notes;

      if (editingResource) {
        await api.put(`/resources/${editingResource._id}`, dataToSubmit);
      } else {
        await api.post('/resources', dataToSubmit);
      }
      
      setShowForm(false);
      setEditingResource(null);
      setFormData({ title: '', url: '', type: 'Article', topic: '', description: '', companyId: '', rating: 3, notes: '' });
      fetchResources();
    } catch (error) {
      console.error('Failed to save resource:', error);
      alert('Failed to save resource');
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      url: resource.url,
      type: resource.type,
      topic: resource.topic,
      description: resource.description || '',
      companyId: resource.companyId?._id || '',
      rating: resource.rating || 3,
      notes: resource.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await api.delete(`/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error('Failed to delete resource:', error);
      alert('Failed to delete resource');
    }
  };

  const toggleStudied = async (id) => {
    try {
      await api.patch(`/resources/${id}/toggle-studied`);
      fetchResources();
    } catch (error) {
      console.error('Failed to toggle studied:', error);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📚 Preparation Resources</h1>
            <p className="text-sm text-gray-600">Manage your learning materials</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/questions'}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Questions
            </button>
            <button
              onClick={() => window.location.href = '/prep'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Prep List
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 lg:px-8 py-8">
        {/* Stats and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-purple-600">{resources.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Studied</p>
              <p className="text-2xl font-bold text-green-600">{resources.filter(r => r.studied).length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">To Study</p>
              <p className="text-2xl font-bold text-orange-600">{resources.filter(r => !r.studied).length}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingResource(null);
              setFormData({ title: '', url: '', type: 'Article', topic: '', description: '', companyId: '', rating: 3, notes: '' });
              setShowForm(!showForm);
            }}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Resource
          </button>
        </div>

        {/* Add/Edit Resource Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Resource Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="url"
                  placeholder="URL *"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Topic *</option>
                  {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Link to Company (Optional)</option>
                  {companies.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
                </select>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-700">Rating:</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{'⭐'.repeat(r)} ({r})</option>)}
                  </select>
                </div>
              </div>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
              <textarea
                placeholder="Personal Notes (Optional)"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingResource(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  {editingResource ? 'Update' : 'Add'} Resource
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="🔍 Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={filter.topic}
              onChange={(e) => setFilter({...filter, topic: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Topics</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={filter.type}
              onChange={(e) => setFilter({...filter, type: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Types</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={filter.studied}
              onChange={(e) => setFilter({...filter, studied: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Resources</option>
              <option value="true">✅ Studied</option>
              <option value="false">📖 To Study</option>
            </select>
          </div>
        </div>

        {/* Resources List */}
        <div className="grid gap-4">
          {filteredResources.map(resource => (
            <div key={resource._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={resource.studied}
                    onChange={() => toggleStudied(resource._id)}
                    className="w-6 h-6 mt-1 cursor-pointer accent-green-600"
                  />
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${resource.studied ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {resource.title}
                    </h3>
                    {resource.description && (
                      <p className="text-gray-600 mb-3">{resource.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                        {resource.topic}
                      </span>
                      <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                        {resource.type}
                      </span>
                      {resource.rating && (
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                          {'⭐'.repeat(resource.rating)}
                        </span>
                      )}
                      {resource.companyId && (
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          🏢 {resource.companyId.companyName}
                        </span>
                      )}
                    </div>
                    {resource.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700"><strong>Notes:</strong> {resource.notes}</p>
                      </div>
                    )}
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open Resource
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(resource)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(resource._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-gray-600 mb-2">No resources found</p>
            <p className="text-gray-500">
              {searchTerm || filter.topic || filter.type || filter.studied
                ? 'Try adjusting your filters'
                : 'Add your first learning resource to get started!'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Resources;