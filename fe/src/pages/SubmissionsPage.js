import React from 'react';
import { Container } from 'react-bootstrap';
import DetailedSubmission from '../components/DetailedSubmission';

const SubmissionsPage = ({submissionId}) => {
  return (
    <Container className="mt-5">
      <DetailedSubmission submissionId={submissionId}/>
      {/* Add submissions related content and logic here */}
    </Container>
  );
};

export default SubmissionsPage;
