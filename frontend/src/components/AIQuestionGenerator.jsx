import React, { useState } from 'react';
import Aurora from './Aurora';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

function AIQuestionGenerator() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [recommendedResources, setRecommendedResources] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [showStudyPlanGenerator, setShowStudyPlanGenerator] = useState(false);

  // Set body background color based on theme
  React.useEffect(() => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#0b1220';
    } else {
      document.body.style.backgroundColor = '#f9fafb';
    }
  }, [theme]);

  const [formData, setFormData] = useState({
    role: 'Full Stack',
    topic: 'JavaScript',
    difficulty: 'Medium',
    count: 5,
  });

  const roles = ['Frontend', 'Backend', 'Full Stack', 'Data Science', 'DevOps', 'Mobile'];
  const topics = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
    'System Design', 'Algorithms', 'Data Structures', 'Behavioral',
    'MongoDB', 'TypeScript', 'AWS', 'Docker', 'REST APIs'
  ];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const counts = [5, 10, 15];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');
      setGeneratedQuestions([]);
      setRecommendedResources([]);

      const response = await api.post('/ai/generate-questions', formData);
      
      if (response.data.success) {
        setGeneratedQuestions(response.data.questions);
        // Load recommended resources based on topic
        fetchRecommendedResources(formData.topic);
      } else {
        setError('Using fallback questions. AI service may be temporarily unavailable.');
        setGeneratedQuestions(response.data.questions || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedResources = async (topic) => {
    try {
      const response = await api.get(`/resources?topic=${topic}`);
      setRecommendedResources(response.data.slice(0, 5)); // Top 5 resources
    } catch (err) {
      console.error('Failed to fetch recommended resources:', err);
    }
  };

  const saveQuestionToBank = async (question) => {
    try {
      await api.post('/questions', {
        question: question.question,
        answer: question.answer,
        topic: question.topic,
        difficulty: question.difficulty
      });
      alert('✅ Question saved to your Question Bank!');
    } catch (err) {
      alert('Failed to save question');
    }
  };

  const addResourceFromRecommendation = async (resource) => {
    try {
      await api.post('/resources', {
        title: resource.title,
        url: resource.url,
        type: resource.type,
        topic: resource.topic,
        description: resource.description,
        rating: resource.rating
      });
      alert('✅ Resource added to your collection!');
    } catch (err) {
      alert('Failed to add resource');
    }
  };

  const generateStudyPlan = async () => {
    try {
      setLoading(true);
      const plan = {
        topic: formData.topic,
        difficulty: formData.difficulty,
        duration: '2 weeks',
        resources: [
          {
            title: `Complete ${formData.topic} Guide`,
            url: `https://developer.mozilla.org/en-US/docs/Web/${formData.topic}`,
            type: 'Documentation',
            topic: formData.topic,
            description: `Official documentation for ${formData.topic}`,
            rating: 5
          },
          {
            title: `${formData.topic} Tutorial Series`,
            url: `https://www.youtube.com/results?search_query=${formData.topic}+tutorial`,
            type: 'Video',
            topic: formData.topic,
            description: `Video tutorials for ${formData.topic}`,
            rating: 4
          },
          {
            title: `${formData.topic} Practical Course`,
            url: `https://www.udemy.com/courses/search/?q=${formData.topic}`,
            type: 'Course',
            topic: formData.topic,
            description: `Hands-on course for ${formData.topic}`,
            rating: 5
          }
        ],
        tasks: [
          { topic: `Read ${formData.topic} fundamentals`, description: `Study core concepts and fundamental principles of ${formData.topic}`, priority: 'High', completed: false },
          { topic: `Practice ${formData.topic} coding problems`, description: `Solve coding challenges and practice problems related to ${formData.topic}`, priority: 'High', completed: false },
          { topic: `Build a project with ${formData.topic}`, description: `Create a hands-on project to apply ${formData.topic} knowledge`, priority: 'Medium', completed: false },
          { topic: `Review ${formData.topic} best practices`, description: `Learn industry standards and best practices for ${formData.topic}`, priority: 'Medium', completed: false },
          { topic: `Mock interviews on ${formData.topic}`, description: `Practice interview questions and scenarios for ${formData.topic}`, priority: 'High', completed: false }
        ]
      };
      setStudyPlan(plan);
    } catch (err) {
      alert('Failed to generate study plan');
    } finally {
      setLoading(false);
    }
  };

  const saveStudyPlan = async () => {
    if (!studyPlan) return;
    
    try {
      // Save resources
      for (const resource of studyPlan.resources) {
        await api.post('/resources', resource);
      }
      
      // Save prep items
      for (const task of studyPlan.tasks) {
        await api.post('/prep-items', {
          topic: task.topic,
          description: task.description,
          priority: task.priority,
          completed: task.completed
        });
      }
      
      alert('✅ Study plan saved! Check Resources and Prep List.');
      setShowStudyPlanGenerator(false);
      setStudyPlan(null);
    } catch (err) {
      console.error('Save error:', err);
      alert(`Failed to save study plan: ${err.response?.data?.message || err.message}`);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen w-full relative overflow-x-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Aurora Animated Background - Only in dark mode */}
      {theme === 'dark' && (
        <div className="absolute inset-0 w-full h-full -z-10">
          <Aurora />
        </div>
      )}
      
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white'} backdrop-blur-md shadow-lg sticky top-0 z-50 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <span className="text-3xl">🤖</span>
                AI Question Generator
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Generate personalized interview questions with AI</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-700/80 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2`}
                title="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
                <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-700/80 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} rounded-lg transition-all duration-200 hover:scale-105`}
              >
                Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/questions'}
                className="px-4 py-2 bg-purple-600/80 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 hover:scale-105"
              >
                Question Bank
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-8 sm:py-12">
        {/* Centered Container */}
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Generator Form - Glassmorphism Card */}
          <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-xl rounded-2xl shadow-2xl p-8 border ${theme === 'dark' ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'} transition-all duration-300`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Configure Your Questions</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Customize your AI-generated interview prep</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Role */}
              <div>
                <label className={`block text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2 uppercase tracking-wide`}>
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className={`block text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2 uppercase tracking-wide`}>
                  Topic
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className={`block text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2 uppercase tracking-wide`}>
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              {/* Count */}
              <div>
                <label className={`block text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2 uppercase tracking-wide`}>
                  Questions
                </label>
                <select
                  name="count"
                  value={formData.count}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                >
                  {counts.map(count => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary CTA - Generate Questions */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Questions</span>
                  </>
                )}
              </button>

              {/* Secondary - Study Plan */}
              <button
                onClick={() => setShowStudyPlanGenerator(!showStudyPlanGenerator)}
                className={`px-6 py-4 bg-transparent border-2 ${theme === 'dark' ? 'border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:border-teal-500' : 'border-teal-400 text-teal-600 hover:bg-teal-50 hover:border-teal-500'} rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2`}
              >
                <span className="text-xl">🗓️</span>
                <span>Study Plan</span>
              </button>
            </div>
          </div>

          {/* Study Plan Generator */}
          {showStudyPlanGenerator && (
            <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-xl rounded-2xl shadow-2xl p-8 border ${theme === 'dark' ? 'border-teal-500/20 hover:border-teal-500/40' : 'border-teal-200 hover:border-teal-300'} transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-2xl">
                  🗓️
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI Study Plan Generator</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Complete roadmap with resources and tasks</p>
                </div>
              </div>
            
            {!studyPlan ? (
              <button
                onClick={generateStudyPlan}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Generating Plan...' : 'Generate Study Plan'}
              </button>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Study Plan for {studyPlan.topic}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Duration: {studyPlan.duration} • Difficulty: {formData.difficulty}</p>
                </div>

                {/* Recommended Resources */}
                {recommendedResources.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-purple-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📚</span>
                      Recommended Resources for {formData.topic}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Based on your topic, here are some resources from your collection:
                    </p>
                    <div className="space-y-3">
                      {recommendedResources.map((resource) => (
                        <div key={resource._id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{resource.type}</span>
                                <span className="text-yellow-500 text-sm">{'⭐'.repeat(resource.rating)}</span>
                                {resource.studied && <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">✓ Studied</span>}
                              </div>
                            </div>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                            >
                              Open
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Tasks */}
                <div className="mb-6">
                  <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                    <span>✅</span> Study Tasks
                  </h4>
                  <div className="space-y-3">
                    {studyPlan.tasks.map((task, idx) => (
                      <div key={idx} className={`p-4 ${theme === 'dark' ? 'bg-gray-900/40' : 'bg-gray-100'} rounded-xl border ${theme === 'dark' ? 'border-gray-700 hover:border-purple-500/50' : 'border-gray-200 hover:border-purple-400'} transition-all duration-200 flex items-center gap-3`}>
                        <span className="text-2xl">📝</span>
                        <div className="flex-1">
                          <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>{task.topic}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority} Priority
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveStudyPlan}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700"
                  >
                    💾 Save Plan (Add to Resources & Prep List)
                  </button>
                  <button
                    onClick={() => setStudyPlan(null)}
                    className={`px-6 py-3 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} rounded-lg font-semibold transition-all duration-200`}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

          {/* Error Message */}
          {error && (
            <div className={`${theme === 'dark' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-yellow-100 border-yellow-300 text-yellow-800'} border px-6 py-4 rounded-xl mb-6 flex items-center gap-3`}>
              <span className="text-2xl">⚠️</span>
              <p className="flex-1">{error}</p>
            </div>
          )}

        {/* Recommended Resources */}
        {recommendedResources.length > 0 && (
          <div className={`${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white'} backdrop-blur-md rounded-lg shadow-md p-6 mb-8 border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
              <span>📚</span>
              Recommended Resources for {formData.topic}
            </h2>
            <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-700'} mb-4`}>
              Based on your topic, here are some resources from your collection:
            </p>
            <div className="space-y-3">
              {recommendedResources.map((resource) => (
                <div key={resource._id} className={`p-4 ${theme === 'dark' ? 'bg-gray-900/30' : 'bg-gray-50'} rounded-lg border ${theme === 'dark' ? 'border-white/6' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{resource.title}</h3>
                      
                            <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-700'} mt-1`}>{resource.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{resource.type}</span>
                        <span className="text-yellow-400 text-sm">{'⭐'.repeat(resource.rating)}</span>
                        {resource.studied && <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">✓ Studied</span>}
                      </div>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                      Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          {/* Generated Questions */}
          {generatedQuestions.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">
                  💡
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Generated Questions
                  </h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{generatedQuestions.length} questions ready for you</p>
                </div>
              </div>

              <div className="space-y-4">
                {generatedQuestions.map((q, index) => (
                  <div
                    key={index}
                    className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-xl rounded-2xl shadow-xl p-6 border ${theme === 'dark' ? 'border-white/10 hover:border-purple-500/50' : 'border-gray-200 hover:border-purple-400'} transition-all duration-300 hover:shadow-2xl`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Question Number Badge */}
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-4 gap-3">
                          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex-1 leading-tight`}>
                            {q.question}
                          </h3>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getDifficultyColor(q.difficulty)} whitespace-nowrap`}>
                            {q.difficulty}
                          </span>
                        </div>

                        {/* Answer */}
                        <div className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-xl p-4 mb-4 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                          <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-2`}>💡 Answer:</p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap leading-relaxed`}>{q.answer}</p>
                        </div>

                        {/* Topic Tag and Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-semibold">
                            🏷️ {q.topic}
                          </span>
                          <button
                            onClick={() => saveQuestionToBank(q)}
                            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 text-sm font-bold flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-green-500/30"
                          >
                            <span>💾</span>
                            <span>Save to Bank</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        )}

          {/* Empty State */}
          {!loading && generatedQuestions.length === 0 && (
            <div className={`${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100'} backdrop-blur-xl rounded-2xl shadow-xl p-16 text-center border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-6 animate-pulse">
                🤖
              </div>
              <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
                Ready to Generate Questions?
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg max-w-md mx-auto`}>
                Configure your preferences above and click the purple button to get started!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AIQuestionGenerator;
