import React, { useState, useEffect } from 'react';
import { saveSerie, getAllMarcas } from '../utils/service';
import '../src/AddSerie.css';

function AddSerie() {
    const [serieData, setSerieData] = useState({
        nume: '',
        marca: { id: '' }
    });
    const [marci, setMarci] = useState([]);

    useEffect(() => {
        const fetchMarci = async () => {
            const marciData = await getAllMarcas();
            setMarci(marciData);
        };
        fetchMarci();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        if (name === 'marcaId') {
            setSerieData(prevState => ({
                ...prevState,
                marca: { id: value }
            }));
        } else {
            setSerieData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await saveSerie(serieData);
            alert('Serie adăugată cu succes!');
            // Resetează formularul după adăugare
            setSerieData({ nume: '', marca: { id: '' } });
        } catch (error) {
            console.error('Eroare la adăugarea seriei:', error);
            alert('A apărut o eroare la adăugarea seriei.');
        }
    };

    return (
        <div className="add-serie-container">
            <h2>Adăugare Serie</h2>
            <form onSubmit={handleSubmit} className="add-serie-form">
                <div className="form-group">
                    <label>Marca:</label>
                    <select name="marcaId" value={serieData.marca.id} onChange={handleChange} required>
                        <option value="">Selectează Marca</option>
                        {marci.map(marca => (
                            <option key={marca.id} value={marca.id}>{marca.nume}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Nume:</label>
                    <input type="text" name="nume" value={serieData.nume} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Adăugare Serie</button>
            </form>
        </div>
    );
}

export default AddSerie;
