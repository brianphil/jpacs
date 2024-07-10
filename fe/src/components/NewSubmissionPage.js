import React, { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../services/config";

const NewSubmissionPage = ({ fetchSubmissions, handleClose }) => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !abstract || !file) {
      setError("All fields are required.");
      return;
    }

    if (title && abstract && file) {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("abstract", abstract);
      formData.append("file", file);
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const configs = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token
          }
        };
        const response = await axios.post(
          `${config.BASE_URL}/api/articles/submit`,
          formData,
          configs
        );
        if (response.data) {
          setSuccess("Article submitted successfully!");
          setTimeout(() => {
            fetchSubmissions();
            setLoading(false);
            handleClose();
          }, 3000);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to create submission.");
      }
    }
  };

  return (
    <Container>
      <h2 className="mt-4">New Submission</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="abstract" className="mt-3">
          <Form.Label>Abstract</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="file" className="mt-3">
          <Form.Label>Upload File</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} required />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          Submit
        </Button>
      </Form>
      <div style={{ textAlign: "center" }}>
        {loading ? <Spinner animation="border" variant="primary" /> : ""}
      </div>
    </Container>
  );
};

export default NewSubmissionPage;
