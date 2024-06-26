import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const auth = await login({ username, password });
      if(auth.user){
        navigate('/dashboard')
      }
      else{
        setError(error.response?.data?.message || 'Login failed');
      }
    } catch (error) {
      console.log("***",error)
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center align-items-center">
      <div className="p-4 shadow rounded bg-light" style={{ minWidth: '300px', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
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
  );
};

export default LoginPage;
