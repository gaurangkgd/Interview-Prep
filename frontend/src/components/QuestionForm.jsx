import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function QuestionForm({ question, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    topic: '',
    companyId: '',
  });

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch companies for dropdown
  useEffect(() => {
    fetchCompanies();
  }, []);

  // If editing, populate form with existing data
  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question,
        answer: question.answer,
        topic: question.topic,
        companyId: question.companyId._id || question.companyId,
      });
    }
  }, [question]);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (err) {
      console.error('Failed to fetch companies');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  const topicSuggestions = [
    'Data Structures',
    'Algorithms',
    'System Design',
    'Behavioral',
    'Frontend',
    'Backend',
    'Database',
    'Networking',
    'Operating Systems',
    'Object-Oriented Design',
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {question ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question */}
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              rows="3"
              placeholder="e.g., What is the difference between let and var in JavaScript?"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          {/* Answer */}
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Answer *
            </label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Enter your detailed answer here..."
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          {/* Topic with Datalist */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Topic/Tag *
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              list="topics"
              value={formData.topic}
              onChange={handleChange}
              required
              placeholder="e.g., Data Structures, Algorithms, React"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
            <datalist id="topics">
              {topicSuggestions.map((topic) => (
                <option key={topic} value={topic} />
              ))}
            </datalist>
            <p className="mt-1 text-xs text-gray-500">
              Start typing to see suggestions or enter your own topic
            </p>
          </div>

          {/* Company Link */}
          <div>
            <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
              Company *
            </label>
            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.companyName} - {company.role}
                </option>
              ))}
            </select>
            {companies.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">
                No companies found. Add a company first to link questions.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || companies.length === 0}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : question ? 'Update' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionForm;
