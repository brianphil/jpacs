// components/Dashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card, ListGroup } from 'react-bootstrap';
import AuthorDashboard from './Author/AuthorDashboard';
import ReviewAssignmentsPage from "./ReviewAssignmentsPage";
import EditorDashboard from "../components/Editor/EditorDashboard";
import { FaSignOutAlt } from "react-icons/fa";
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderAuthorDashboard = () => {
    return <AuthorDashboard />;
  };

  const renderEditorDashboard = () => {
    return (
      <Container>
      <Row>
        <Col className="mt-3" style={{ textAlign: "right" }}>
          <Button variant="primary" onClick={handleLogout} className="mt-3">
            Logout <FaSignOutAlt style={{ marginLeft: "5px" }} />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>
            Welcome, {user.firstName} {user.lastName}!
          </h3>
          <Card>
            <Card.Header>Your Dashboard</Card.Header>
            <Card.Body>
              <Card.Title>Editor Dashboard</Card.Title>
              <Card.Text>
                Here you can manage submissions, assign reviewers, and make
                editorial decisions.
              </Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item>Username: {user.username}</ListGroup.Item>
                <ListGroup.Item>Email: {user.email}</ListGroup.Item>
                <ListGroup.Item>
                  Affiliation: {user.affiliation}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col>
              <EditorDashboard />
            </Col>
          </Row>
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
          <Row>
            <Col className="mt-3" style={{ textAlign: "right" }}>
              <Button
                variant="primary"
                onClick={handleLogout}
                className="mt-3"
              >
                Logout <FaSignOutAlt style={{ marginLeft: "5px" }} />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <ReviewAssignmentsPage />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
    );
  };

  const renderDashboard = () => {
    if (!user.isApproved) {
      return (
        <Container>
          <Row>
            <Col>
              <h3>Awaiting Approval</h3>
              <p>Your account is awaiting approval. Please check back later.</p>
              <Button variant="primary" onClick={handleLogout} className="mt-3">
                Logout
              </Button>
            </Col>
          </Row>
        </Container>
      );
    }

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
