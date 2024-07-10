import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import { Container, Button, Row, Col, Card, ListGroup } from 'react-bootstrap';
import AuthorDashboard from './Author/AuthorDashboard';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderAuthorDashboard = () => {
    return <AuthorDashboard user={user} handleLogout={handleLogout} />;
  };

  const renderEditorDashboard = () => (
    <Container>
      <Row>
        <Col>
          <h3>Welcome, {user.firstName} {user.lastName}!</h3>
          <Card>
            <Card.Header>Your Dashboard</Card.Header>
            <Card.Body>
              <Card.Title>Editor Dashboard</Card.Title>
              <Card.Text>
                Here you can manage submissions, assign reviewers, and make editorial decisions.
              </Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item>Username: {user.username}</ListGroup.Item>
                <ListGroup.Item>Email: {user.email}</ListGroup.Item>
                <ListGroup.Item>Affiliation: {user.affiliation}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          <Button variant="primary" onClick={handleLogout} className="mt-3">
            Logout
          </Button>
        </Col>
      </Row>
      <Outlet />
    </Container>
  );

  const renderReviewerDashboard = () => (
    <Container>
      <Row>
        <Col>
          <h3>Welcome, {user.firstName} {user.lastName}!</h3>
          <Card>
            <Card.Header>Your Dashboard</Card.Header>
            <Card.Body>
              <Card.Title>Reviewer Dashboard</Card.Title>
              <Card.Text>
                Here you can review submissions assigned to you and submit your reviews.
              </Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item>Username: {user.username}</ListGroup.Item>
                <ListGroup.Item>Email: {user.email}</ListGroup.Item>
                <ListGroup.Item>Affiliation: {user.affiliation}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          <Button variant="primary" onClick={handleLogout} className="mt-3">
            Logout
          </Button>
        </Col>
      </Row>
      <Outlet />
    </Container>
  );

  const renderDashboard = () => {
    if (user.role === 'author') {
      return renderAuthorDashboard();
    } else if (user.role === 'editor') {
      return renderEditorDashboard();
    } else if (user.role === 'reviewer') {
      return renderReviewerDashboard();
    } else {
      return <div>Unknown user role</div>;
    }
  };

  return (
    <Container className="mt-5">
      {user ? renderDashboard() : <div>Loading...</div>}
    </Container>
  );
};

export default Dashboard;
