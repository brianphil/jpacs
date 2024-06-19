
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card, ListGroup, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { config } from '../../services/config';
import { FaPlus, FaSignOutAlt, FaEye, FaTrash } from 'react-icons/fa'; // Importing icons from react-icons library

const AuthorDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const fetchSubmissions = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${config.BASE_URL}/api/articles`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const sampleSubmissions = [
            {
              _id: '1',
              title: 'Sample Submission 1',
              status: 'submitted',
            },
            {
              _id: '2',
              title: 'Sample Submission 2',
              status: 'under review',
            },
            {
              _id: '3',
              title: 'Sample Submission 3',
              status: 'accepted',
            },
            {
              _id: '4',
              title: 'Sample Submission 4',
              status: 'rejected',
            },
          ];
          
          setSubmissions(response.data.articles);
          if(!submissions){
            setSubmissions(sampleSubmissions)
          }
        } catch (error) {
          console.error('Error fetching submissions:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSubmissions();
    }, []);
  
    const handleLogout = async () => {
      await logout();
      navigate('/login');
    };
  
    const handleNewSubmission = () => {
      // Logic for creating a new submission goes here
      // Redirect or navigate to the new submission page
      console.log('Creating new submission...');
    };
  
    const handleViewSubmission = (submissionId) => {
      // Logic for viewing a submission goes here
      console.log(`Viewing submission with ID: ${submissionId}`);
    };
  
    const handleDeleteSubmission = async (submissionId) => {
      // Logic for deleting a submission goes here
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${config.BASE_URL}/api/articles/${submissionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Refresh submissions after deletion
        const updatedSubmissions = submissions.filter(submission => submission._id !== submissionId);
        setSubmissions(updatedSubmissions);
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    };
  
    return (
      <Container>
        <Row className="mb-4">
          <Col className="d-flex justify-content-end align-items-center">
            <Button
              variant="primary"
              onClick={handleNewSubmission}
              className="d-flex align-items-center"
              style={{ padding: '10px', marginRight: '10px' }}
            >
              <FaPlus style={{ marginRight: '5px' }} />
              New Submission
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleLogout}
              className="d-flex align-items-center"
              style={{ padding: '10px' }}
            >
              Logout <FaSignOutAlt style={{ marginLeft: '5px' }} />
            </Button>
          </Col>
        </Row>
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
          </Col>
        </Row>
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
                  {submissions.map((submission, index) => (
                    <tr key={submission._id}>
                      <td>{index + 1}</td>
                      <td>{submission.title}</td>
                      <td>
                        <Badge variant={submission.status === 'submitted' ? 'info' : 'success'}>
                          {submission.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleViewSubmission(submission._id)}
                          className="mr-2"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDeleteSubmission(submission._id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default AuthorDashboard;


