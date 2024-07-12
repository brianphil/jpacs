import React from 'react';
import { Container } from 'react-bootstrap';
import ReviewerDashboard from '../components/Reviewer/ReviewerDashboard';

const ReviewAssignmentsPage = () => {
  return (
    <Container className="mt-5">
      <ReviewerDashboard/>
      {/* Add review assignments related content and logic here */}
    </Container>
  );
};

export default ReviewAssignmentsPage;
