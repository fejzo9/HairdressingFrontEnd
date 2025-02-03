import React, { useState } from 'react';
import './AdminTable.css';
import EditAdminForm from '../Edit/EditAdminForm';
import AddAdminForm from '../Add/AddAdminForm';

function AdminTable({ admins, setAdmins }) {
  const [editingAdmin, setEditingAdmin] = useState(null); // Drži trenutno uređivanog admina
  const [addingAdmin, setAddingAdmin] = useState(false); // Da li dodajemo novog admina

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
    setAddingAdmin(false); // Ako je otvorena forma za dodavanje, zatvori je
  };

  const handleSave = (updatedAdmin) => {
    setAdmins(admins.map(admin => (admin.id === updatedAdmin.id ? updatedAdmin : admin)));
    setEditingAdmin(null); // Zatvaramo formu
  };

  const handleCancelEdit = () => {
    setEditingAdmin(null); // Zatvaramo formu bez promjena
  };

  const handleAddNew = () => {
    setAddingAdmin(true);
    setEditingAdmin(null); // Ako je otvorena forma za edit, zatvori je
  };

  const handleSaveNewAdmin = (newAdmin) => {
    setAdmins([...admins, newAdmin]); // Dodaj novog admina u listu
    setAddingAdmin(false);
  };

  const handleCancelAdd = () => {
    setAddingAdmin(false);
  };


  return (
    <>
    {editingAdmin ? (
        <EditAdminForm admin={editingAdmin} onSave={handleSave} onCancel={handleCancelEdit} />
      ) : addingAdmin ? (
        <AddAdminForm onSave={handleSaveNewAdmin} onCancel={handleCancelAdd} />
      ) : (
        <>
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
     <button onClick={handleAddNew}>+ Dodaj admina</button>
   </>
    )}
  </>
  );
}

export default AdminTable;
