import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import UserTable from './UserTable';
import AdminTable from './AdminTable';
import { fetchUsers } from "./fetchUsers";
import { fetchAdmins } from "./fetchAdmins";

function AdminPage({ role }) {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch korisnika
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);

        const adminsData = await fetchAdmins();
        setAdmins(adminsData);
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

      <h2>Admins</h2>
      <AdminTable admins={admins} setAdmins={setAdmins} />
        
    </div>
  );
}

export default AdminPage;
