import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { updateUser } from "../utils/service";  // Asigură-te că calea este corectă

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    password: '', // Parola este opțională pentru actualizare
    roles: '' // Afișăm rolurile pentru informare, dar nu permit modificarea
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found, redirecting to login");
      navigate('/login');
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const userId = decodedToken.userId; // Presupunând că ID-ul utilizatorului este stocat în token

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { username, roles } = response.data;
        setUserData({
          id: userId,
          username,
          roles,
          password: ''
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        alert('Eroare la încărcarea datelor profilului.');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const initialData = {
            username: userData.initialUsername,  // Presupunând că aceasta este setată la încărcarea componentei
            password: ''  // Parola nu este reținută din motive de securitate
        };

        const updatedData = {
            ...userData,
            password: userData.password ? userData.password : undefined  // Exclude parola dacă este goală
        };

        const response = await updateUser(userData.id, updatedData);
        console.log("Response status:", response.status);

        // Verifică dacă username-ul sau parola au fost modificate
        if (userData.username !== initialData.username || (userData.password && userData.password !== initialData.password)) {
            localStorage.removeItem('token');
            localStorage.removeItem('roles');
            navigate('/login');
            alert('Profil actualizat cu succes! Te rog să te autentifici din nou.');
        } else {
            alert('Profil actualizat cu succes!');
            navigate('/my-profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Eroare la actualizarea profilului: ' + error.message);
    }
};
  return (
    <div className="container">
      <h1>Actualizează Profilul</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={userData.username} onChange={handleChange} />
        </div>
        <div>
          <label>Parolă:</label>
          <input type="password" name="password" value={userData.password} onChange={handleChange} />
        </div>
        <div>
          <label>Rol:</label>
          <p>{userData.roles}</p>  
        </div>
        <button type="submit">Actualizează</button>
      </form>
    </div>
  );
};

export default ProfileUpdate;