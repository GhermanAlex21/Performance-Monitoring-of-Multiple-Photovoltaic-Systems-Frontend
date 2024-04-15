import React, { useState } from 'react';
import { saveMarca } from '../utils/service'; // importăm funcția pentru salvarea unui producător

const AdaugaMarca = () => {
    const [nume, setNume] = useState('');

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
            // Poți adăuga aici redirecționarea către o altă pagină sau să faci altă acțiune după adăugare
        } catch (error) {
            console.error('Eroare la adăugarea producătorului:', error);
            alert('A apărut o eroare la adăugarea producătorului. Te rog să încerci din nou mai târziu.');
        }
    };

    return (
        <div>
            <h2>Adăugare Producător</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nume">Nume:</label>
                    <input
                        type="text"
                        id="nume"
                        value={nume}
                        onChange={(e) => setNume(e.target.value)}
                    />
                </div>
                <button type="submit">Adaugă Producător</button>
            </form>
        </div>
    );
};

export default AdaugaMarca;
