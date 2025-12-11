import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import QuestionForm from './QuestionForm';

function QuestionList() {
  const { user, logout } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');

  // Unique topics and companies for filters
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Set body background color
  React.useEffect(() => {
    document.body.style.backgroundColor = '#FFF5F7';
    return () => {
      document.body.style.backgroundColor = '#0f172a';
    };
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Apply filters whenever questions or filter states change
  useEffect(() => {
    applyFilters();
  }, [questions, searchTerm, selectedTopic, selectedCompany]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/questions');
      setQuestions(response.data);
      
      // Extract unique topics
      const uniqueTopics = [...new Set(response.data.map(q => q.topic))];
      setTopics(uniqueTopics);
      
      // Extract unique companies
      const uniqueCompanies = [...new Set(response.data.map(q => q.companyId?.companyName).filter(Boolean))];
      setCompanies(uniqueCompanies);
      
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(q =>
        q.question.toLowerCase().includes(search) ||
        q.answer.toLowerCase().includes(search) ||
        q.topic.toLowerCase().includes(search)
      );
    }

    // Topic filter
    if (selectedTopic !== 'All') {
      filtered = filtered.filter(q => q.topic === selectedTopic);
    }

    // Company filter
    if (selectedCompany !== 'All') {
      filtered = filtered.filter(q => q.companyId?.companyName === selectedCompany);
    }

    setFilteredQuestions(filtered);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowForm(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingQuestion) {
      await api.put(`/questions/${editingQuestion._id}`, formData);
    } else {
      await api.post('/questions', formData);
    }
    fetchQuestions();
    setShowForm(false);
    setEditingQuestion(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  const getTopicColor = (topic) => {
    const colors = {
      'Data Structures': 'bg-blue-100 text-blue-800',
      'Algorithms': 'bg-green-100 text-green-800',
      'System Design': 'bg-purple-100 text-purple-800',
      'Behavioral': 'bg-pink-100 text-pink-800',
      'Frontend': 'bg-cyan-100 text-cyan-800',
      'Backend': 'bg-indigo-100 text-indigo-800',
      'Database': 'bg-amber-100 text-amber-800',
      'JavaScript': 'bg-yellow-100 text-yellow-800',
      'React': 'bg-sky-100 text-sky-800',
      'Python': 'bg-emerald-100 text-emerald-800',
    };
    return colors[topic] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interview Questions</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.username}!</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Dashboard
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions, answers, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={handleAddQuestion}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Question
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="All">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="All">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <span>Showing {filteredQuestions.length} of {questions.length} questions</span>
            {(searchTerm || selectedTopic !== 'All' || selectedCompany !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTopic('All');
                  setSelectedCompany('All');
                }}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredQuestions.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm || selectedTopic !== 'All' || selectedCompany !== 'All'
                ? 'Try adjusting your filters or search term.'
                : 'Add your first interview question to get started.'}
            </p>
            {!searchTerm && selectedTopic === 'All' && selectedCompany === 'All' && (
              <button
                onClick={handleAddQuestion}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Your First Question
              </button>
            )}
          </div>
        ) : (
          /* Questions List */
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div key={question._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTopicColor(question.topic)}`}>
                        {question.topic}
                      </span>
                      {question.companyId && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          {question.companyId.companyName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(question._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Question */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {question.question}
                </h3>

                {/* Answer */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Answer:</p>
                  <p className="text-gray-600 whitespace-pre-wrap">{question.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Question Form Modal */}
        {showForm && (
          <QuestionForm
            question={editingQuestion}
            onSubmit={handleFormSubmit}
            onClose={handleFormClose}
          />
        )}
      </main>
    </div>
  );
}

export default QuestionList;
