import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SubmissionsPage from './pages/SubmissionsPage';
import ReviewAssignmentsPage from './pages/ReviewAssignmentsPage';
import ManageSubmissionsPage from './pages/ManageSubmissionsPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';
import NewSubmissionPage from './components/NewSubmissionPage';
import 'bootstrap/dist/css/bootstrap.min.css';
const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />}>
          <Route path="submissions" element={<PrivateRoute element={<SubmissionsPage />} />} />
          <Route path="new-submission"  element={<NewSubmissionPage />} />
          <Route path="review-assignments" element={<PrivateRoute element={<ReviewAssignmentsPage />} />} />
          <Route path="manage-submissions" element={<PrivateRoute element={<ManageSubmissionsPage />} />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
