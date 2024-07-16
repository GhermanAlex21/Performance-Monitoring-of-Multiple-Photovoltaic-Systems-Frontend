import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../utils/service";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import '../src/GetAllUsers.css';


const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserDeleted, setIsUserDeleted] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role'); 
    setIsAdmin(role === 'ADMIN');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      setIsUserDeleted(true);
      setDeleteSuccess("User deleted successfully.");
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      setDeleteSuccess("");
    }, 4000);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="users-container">
      <div className="users-header">
        <h4>All Users</h4>
        {isAdmin && (
          <Link to={"/user-save"}>
            <button className="btn btn-sm btn-outline-success">
              <FaPlus /> Add User
            </button>
          </Link>
        )}
      </div>
      <hr />
      {isUserDeleted && (
        <div className="alert alert-success">{deleteSuccess}</div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Telefon</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.nume}</td>
              <td>{user.prenume}</td>
              <td>{user.telefon}</td>
              <td>{user.roles}</td>
              <td>
                {isAdmin && (
                  <div className="btn-group">
                    <Link to={`/user/update/${user.id}`}>
                      <button className="btn btn-sm btn-outline-warning">
                        <FaEdit /> Update User
                      </button>
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <FaTrash /> Delete User
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default GetAllUsers;