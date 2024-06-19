// routes.js

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SubmissionsPage from './pages/SubmissionsPage';
import ReviewAssignmentsPage from './pages/ReviewAssignmentsPage';
import ManageSubmissionsPage from './pages/ManageSubmissionsPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute'; // Assuming you have a PrivateRoute component

const routes = [
  { 
    path: '/login', 
    element: <LoginPage /> 
  },
  { 
    path: '/dashboard',
    element: <PrivateRoute element={<Dashboard />} />,
    children: [
      { 
        path: 'submissions',  // Adjusted to be a relative path
        element: <PrivateRoute element={<SubmissionsPage />} /> 
      },
      { 
        path: 'review-assignments',  // Adjusted to be a relative path
        element: <PrivateRoute element={<ReviewAssignmentsPage />} /> 
      },
      { 
        path: 'manage-submissions',  // Adjusted to be a relative path
        element: <PrivateRoute element={<ManageSubmissionsPage />} /> 
      },
      { 
        path: '*', 
        element: <NotFoundPage /> 
      }
    ]
  },
  { 
    path: '*', 
    element: <NotFoundPage /> 
  }
];

export default routes;
