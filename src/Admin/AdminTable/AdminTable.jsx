import React, { useState } from 'react';
import './AdminTable.css';
import EditAdminForm from '../Edit/EditAdminForm';

function AdminTable({ admins, setAdmins }) {
  const [editingAdmin, setEditingAdmin] = useState(null); // Drži trenutno uređivanog admina

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/admins/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      setAdmins(admins.filter(admin => admin.id !== id));
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin); // Postavljamo admina koji se uređuje
  };

  const handleSave = (updatedAdmin) => {
    setAdmins(admins.map(admin => (admin.id === updatedAdmin.id ? updatedAdmin : admin)));
    setEditingAdmin(null); // Zatvaramo formu
  };

  const handleCancel = () => {
    setEditingAdmin(null); // Zatvaramo formu bez promjena
  };

  return (
    <>
    {editingAdmin ? (
        <EditAdminForm admin={editingAdmin} onSave={handleSave} onCancel={handleCancel} />
      ) : (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Akcije</th>
        </tr>
      </thead>
      <tbody>
        {admins.map(admin => (
          <tr key={admin.id}>
            <td>{admin.id}</td>
            <td>{admin.username}</td>
            <td>{admin.email}</td>
            <td>{admin.role}</td>
            <td>
              <button onClick={() => handleDelete(admin.id)}>Delete</button>
              <button onClick={() => handleEdit(admin)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    )}
     <button onClick={() => alert("Dodavanje novog korisnika još nije implementirano!")}>
     + Dodaj admina
   </button>
   </>
  );
}

export default AdminTable;
