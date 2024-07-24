// components/Editor/ApprovalDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { config } from '../../services/config';

const ApprovalDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const configs = {
          headers: {
            Authorization: token,
          },
        };
        const { data } = await axios.get(`${config.BASE_URL}/api/auth/pending`, configs);
        setUsers(data);
      } catch (error) {
        setError('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const configs = {
        headers: {
          Authorization: token,
        },
      };
      await axios.post(`${config.BASE_URL}/api/auth/approve/${userId}`, {}, configs);
      setUsers(users.filter(user => user._id !== userId));
      setSuccess('User approved successfully.');
    } catch (error) {
      setError('Failed to approve user.');
    }
  };

  return (
    <Container className="mt-5">
      <h3>Pending User Approvals</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button onClick={() => handleApprove(user._id)}>Approve</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ApprovalDashboard;
