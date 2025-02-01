import React from 'react';
import './AdminTable.css';

function AdminTable({ admins, setAdmins }) {
  const handleDelete = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
    // Pozovi API za brisanje
    fetch(`http://localhost:8080/admins/${id}`, { method: 'DELETE' });
  };

  return (
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
              <button>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

     <button onClick={() => alert("Dodavanje novog korisnika još nije implementirano!")}>
     + Dodaj admina
   </button>
   </>
  );
}

export default AdminTable;
