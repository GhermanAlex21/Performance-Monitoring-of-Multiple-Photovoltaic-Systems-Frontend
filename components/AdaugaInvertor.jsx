import React, { useState, useEffect } from 'react';
import { saveInvertor, getAllSeries, getAllMarcas } from '../utils/service';

const AdaugaInvertor = () => {
    const [selectedSerie, setSelectedSerie] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [azimut, setAzimut] = useState('');
    const [serii, setSerii] = useState([]);
    const [marci, setMarci] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const seriiData = await getAllSeries();
                const marciData = await getAllMarcas();
                setSerii(seriiData);
                setMarci(marciData);
            } catch (error) {
                console.error('Eroare la încărcarea datelor:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSerie || !selectedMarca || !latitude || !longitude || !azimut) {
            alert('Te rog să completezi toate câmpurile.');
            return;
        }
    
        try {
            const invertorData = {
                serieId: selectedSerie, // corectat de la serie
                marcaId: selectedMarca, // adăugat marcaId
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                azimut: parseFloat(azimut)
            };
            const response = await saveInvertor(invertorData);
            console.log('Invertor adăugat:', response);
            // Poți adăuga aici redirecționarea către o altă pagină sau să faci altă acțiune după adăugare
        } catch (error) {
            console.error('Eroare la adăugarea invertorului:', error);
            alert('A apărut o eroare la adăugarea invertorului. Te rog să încerci din nou mai târziu.');
        }
    };
    
    return (
        <div>
            <h2>Adăugare Invertor</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="serie">Serie:</label>
                    <select id="serie" value={selectedSerie} onChange={(e) => setSelectedSerie(e.target.value)}>
                        <option value="">Selectează Serie</option>
                        {serii && serii.map((serie) => (
                            <option key={serie.id} value={serie.id}>{serie.nume}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="marca">Marca:</label>
                    <select id="marca" value={selectedMarca} onChange={(e) => setSelectedMarca(e.target.value)}>
                        <option value="">Selectează Marca</option>
                        {marci && marci.map((marca) => (
                            <option key={marca.id} value={marca.id}>{marca.nume}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="latitude">Latitudine:</label>
                    <input
                        type="number"
                        id="latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="longitude">Longitudine:</label>
                    <input
                        type="number"
                        id="longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="azimut">Azimut:</label>
                    <input
                        type="number"
                        id="azimut"
                        value={azimut}
                        onChange={(e) => setAzimut(e.target.value)}
                    />
                </div>
                <button type="submit">Adaugă Invertor</button>
            </form>
        </div>
    );
};

export default AdaugaInvertor;
