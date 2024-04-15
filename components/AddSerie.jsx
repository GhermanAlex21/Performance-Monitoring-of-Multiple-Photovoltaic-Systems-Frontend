import React, { useState } from 'react';
import { saveSerie } from '../utils/service';

function AddSerie() {
    const [serieData, setSerieData] = useState({
        nume: ''
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setSerieData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await saveSerie(serieData);
            alert('Serie adăugată cu succes!');
            // Aici poți adăuga alte acțiuni după adăugarea seriei
        } catch (error) {
            console.error('Eroare la adăugarea seriei:', error);
            alert('A apărut o eroare la adăugarea seriei.');
        }
    };

    return (
        <div>
            <h2>Adăugare Serie</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nume:</label>
                    <input type="text" name="nume" value={serieData.nume} onChange={handleChange} required />
                </div>
                <button type="submit">Adăugare Serie</button>
            </form>
        </div>
    );
}

export default AddSerie;
