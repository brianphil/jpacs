import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Modal
} from "react-bootstrap";
import axios from "axios";
import { config } from "../../services/config";
import { useAuth } from "../../context/AuthContext";
import SubmissionDetail from "./SubmissionDetail";
import DetailedSubmission from "../DetailedSubmission";

const ReviewerDashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [show, setShow] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [showArticle, setShowArticle] = useState(false);
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const configs = {
          headers: {
            Authorization: token
          }
        };
        // const { data } = await axios.get(`${config.BASE_URL}/api/articles/assigned/${user._id}`, configs);
        const { data } = await axios.get(
          `${config.BASE_URL}/api/articles/all`,
          configs
        );
        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions: ", error);
      }
    };

    fetchSubmissions();
  }, [user]);

  const handleClose = () => {
    setShow(false);
  };
  const handleCloseArticle = () => {
    setShowArticle(false);
  };

  const handleViewSubmission = (submissionId) => {
    setActiveArticle(submissionId);
    setShow(true);
    // navigate(`/dashboard/submissions/${submissionId}`);
  };

  const handleViewArticle = (submissionId) => {
    setActiveArticle(submissionId);
    setShowArticle(true);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3>
            Welcome, {user.firstName} {user.lastName}!
          </h3>
          <Card>
            <Card.Header>Your Dashboard</Card.Header>
            <Card.Body>
              <Card.Title>Reviewer Dashboard</Card.Title>
              <Card.Text>
                Here you can view the submissions assigned to you and provide
                your feedback.
              </Card.Text>
              <ListGroup variant="flush">
                {submissions.map((submission) => (
                  <ListGroup.Item key={submission._id}>
                    <div>
                      <strong>Title:</strong> {submission.title}
                    </div>
                    <Button
                      variant="primary"
                      className="mt-2"
                      onClick={() => handleViewSubmission(submission._id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="success"
                      className="mt-2 mx-4"
                      onClick={() => handleViewArticle(submission._id)}
                    >
                      View Article
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>New Submission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <NewSubmissionPage fetchSubmissions = {fetchSubmissions} handleClose={handleClose}/> */}
            <SubmissionDetail submissionId={activeArticle} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showArticle} onHide={handleCloseArticle}>
          <Modal.Header closeButton>
            <Modal.Title>Article Submission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DetailedSubmission submissionId={activeArticle} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseArticle}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default ReviewerDashboard;
