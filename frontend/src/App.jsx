import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import QuestionList from './components/QuestionList';
import PrepList from './components/PrepList';
import AIQuestionGenerator from './components/AIQuestionGenerator';
import Resources from './components/Resources';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <ProtectedRoute>
                <QuestionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prep"
            element={
              <ProtectedRoute>
                <PrepList />
              </ProtectedRoute>
            }
          /> 
          <Route
            path="/ai-generator"
            element={
              <ProtectedRoute>
                <AIQuestionGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;