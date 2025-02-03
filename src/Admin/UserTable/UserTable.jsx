import React, { useState } from 'react';
import './UserTable.css';
import EditUserForm from "../Edit/EditUserForm";

function UserTable({ users, setUsers }) {
  const [editingUser, setEditingUser] = useState(null);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = (updatedUser) => {
    setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
    setEditingUser(null);
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  return (
  <>
   {editingUser ? (
        <EditUserForm user={editingUser} onSave={handleSave} onCancel={handleCancel} />
      ) : (
   <div className="table-container">
    <table className="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Ime</th>
          <th>Prezime</th>
          <th>Datum rođenja</th>
          <th>Spol</th>
          <th>Email</th>
          <th>Username</th>
          <th>Uloga</th>
          <th>Akcije</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.birthDate}</td>
            <td>{user.gender}</td>
            <td>{user.email}</td>
            <td>{user.username}</td>
            <td>{user.role}</td>
            <td>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
              <button onClick={() => handleEdit(user)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button className='dodaj-korisnika' onClick={() => alert("Dodavanje novog korisnika još nije implementirano!")}> + Dodaj korisnika </button>
    </div>  
      )}
    </>
  );
}

export default UserTable;
