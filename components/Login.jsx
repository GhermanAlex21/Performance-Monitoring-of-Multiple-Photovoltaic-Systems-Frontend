import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        } catch (e) {
            return null;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        try {
            const response = await axios.post('http://localhost:8000/login', { username, password });
            const decodedToken = parseJwt(response.data);
            localStorage.setItem('token', response.data);
            if (decodedToken) {
                localStorage.setItem('role', decodedToken.role); // Modifică aici
            }
            navigate('/');
        } catch (error) {
            if (error.response) {
                setError('Invalid username or password. Please try again.');
            } else if (error.request) {
                setError('The server did not respond. Please try again later.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Nu ai un cont? <Link to="/user-save">Creează unul aici.</Link></p>
        </div>
    );
};

export default Login;