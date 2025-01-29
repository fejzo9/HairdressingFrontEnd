import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import UserTable from './UserTable';
import AdminTable from './AdminTable';
import {fetchUsers} from './fetchUsers.jsx';

function AdminPage({ role }) {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch korisnika
  useEffect(() => {

    const getUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };

    getUsers();

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch za sve korisnike
        const usersResponse = await fetch('/users'); // API endpoint za korisnike
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch za admine (samo ako je SUPER_ADMIN)
        if (role === 'ADMIN') {
          const adminsResponse = await fetch('http://localhost:8080/admins'); // API endpoint za admine
          const adminsData = await adminsResponse.json();
          setAdmins(adminsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      
      <h2>Users</h2>
      <UserTable users={users} setUsers={setUsers} />

      {role === 'ADMIN' && (
        <>
          <h2>Admins</h2>
          <AdminTable admins={admins} setAdmins={setAdmins} />
        </>
      )}
    </div>
  );
}

export default AdminPage;
