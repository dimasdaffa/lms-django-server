import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit2, UserPlus, RefreshCw, Info } from "lucide-react";

const UserForm = ({
  initialData,
  onSubmit,
  submitText,
  showPassword = false,
}) => {
  const [localFormData, setLocalFormData] = useState(initialData);

  useEffect(() => {
    setLocalFormData(initialData);
  }, [initialData]);

  const handleLocalInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(localFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full p-2 border rounded"
        name="username"
        value={localFormData.username}
        onChange={handleLocalInputChange}
        placeholder="Username"
        required
      />
      <input
        className="w-full p-2 border rounded"
        type="email"
        name="email"
        value={localFormData.email}
        onChange={handleLocalInputChange}
        placeholder="Email"
        required
      />
      {showPassword && (
        <input
          className="w-full p-2 border rounded"
          type="password"
          name="password"
          value={localFormData.password}
          onChange={handleLocalInputChange}
          placeholder="Password"
          required
        />
      )}
      <input
        className="w-full p-2 border rounded"
        name="first_name"
        value={localFormData.first_name}
        onChange={handleLocalInputChange}
        placeholder="First Name"
      />
      <input
        className="w-full p-2 border rounded"
        name="last_name"
        value={localFormData.last_name}
        onChange={handleLocalInputChange}
        placeholder="Last Name"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {submitText}
      </button>
    </form>
  );
};

const UserDetails = ({ user }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <p className="p-2 bg-gray-50 rounded">{user.username}</p>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="p-2 bg-gray-50 rounded">{user.email}</p>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <p className="p-2 bg-gray-50 rounded">{user.first_name || "-"}</p>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <p className="p-2 bg-gray-50 rounded">{user.last_name || "-"}</p>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">ID</label>
        <p className="p-2 bg-gray-50 rounded">{user.id}</p>
      </div>
    </div>
  </div>
);

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [message, setMessage] = useState(null);

  const emptyFormData = {
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  };

  const api = axios.create({
    baseURL: "http://0.0.0.0:8001",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users/");
      setUsers(response.data);
    } catch (error) {
      showMessage("Failed to fetch users", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddUser = async (formData) => {
    try {
      await api.post("/api/users/", formData);
      fetchUsers();
      setShowAddModal(false);
      showMessage("User added successfully");
    } catch (error) {
      showMessage(error.response?.data?.error || "Failed to add user", "error");
    }
  };

  const handleUpdateUser = async (formData) => {
    try {
      await api.put(`/api/users/${selectedUser.id}/`, formData);
      fetchUsers();
      setShowEditModal(false);
      showMessage("User updated successfully");
    } catch (error) {
      showMessage(
        error.response?.data?.error || "Failed to update user",
        "error"
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/users/${userId}/`);
        fetchUsers();
        showMessage("User deleted successfully");
      } catch (error) {
        showMessage(
          error.response?.data?.error || "Failed to delete user",
          "error"
        );
      }
    }
  };

  const handleDeleteAllCourses = async () => {
    if (window.confirm("Are you sure you want to delete all courses?")) {
      try {
        await api.delete("/api/courses/delete-all/");
        showMessage("All courses deleted successfully");
      } catch (error) {
        showMessage("Failed to delete courses", "error");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 flex justify-between items-center border-b">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </button>

            <button
              onClick={fetchUsers}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
      >
        <UserForm
          initialData={emptyFormData}
          onSubmit={handleAddUser}
          submitText="Add User"
          showPassword={true}
        />
      </Modal>

      <Modal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        title="Edit User"
      >
        <UserForm
          initialData={selectedUser || emptyFormData}
          onSubmit={handleUpdateUser}
          submitText="Update User"
        />
      </Modal>

      <Modal
        show={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedUser(null);
        }}
        title="User Details"
      >
        {selectedUser && <UserDetails user={selectedUser} />}
      </Modal>
    </div>
  );
};

export default UserManagement;
