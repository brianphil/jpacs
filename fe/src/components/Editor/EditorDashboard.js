// components/Editor/EditorDashboard.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import axios from "axios";
import { config } from "../../services/config";
import { useAuth } from "../../context/AuthContext";
import Select from "react-select";
import SubmissionDetail from "../Reviewer/SubmissionDetail";
import SubmissionsPage from "../../pages/SubmissionsPage";
import ApprovalDashboard from "./ApprovalDashboard";
import ArticlesTable from "./ArticlesTable";

const EditorDashboard = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [status, setStatus] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentArticle, setCurrentArticle] = useState({});
  const [openApproveModal, setOpenPublishModal] = useState(false);
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        const configs = {
          headers: {
            Authorization: token,
          },
        };
        const { data } = await axios.get(
          `${config.BASE_URL}/api/articles/all`,
          configs
        );
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles: ", error);
      }
    };

    fetchArticles();
  }, []);

  const handleAssignReviewer = async () => {
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const configs = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.post(
        `${config.BASE_URL}/api/articles/${selectedArticle}/assign-reviewer`,
        { reviewerId: selectedReviewer.value },
        configs
      );
      if (response) {
        setSuccess("Reviewer assigned successfully!");
        setShowAssignModal(false);
      }
    } catch (error) {
      console.error("Error assigning reviewer: ", error);
      if (error.response.status === 400) {
        setError("Failed to assign reviewer.");
        setShowAssignModal(false);
      } else if (error.response.status === 304) {
        setError("The selected reviewer has already been assigned.");
        setShowAssignModal(false);
      }
    }
  };

  const handleUpdateStatus = async () => {
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const configs = {
        headers: {
          Authorization: token,
        },
      };
      await axios.patch(
        `${config.BASE_URL}/api/articles/${selectedArticle}/status`,
        { status },
        configs
      );
      setSuccess("Status updated successfully!");
      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating status: ", error);
      setError("Failed to update status.");
    }
  };

  const fetchReviewers = async (inputValue) => {
    try {
      const token = localStorage.getItem("token");
      const configs = {
        headers: {
          Authorization: token,
        },
      };
      const { data } = await axios.get(
        `${config.BASE_URL}/api/reviewers/search?query=${inputValue}`,
        configs
      );
      setReviewers(
        data.map((reviewer) => ({
          value: reviewer._id,
          label: `${reviewer.firstName} ${reviewer.lastName}`,
        }))
      );
    } catch (error) {
      console.error("Error fetching reviewers: ", error);
    }
  };

  const handleInputChange = (newValue) => {
    fetchReviewers(newValue);
  };

  const openAssignModal = (articleId) => {
    setSelectedArticle(articleId);
    setShowAssignModal(true);
  };

  const openStatusModal = (articleId) => {
    setSelectedArticle(articleId);
    setShowStatusModal(true);
  };
  const openPublishModal = (articleId) => {
    setSelectedArticle(articleId);
    setOpenPublishModal(true);
  };

  const openViewModal = async (articleId) => {
    setCurrentArticle(articles.find((article) => article._id === articleId));
    setSelectedArticle(articleId);
    setShowDetails(true);
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const configs = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.post(
        `${config.BASE_URL}/api/articles/${selectedArticle}/approve`,
        { status },
        configs
      );
      setSuccess(response?.data?.message);
      setOpenPublishModal(false);
    } catch (error) {
      console.error("Error publishing article: ", error);
      setError("Failed to publish article.");
    }
  };
  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  return (
    <Container>
      <Tabs defaultActiveKey="main" id="editor-dashboard-tabs" className="mb-3">
        <Tab eventKey="main" title="Main Dashboard">
          <h3 className="mt-4">Editor Dashboard</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <ArticlesTable
            articles={articles}
            openViewModal={openViewModal}
            openAssignModal={openAssignModal}
            openStatusModal={openStatusModal}
            openPublishModal={openPublishModal}
          />

          {/* Assign Reviewer Modal */}
          <Modal
            show={showAssignModal}
            onHide={() => setShowAssignModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Assign Reviewer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="reviewer">
                  <Form.Label>Reviewer</Form.Label>
                  <Select
                    cacheOptions
                    loadOptions={fetchReviewers}
                    onInputChange={handleInputChange}
                    onChange={setSelectedReviewer}
                    options={reviewers}
                  />
                </Form.Group>
                <Button
                  className="m-3"
                  variant="primary"
                  onClick={handleAssignReviewer}
                >
                  Assign
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Update Status Modal */}
          <Modal
            show={showStatusModal}
            onHide={() => setShowStatusModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Article Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under review">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </Form.Control>
                </Form.Group>
                <Button
                  className="m-3"
                  variant="primary"
                  onClick={handleUpdateStatus}
                >
                  Update
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
          {/* Publish Journal Modal */}
          <Modal
            show={openApproveModal}
            onHide={() => setOpenPublishModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Publish Article</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="publish-warning">
                <h2>Warning!</h2>
                <p>{success}</p>
                <p>
                  Are you sure you want to publish this article? Once published,
                  the article will be visible to the public and cannot be edited
                  further. Please ensure the following before proceeding:
                </p>
                <ul>
                  <li>The content has been thoroughly reviewed.</li>
                  <li>The article follows all submission guidelines.</li>
                  <li>
                    All details, including the abstract and file attachments,
                    are correct.
                  </li>
                </ul>
                <p>
                  By confirming, you agree that this article is ready for public
                  release.
                </p>
                <strong>This action cannot be undone.</strong>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => setOpenPublishModal(false)}
              >
                Close
              </Button>
              <Button variant="success" onClick={handlePublish}>
                Approve and Publish
              </Button>
            </Modal.Footer>
          </Modal>

          {/* View Details Modal */}
          <Modal show={showDetails} onHide={handleCloseDetails}>
            <Modal.Header closeButton>
              <Modal.Title>{currentArticle.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SubmissionsPage submissionId={selectedArticle} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDetails}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Tab>

        <Tab eventKey="approval" title="Approval Dashboard">
          <ApprovalDashboard />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EditorDashboard;
