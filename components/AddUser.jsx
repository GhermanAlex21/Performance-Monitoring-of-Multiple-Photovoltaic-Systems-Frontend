import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUser } from '../utils/service'; // Verifică să fie calea corectă pentru import

const AddUser = () => {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        nume: '',
        prenume: '',
        telefon: ''
    });
    const [error, setError] = useState(""); // Stare pentru erorile de la server
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { success, data, status } = await saveUser(userData);
        console.log("Server response:", data, "Status code:", status);
    
        if (success) {
          alert('Utilizatorul a fost adăugat cu succes!');
          navigate('/login');
        } else if (status === 400 && data.message === "Username already exists") {
          setError("Username-ul ales este deja folosit. Te rugăm să alegi un altul.");
        } else {
          throw new Error(data.message || "Failed to create user");
        }
      } catch (error) {
        console.error('Error adding user:', error.message);
        setError(error.message || 'A apărut o eroare la adăugarea utilizatorului.');
      }
    };
    return (
        <div>
            <h2>Adăugare Utilizator</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nume:</label>
                    <input
                        type="text"
                        name="nume"
                        value={userData.nume}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Prenume:</label>
                    <input
                        type="text"
                        name="prenume"
                        value={userData.prenume}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Telefon:</label>
                    <input
                        type="text"
                        name="telefon"
                        value={userData.telefon}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Creează Cont</button>
            </form>
        </div>
    );
};

export default AddUser;