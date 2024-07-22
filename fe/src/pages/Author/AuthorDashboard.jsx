import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  ListGroup,
  Table,
  Badge,
  Modal,
  Spinner
} from "react-bootstrap";
import axios from "axios";
import { config } from "../../services/config";
import { FaPlus, FaSignOutAlt, FaEye, FaTrash, FaEdit } from "react-icons/fa"; // Importing icons from react-icons library
import NewSubmissionPage from "../../components/NewSubmissionPage";
import SubmissionsPage from "../SubmissionsPage";

const AuthorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showDel, setShowDel] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentArticle, setCurrentArticle] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("create");
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.BASE_URL}/api/articles/mine`, {
        headers: {
          Authorization: token
        }
      });

      setSubmissions(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };
  const handleNewSubmission = () => {
    // navigate('/dashboard/new-submission'
    setMode("create");
    handleShow();
  };
  const handleCloseDel = () => {
    setShowDel(false);
  };

  const handleDel = (submissionId) => {
    handleDeleteSubmission(submissionId);
    setShowDel(false);
  };
  const handleViewSubmission = (submissionId) => {
    // Logic for viewing a submission goes here
    // navigate(`/dashboard/submissions/${submissionId}`)
    setCurrentArticle(submissions.filter((s) => s._id === submissionId)[0]);
    setShowDetails(true);
  };

  const handleDeleteSubmission = async (submissionId) => {
    // Logic for deleting a submission goes here
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${config.BASE_URL}/api/articles/${submissionId}`, {
        headers: {
          Authorization: token
        }
      });
      // Refresh submissions after deletion
      const updatedSubmissions = submissions.filter(
        (submission) => submission._id !== submissionId
      );
      setSubmissions(updatedSubmissions);
    } catch (error) {}
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col className="d-flex justify-content-end align-items-center">
          <Button
            variant="primary"
            onClick={handleNewSubmission}
            className="d-flex align-items-center"
            style={{ padding: "10px", marginRight: "10px" }}
          >
            <FaPlus style={{ marginRight: "5px" }} />
            New Submission
          </Button>
          <Button
            variant="outline-primary"
            onClick={handleLogout}
            className="d-flex align-items-center"
            style={{ padding: "10px" }}
          >
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
        </Col>
      </Row>
      <Outlet />
      <Row className="mt-4">
        <Col>
          <h5>Your Submissions</h5>
          {loading ? (
            <p>Loading submissions...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions?.map((submission, index) => (
                  <tr key={submission._id}>
                    <td>{index + 1}</td>
                    <td>{submission.title}</td>
                    <td>
                      <Badge
                        variant={
                          submission.status === "submitted" ? "info" : "success"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleViewSubmission(submission._id)}
                        className="m-2"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        className="m-2"
                        variant="outline-danger"
                        onClick={() => {
                          setShowDel(true);
                          setCurrentId(submission._id);
                        }}
                      >
                        <FaTrash />
                      </Button>
                      {submission.status === "submitted" ? (
                        <Button
                          className="m-2"
                          variant="outline-info"
                          onClick={() => {
                            setData(submission);
                            setMode("edit");
                            handleShow(true);
                          }}
                        >
                          <FaEdit />
                        </Button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>New Submission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <NewSubmissionPage
                fetchSubmissions={fetchSubmissions}
                handleClose={handleClose}
                data={data}
                mode={mode}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
        <Col>
          <Modal show={showDel} onHide={handleCloseDel}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Submission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this submission?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => handleDel(currentId)}>
                Yes
              </Button>
              <Button variant="secondary" onClick={handleCloseDel}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
        <Col>
          <Modal show={showDetails} onHide={handleCloseDetails}>
            <Modal.Header closeButton>
              <Modal.Title>{currentArticle.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SubmissionsPage submissionId={currentArticle._id} />
            </Modal.Body>
            <Modal.Footer>
              {/* <Button variant="danger" onClick={()=>handleDel(currentId)}>
                Yes
              </Button> */}
              <Button variant="secondary" onClick={handleCloseDetails}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthorDashboard;
