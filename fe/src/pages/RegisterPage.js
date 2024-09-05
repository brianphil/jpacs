import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { config } from "../services/config";
import "./style.css";
import logo from "../assets/jpacs-logo.png";
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "author",
    firstName: "",
    lastName: "",
    email: "",
    affiliation: "",
    bio: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.BASE_URL}/api/auth/register`, formData);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="mt-5 register">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="p-4 m-3">
            <Card.Title style={{ textAlign: "center" }}>
              <h1>Register</h1>
              <div className="p-1" style={{ height: "8rem", width: "8rem", margin: "0px auto" }}>
                <img src={logo} style={{ height: "8rem", width: "8rem" }} alt="" />
              </div>
            </Card.Title>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="m-2">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    className="form-placeholder"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="password" className="m-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="form-placeholder"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="role" className="m-2">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                    <option value="reviewer">Reviewer</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="firstName" className="m-2">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    className="form-placeholder"
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="lastName" className="m-2">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    className="form-placeholder"
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="email" className="m-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    className="form-placeholder"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="affiliation" className="m-2">
                  <Form.Label>Affiliation</Form.Label>
                  <Form.Control
                    className="form-placeholder"
                    type="text"
                    name="affiliation"
                    placeholder="Enter affiliation"
                    value={formData.affiliation}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="bio" className="m-2">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    className="form-placeholder"
                    as="textarea"
                    name="bio"
                    placeholder="Enter bio"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div style={{ textAlign: "center", margin: "1.2rem" }}>
                  <Button variant="primary" type="submit">
                    Register
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: "center" }}>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
