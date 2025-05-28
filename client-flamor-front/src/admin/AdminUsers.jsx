import React, { useEffect, useState } from "react";
import { fetchAllUsers, updateUser, deleteUser } from "../api/userAPI";
import GenericTable from "../components/GenericTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");

  const [editUser, setEditUser] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
    setShowEditModal(true);
  };

  const handleEditUserSave = async () => {
    if (!editUserName.trim() || !editUserEmail.trim()) {
      toast.error("Name and Email are required");
      return;
    }
    try {
      const updatedUser = await updateUser(editUser.id, {
        name: editUserName,
        email: editUserEmail,
        role: editUserRole,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setShowEditModal(false);
      toast.success("User updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
  ];

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1> Users</h1>
      {showEditModal && (
        <div className="modal">
          <h2>Edit User</h2>
          <input
            type="text"
            value={editUserName}
            onChange={(e) => setEditUserName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="email"
            value={editUserEmail}
            onChange={(e) => setEditUserEmail(e.target.value)}
            placeholder="Email"
          />
          <select
            value={editUserRole}
            onChange={(e) => setEditUserRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleEditUserSave}>Save</button>
          <button onClick={() => setShowEditModal(false)}>Cancel</button>
        </div>
      )}
      <GenericTable
        columns={columns}
        data={users}
        onEdit={openEditModal}
        onDelete={handleDeleteUser}
        editable
        deletable
      />

      <ToastContainer />
    </div>
  );
};

export default AdminUsers;