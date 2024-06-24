import React, { useState } from 'react';
import { saveMarca } from '../utils/service'; // importăm funcția pentru salvarea unui producător
import '../src/AddMarca.css';

const AdaugaMarca = () => {
    const [nume, setNume] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nume) {
            alert('Te rog să introduci un nume pentru producător.');
            return;
        }

        try {
            // Salvăm producătorul folosind funcția saveMarca din api.js
            const response = await saveMarca({ nume });
            console.log('Producător adăugat:', response);
            setSuccessMessage('Producător adăugat cu succes!');
            // Resetează formularul după adăugare
            setNume('');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000); // Mesajul dispare după 3 secunde
        } catch (error) {
            console.error('Eroare la adăugarea producătorului:', error);
            alert('A apărut o eroare la adăugarea producătorului. Te rog să încerci din nou mai târziu.');
        }
    };

    return (
        <div className="add-marca-container">
            <h2>Adăugare Producător</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="add-marca-form">
                <div className="form-group">
                    <label htmlFor="nume">Nume:</label>
                    <input
                        type="text"
                        id="nume"
                        value={nume}
                        onChange={(e) => setNume(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Adaugă Producător</button>
            </form>
        </div>
    );
};

export default AdaugaMarca;
