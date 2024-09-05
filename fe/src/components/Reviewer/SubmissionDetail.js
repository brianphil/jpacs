import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from '../../services/config';
import { useAuth } from '../../context/AuthContext';

const SubmissionDetail = ({submissionId}) => {
  const { user } = useAuth();
//   const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(3);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const token = localStorage.getItem('token');
        const configs = {
          headers: {
            Authorization: token,
          },
        };
        const { data } = await axios.get(`${config.BASE_URL}/api/articles/${submissionId}`, configs);
        setSubmission(data);
      } catch (error) {
        console.error("Error fetching submission: ", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const configs = {
          headers: {
            Authorization: token,
          },
        };
        const { data } = await axios.get(`${config.BASE_URL}/api/reviews/article/${submissionId}`, configs);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    };

    fetchSubmission();
    fetchReviews();
  }, [submissionId]);
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!feedback) {
      setError('Feedback is required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const configs = {
        headers: {
          Authorization: token,
        },
      };
       console.log(submissionId,user._id, feedback, rating )
      await axios.post(
        `${config.BASE_URL}/api/reviews`,
        { article: submissionId, reviewer: user._id, content: feedback, rating },
        configs
      );
     
      setSuccess('Feedback submitted successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      setError('Failed to submit feedback.\n');
    }
  };

  return (
    <Container>
      {submission && (
        <Card className="mt-4">
          <Card.Header>Submission Details</Card.Header>
          <Card.Body>
            <Card.Title>{submission.title}</Card.Title>
            <Card.Text>{submission.abstract}</Card.Text>
            <Card.Text>
              <strong>Author:</strong> {submission.author.firstName} {submission.author.lastName}
            </Card.Text>
            <Card.Text>
              <strong>Status:</strong> {submission.status}
            </Card.Text>
            <Card.Text>
              <strong>Reviewers:</strong> {submission.reviewers.map(reviewer => reviewer.firstName).join(', ')}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
      <Card className="mt-4">
        <Card.Header>Reviews</Card.Header>
        <Card.Body>
          {reviews.map(review => (
            <div key={review._id}>
              <strong>{review.reviewer.firstName} {review.reviewer.lastName}:</strong> {review.content} (Rating: {review.rating})
            </div>
          ))}
        </Card.Body>
      </Card>
      {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
      {success && <Alert variant="success" className="mt-4">{success}</Alert>}
      <Form onSubmit={handleSubmitFeedback} className="mt-4">
        <Form.Group controlId="feedback">
          <Form.Label>Feedback</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="rating" className="mt-3">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-4">
          Submit Feedback
        </Button>
      </Form>
     
    </Container>
  );
};

export default SubmissionDetail;
