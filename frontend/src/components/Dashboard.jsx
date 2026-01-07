import React, { useState, useEffect } from 'react';
import Aurora from './Aurora';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import CompanyList from './CompanyList';
import CompanyForm from './CompanyForm';

function Dashboard() {
  const { user, logout } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/companies');
      setCompanies(response.data);
      
      // Calculate stats
      const statusCounts = response.data.reduce((acc, company) => {
        acc.total++;
        const status = company.status.toLowerCase();
        if (status.includes('applied')) acc.applied++;
        else if (status.includes('interview')) acc.interview++;
        else if (status.includes('offer')) acc.offer++;
        else if (status.includes('rejected')) acc.rejected++;
        return acc;
      }, { total: 0, applied: 0, interview: 0, offer: 0, rejected: 0 });
      
      setStats(statusCounts);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies(); // Refresh list
    } catch (err) {
      alert('Failed to delete company');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Find the company to get all its data
      const company = companies.find(c => c._id === id);
      if (!company) return;

      // Update with all required fields
      await api.put(`/companies/${id}`, {
        companyName: company.companyName,
        role: company.role,
        status: newStatus,
        appliedDate: company.appliedDate
      });
      fetchCompanies(); // Refresh list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setShowForm(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingCompany) {
      // Update existing company
      await api.put(`/companies/${editingCompany._id}`, formData);
    } else {
      // Create new company
      await api.post('/companies', formData);
    }
    fetchCompanies();
    setShowForm(false);
    setEditingCompany(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  // Set body background color for dashboard only
  React.useEffect(() => {
    document.body.style.backgroundColor = '#0b1220'; // match Home page dark bg
    return () => {
      document.body.style.backgroundColor = '#0b1220'; // keep consistent
    };
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      {/* Aurora Animated Background */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Aurora />
      </div>
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 text-white">
        <div className="w-full px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Interview Prep Tracker
            </h1>
            <p className="text-sm text-white">Welcome back, {user?.username}!</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = '/ai-generator'}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2"
            >
              <span>🤖</span>
              AI Question Generator
            </button>
            <button
              onClick={() => window.location.href = '/questions'}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Questions
            </button>
            <button
              onClick={() => window.location.href = '/resources'}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Resources
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
      <main className="w-full px-6 lg:px-8 py-8 text-white">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
          <div className="bg-gray-800/70 backdrop-blur-md rounded-lg shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Total Applications</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-md rounded-lg shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Applied</p>
                <p className="text-3xl font-bold text-blue-400">{stats.applied}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-md rounded-lg shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Interviews</p>
                <p className="text-3xl font-bold text-yellow-300">{stats.interview}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-md rounded-lg shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Offers</p>
                <p className="text-3xl font-bold text-green-400">{stats.offer}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-md rounded-lg shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Rejected</p>
                <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">My Applications</h2>
          <button
            onClick={handleAddCompany}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Company
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/80 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter Bar and Empty State Styling */}
        <style>{`
          .glass-panel {
            background: rgba(31,41,55,0.7);
            color: #fff;
            backdrop-filter: blur(8px);
            border-radius: 1rem;
            border: 1px solid rgba(255,255,255,0.08);
          }
          .glass-panel input, .glass-panel select, .glass-panel textarea {
            color: #fff !important;
            background: rgba(55,65,81,0.7) !important;
            border-color: rgba(255,255,255,0.15) !important;
          }
        `}</style>
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div>
            {/* Filter Bar */}
            <div className="glass-panel mb-6 p-4 flex flex-wrap gap-2 items-center">
              {/* ...existing filter bar code... */}
              {/** The filter bar code is rendered by your filter logic, so this is a style wrapper **/}
              {/** If you want to move the filter bar code here, let me know! **/}
            </div>
            {/* Company List Component */}
            <CompanyList
              companies={companies}
              onEdit={handleEditCompany}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
            {/* Empty State Styling (if no companies) */}
            {(!companies || companies.length === 0) && (
              <div className="glass-panel flex flex-col items-center justify-center py-16 mt-8">
                <div className="text-5xl mb-4">😔</div>
                <div className="text-xl text-white font-semibold mb-2">No companies found</div>
                <div className="text-gray-300">Add your first company to get started.</div>
              </div>
            )}
          </div>
        )}

        {/* Company Form Modal */}
        {showForm && (
          <CompanyForm
            company={editingCompany}
            onSubmit={handleFormSubmit}
            onClose={handleFormClose}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;

