import React, { useEffect, useState } from "react";
import { getUserById, updateUser } from "../utils/service";
import { useParams, Link, useNavigate } from "react-router-dom";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", roles: "USER" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(id);
        if (userData) {
          setUser({
            username: userData.username,
            roles: userData.roles || "USER"
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, user);
      navigate("/users/all");
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="container">
      <h4>Update User</h4>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Username:</label>
          <p>{user.username}</p>
        </div>
        <div>
          <label>Role:</label>
          <select value={user.roles} onChange={(e) => setUser({ ...user, roles: e.target.value })}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button type="submit">Update User</button>
      </form>
    </div>
  );
};

export default UpdateUser;
