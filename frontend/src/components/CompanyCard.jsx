import React from 'react';

function CompanyCard({ company, onEdit, onDelete, onStatusChange }) {
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('applied')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (statusLower.includes('screening')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (statusLower.includes('interview')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (statusLower.includes('offer')) return 'bg-green-100 text-green-800 border-green-200';
    if (statusLower.includes('rejected')) return 'bg-red-100 text-red-800 border-red-200';
    if (statusLower.includes('accepted')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusOptions = [
    'Applied',
    'Screening',
    'Interview Scheduled',
    'Offer Received',
    'Accepted',
    'Rejected'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-purple-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{company.companyName}</h3>
          <p className="text-gray-600">{company.role}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(company)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(company._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Status Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={company.status}
          onChange={(e) => onStatusChange(company._id, e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border-2 font-semibold transition-colors ${getStatusColor(company.status)}`}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Applied Date */}
      <div className="flex items-center text-sm text-gray-600">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Applied on {formatDate(company.appliedDate)}
      </div>
    </div>
  );
}

export default CompanyCard;
