import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  ListGroup,
} from "react-bootstrap";
import AuthorDashboard from "./Author/AuthorDashboard";
import ReviewAssignmentsPage from "./ReviewAssignmentsPage";
import EditorDashboard from "../components/Editor/EditorDashboard";
import { FaSignOutAlt } from "react-icons/fa";
const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderDashboard = () => {
    if (user.role === "author") {
      return <AuthorDashboard />;
    } else if (user.role === "editor") {
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
    } else if (user.role === "reviewer") {
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
    } else {
      return <div>Unknown user role</div>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-5">
      {user ? renderDashboard() : <div>Loading...</div>}
    </Container>
  );
};

export default Dashboard;
