import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function AIQuestionGenerator() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [recommendedResources, setRecommendedResources] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [showStudyPlanGenerator, setShowStudyPlanGenerator] = useState(false);

  // Set body background color
  React.useEffect(() => {
    document.body.style.backgroundColor = '#FFF5F7';
    return () => {
      document.body.style.backgroundColor = '#0f172a';
    };
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>🤖</span>
              AI Question Generator
            </h1>
            <p className="text-sm text-gray-600">Generate personalized interview questions with AI</p>
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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Question Bank
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Generator Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Configure Your Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            {/* Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                name="count"
                value={formData.count}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
              >
                {counts.map(count => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Questions
                </>
              )}
            </button>

            <button
              onClick={() => setShowStudyPlanGenerator(!showStudyPlanGenerator)}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
            >
              <span>🗓️</span>
              Study Plan
            </button>
          </div>
        </div>

        {/* Study Plan Generator */}
        {showStudyPlanGenerator && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-teal-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🗓️</span>
              AI Study Plan Generator
            </h2>
            <p className="text-gray-600 mb-4">
              Generate a complete study plan with resources and tasks for your topic.
            </p>
            
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Study Plan for {studyPlan.topic}
                  </h3>
                  <p className="text-sm text-gray-600">Duration: {studyPlan.duration} • Difficulty: {formData.difficulty}</p>
                </div>

                {/* Resources */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">📚 Recommended Resources</h4>
                  <div className="space-y-2">
                    {studyPlan.resources.map((resource, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{resource.title}</p>
                            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              {resource.url}
                            </a>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{resource.type}</span>
                              <span className="text-yellow-500">{'⭐'.repeat(resource.rating)}</span>
                            </div>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 text-sm font-medium whitespace-nowrap"
                          >
                            🔗 Open Link
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">✅ Study Tasks</h4>
                  <div className="space-y-2">
                    {studyPlan.tasks.map((task, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                        <span className="text-2xl">📝</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{task.topic}</p>
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
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
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
          <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

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

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Generated Questions ({generatedQuestions.length})
              </h2>
            </div>

            <div className="space-y-4">
              {generatedQuestions.map((q, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {/* Question Header */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1">
                          {index + 1}. {q.question}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </div>

                      {/* Answer */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Answer:</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{q.answer}</p>
                      </div>

                      {/* Topic Tag and Actions */}
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {q.topic}
                        </span>
                        <button
                          onClick={() => saveQuestionToBank(q)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 text-sm font-medium flex items-center gap-2"
                        >
                          <span>💾</span>
                          Save to Question Bank
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
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Generate Questions?
            </h3>
            <p className="text-gray-600">
              Select your preferences above and click "Generate Questions" to get started!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AIQuestionGenerator;
