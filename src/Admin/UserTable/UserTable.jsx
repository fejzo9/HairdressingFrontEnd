import React, { useState } from 'react';
import './UserTable.css';
import EditUserForm from "../Edit/EditUserForm";
import AddUserForm from "../Add/AddUserForm";

function UserTable({ users, setUsers }) {
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);

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

  const handleSaveEdit = (updatedUser) => {
    setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
    setEditingUser(null);
  };

  const handleSaveNewUser = (newUser) => {
    setUsers([...users, newUser]);
    setAddingUser(false);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setAddingUser(false);
  };

  return (
  <>
   {editingUser ? (
        <EditUserForm user={editingUser} onSave={handleSaveEdit} onCancel={handleCancel} />
      ) : addingUser ? (
        <AddUserForm onSave={handleSaveNewUser} onCancel={handleCancel} />
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
          <th>Broj Telefona</th>
          <th>Username</th>
          <th>Uloga</th>
          <th>Akcije</th>
        </tr>
      </thead>
      <tbody>
        {users && users.length > 0 ? (
          users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.birthDate}</td>
            <td>{user.gender}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber}</td>
            <td>{user.username}</td>
            <td>{user.role}</td>
            <td>
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9">Nema korisnika</td>
        </tr>
      )}
      </tbody>
    </table>
    <button className='dodaj-korisnika' onClick={() => setAddingUser(true)}> + Dodaj korisnika </button>
    </div>  
      )}
    </>
  );
}

export default UserTable;
