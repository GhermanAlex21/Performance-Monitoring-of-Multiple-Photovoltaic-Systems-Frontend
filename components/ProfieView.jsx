import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserById } from "../utils/service";// Asum că calea este corectă

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch (e) {
        return null;
    }
}

const ProfileView = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);

        if (!decodedToken) {
            setError("Autentificare necesară sau token invalid.");
            setIsLoading(false);
            return;
        }

        if (!decodedToken.userId) {
            setError("ID-ul utilizatorului nu este disponibil în token.");
            setIsLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const userData = await getUserById(decodedToken.userId);
                setUser(userData);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                setError("Nu s-au putut încărca datele profilului.");
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Profilul Meu</h1>
            <p>Nume: {user?.nume}</p>
            <p>Prenume: {user?.prenume}</p>
            <p>Username: {user?.username}</p>
            <p>Telefon: {user?.telefon}</p>
            <Link to="/update-profile">Actualizează Profilul</Link>
        </div>
    );
};

export default ProfileView;