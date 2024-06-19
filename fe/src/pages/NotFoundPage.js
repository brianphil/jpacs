import React from 'react';
import { Container } from 'react-bootstrap';

const NotFoundPage = () => {
  return (
    <Container className="mt-5">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </Container>
  );
};

export default NotFoundPage;
