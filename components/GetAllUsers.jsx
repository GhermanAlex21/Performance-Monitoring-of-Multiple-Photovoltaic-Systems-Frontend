import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../utils/service";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserDeleted, setIsUserDeleted] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const role = localStorage.getItem('role'); // Assuming role is stored as 'ADMIN' or 'USER'
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
    <section className="container">
      <div className="row mt-5">
        <div className="col-md-6 mb-2 md-mb-0" style={{ color: "GrayText" }}>
          <h4>All Users</h4>
        </div>
        {isAdmin && (
          <div className="col-md-6 d-flex justify-content-end">
            <Link to={"/user-save"}>
              <button className="btn btn-sm btn-outline-success mr-2">
                <FaPlus /> Add User
              </button>
            </Link>
          </div>
        )}
      </div>
      <hr />
      {isUserDeleted && (
        <div className="alert alert-success">{deleteSuccess}</div>
      )}
      {users.map((user, index) => (
        <div key={user.id} className="mb-3">
          <pre>
            <h4 style={{ color: "GrayText" }}>
              {`${index + 1}. Username: ${user.username}, Nume: ${user.nume}, Prenume: ${user.prenume}, Telefon: ${user.telefon}, Role: ${user.roles}`}
            </h4>
          </pre>
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
        </div>
      ))}
    </section>
  );
};

export default GetAllUsers;