import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../services/config';
import { Container, Card, ListGroup, Alert } from 'react-bootstrap';

const DetailedSubmission = ({submissionId}) => {
//   const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState('');

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
        setError('Failed to fetch submission details.');
      }
    };

    fetchSubmission();
  }, [submissionId]);

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!submission) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>{submission.title}</Card.Header>
        <Card.Body>
          <Card.Title>Abstract</Card.Title>
          <Card.Text>{submission.abstract}</Card.Text>
          {submission.content && (
            <>
              <Card.Title>Content</Card.Title>
              <Card.Text>{submission.content}</Card.Text>
            </>
          )}
          {submission.file && (
            <>
              <Card.Title>File</Card.Title>
              <Card.Text>
                <a href={`${config.BASE_URL}/uploads/${submission.file}`} target="_blank" rel="noopener noreferrer">
                  Download File
                </a>
              </Card.Text>
            </>
          )}
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Status:</strong> {submission.status}</ListGroup.Item>
            <ListGroup.Item><strong>Author:</strong> {submission.author.firstName} {submission.author.lastName} ({submission.author.email})</ListGroup.Item>
            <ListGroup.Item>
              <strong>Reviewers:</strong>
              <ul>
                {submission.reviewers.map((reviewer, index) => (
                  <li key={index}>{reviewer.firstName} {reviewer.lastName} ({reviewer.email})</li>
                ))}
              </ul>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Feedback:</strong>
              <ul>
                {submission.feedback.map((review, index) => (
                  <li key={index}>
                    <strong>Reviewer:</strong> {review.reviewer.firstName} {review.reviewer.lastName} ({review.reviewer.email})<br />
                    <strong>Comments:</strong> {review.content}
                  </li>
                ))}
              </ul>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DetailedSubmission;
