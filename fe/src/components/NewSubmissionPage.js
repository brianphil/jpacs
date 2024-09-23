import React, { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { config } from "../services/config";
import { UploadButton } from "@bytescale/upload-widget-react";
const NewSubmissionPage = ({
  fetchSubmissions,
  handleClose,
  data = [],
  mode = "create",
}) => {
  const [title, setTitle] = useState(mode === "create" ? "" : data.title);
  const [abstract, setAbstract] = useState(
    mode === "create" ? "" : data.abstract
  );
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [_id, setId] = useState(data._id || null);
  const options = {
    apiKey: "public_W142iniAEKdEky2mpBrb7e6vqAuz", // This is your API key.
    maxFileCount: 1,
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !abstract) {
      setError("All fields are required.");
      return;
    }

    if (title && abstract) {
      const payload = {
        _id,
        title,
        abstract,
      };
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const configs = {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        };
        const response = await axios.put(
          `${config.BASE_URL}/api/articles/update`,
          { ...payload },
          configs
        );
        if (response.data.success) {
          setSuccess(response.data.message);
          setTimeout(() => {
            fetchSubmissions();
            setLoading(false);
            handleClose();
          }, 3000);
        } else {
          console.log(response);
          setError(response?.data.message || "Failed to update submission!");
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
        setError("Failed to update submission.");
      }
    }
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
            Authorization: token,
          },
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
      <h2 className="mt-4">
        {mode === "create" ? "New Submission" : "Edit Submission"}
      </h2>
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
        {mode === "create" && (
          <Form.Group controlId="file" className="mt-3">
            <Form.Label>Upload File</Form.Label>
            <UploadButton
              options={options}
              onComplete={(files) =>
                setFile(files.map((x) => x.fileUrl).join("\n"))
              }
            >
              {({ onClick }) => (
                <Button className="m-4" onClick={onClick}>Upload a file...</Button>
              )}
            </UploadButton>
          </Form.Group>
        )}
        <Button
          variant="primary"
          type="submit"
          className="mt-4"
          onClick={(e) =>
            mode === "create" ? handleSubmit(e) : handleUpdate(e)
          }
        >
          {mode === "create" ? "Submit" : "Update"}
        </Button>
      </Form>
      <div style={{ textAlign: "center" }}>
        {loading ? <Spinner animation="border" variant="primary" /> : ""}
      </div>
    </Container>
  );
};

export default NewSubmissionPage;
