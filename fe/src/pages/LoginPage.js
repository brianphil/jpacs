import React, { useState } from "react";
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import "./style.css";
import logo from "../assets/jpacs-logo.png";
const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const auth = await login({ username, password });
      if (auth.user) {
        navigate("/dashboard");
      } else {
        setError(error.response?.data?.message || "Login failed");
      }
    } catch (error) {
      console.log("***", error);
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Container className="mt-5 d-flex justify-content-center align-items-center">
            <div
              className="p-4 shadow rounded bg-light"
              style={{ minWidth: "300px", maxWidth: "400px" }}
            >
              <h2 className="text-center mb-4">Login</h2>
              <div className="p-1" style={{ height: "8rem", width: "8rem", margin: "0px auto" }}>
                <img src={logo} style={{ height: "8rem", width: "8rem" }} alt="" />
              </div>
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    className="form-placeholder"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="form-placeholder"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Login
                </Button>
                {error && <p className="text-danger mt-3">{error}</p>}
              </Form>
            </div>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: "center" }}>
          <p>
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
