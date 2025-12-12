import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlurText from './BlurText';
import Aurora from './Aurora';
import BounceCards from './BounceCards';

function Home() {
  const navigate = useNavigate();

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  // Feature cards data
  const features = [
    {
      icon: "🏢",
      title: "Company Tracking",
      description: "Organize companies you're interviewing with, track roles, and set interview dates."
    },
    {
      icon: "📚",
      title: "Smart Resources",
      description: "Curate learning materials, get AI-powered recommendations, and track your study progress."
    },
    {
      icon: "🤖",
      title: "AI Question Generator",
      description: "Generate personalized questions with instant save to Question Bank and smart resource suggestions."
    },
    {
      icon: "🗓️",
      title: "AI Study Plan",
      description: "Auto-generate complete study plans with curated resources and prioritized tasks in one click."
    }
  ];

  const transformStyles = [
    "rotate(3deg) translate(-120px)",
    "rotate(-2deg) translate(-40px)",
    "rotate(2deg) translate(40px)",
    "rotate(-3deg) translate(120px)"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background (Aurora) */}
      <div className="absolute inset-0 w-full h-full">
        <Aurora speed={24} opacity={0.6} />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-gray-900/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Interview Prep Tracker</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Get Started
            </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
          <BlurText
            text="Ace Your Next Interview with AI-Powered Preparation"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-5xl font-bold text-white mb-6 justify-center text-glow"
          />
          <BlurText
            text="Track companies, build question banks, generate AI study plans with curated resources, and get smart recommendations - your complete interview preparation toolkit."
            delay={50}
            animateBy="words"
            direction="top"
            className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto justify-center font-light"
          />
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Preparing Now
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>

          {/* Bounce Cards Animation */}
          <div className="flex justify-center mt-20 mb-12">
            <BounceCards
              cards={features}
              containerWidth={800}
              containerHeight={350}
              animationDelay={1}
              animationStagger={0.1}
              easeType="elastic.out(1, 0.5)"
              transformStyles={transformStyles}
              enableHover={true}
            />
          </div>

        {/* AI-Powered Features Section */}
        <div className="mt-20 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4 text-glow">AI-Powered Study Assistant</h3>
            <p className="text-lg text-gray-200">
              Let AI help you prepare smarter with intelligent features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-4xl mb-3">💾</div>
              <h4 className="text-lg font-bold text-white mb-2">Quick Save</h4>
              <p className="text-sm text-gray-200">Save AI-generated questions directly to your Question Bank with one click</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-4xl mb-3">📚</div>
              <h4 className="text-lg font-bold text-white mb-2">Smart Recommendations</h4>
              <p className="text-sm text-gray-200">Get relevant learning resources automatically based on your topic</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-4xl mb-3">🗓️</div>
              <h4 className="text-lg font-bold text-white mb-2">Study Plan Generator</h4>
              <p className="text-sm text-gray-200">Generate complete study plans with curated resources and prioritized tasks</p>
            </div>
          </div>
        </div>

        {/* Prep Items Section */}
        <div className="mt-12 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4 text-glow">Organize Your Preparation</h3>
            <p className="text-lg text-gray-300">
              Create to-do items for your interview prep with priority levels and status tracking
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="text-3xl mb-3">🔴</div>
              <h4 className="text-lg font-bold text-red-800 mb-2">High Priority</h4>
              <p className="text-sm text-red-600">Critical tasks that need immediate attention</p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="text-3xl mb-3">🟡</div>
              <h4 className="text-lg font-bold text-yellow-800 mb-2">Medium Priority</h4>
              <p className="text-sm text-yellow-600">Important but not urgent preparation items</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl mb-3">🟢</div>
              <h4 className="text-lg font-bold text-green-800 mb-2">Low Priority</h4>
              <p className="text-sm text-green-600">Nice-to-have items for extra preparation</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-4 text-shine">Ready to Land Your Dream Job?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful candidates who prepared with our platform
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Create Free Account
          </button>
        </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/80 backdrop-blur-sm text-white py-8 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400">
              © 2025 Interview Prep Tracker. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
