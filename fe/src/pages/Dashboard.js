import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card, ListGroup } from 'react-bootstrap';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderAuthorDashboard = () => {
    return (
      <Container>
        <Row>
          <Col>
            <h3>Welcome, {user.firstName} {user.lastName}!</h3>
            <Card>
              <Card.Header>Your Dashboard</Card.Header>
              <Card.Body>
                <Card.Title>Author Dashboard</Card.Title>
                <Card.Text>
                  Here you can manage your submissions and view their statuses.
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
      </Container>
    );
  };

  const renderEditorDashboard = () => {
    return (
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
      </Container>
    );
  };

  const renderReviewerDashboard = () => {
    return (
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
      </Container>
    );
  };

  const renderDashboard = () => {
    if (user) {
      switch (user.role) {
        case 'author':
          return renderAuthorDashboard();
        case 'editor':
          return renderEditorDashboard();
        case 'reviewer':
          return renderReviewerDashboard();
        default:
          return <div>Unknown user role</div>;
      }
    } else {
      return <div>Loading...</div>;
    }
  };

  return (
    <Container className="mt-5">
      {renderDashboard()}
    </Container>
  );
};

export default Dashboard;
