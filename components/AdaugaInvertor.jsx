import React, { useState, useEffect, useRef } from 'react';
import { saveInvertor, getAllSeries, getAllMarcas } from '../utils/service';

const AdaugaInvertor = () => {
    const [selectedSerie, setSelectedSerie] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [azimut, setAzimut] = useState('');
    const [pesId, setPesId] = useState('');
    const [serii, setSerii] = useState([]);
    const [marci, setMarci] = useState([]);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const seriiData = await getAllSeries();
            const marciData = await getAllMarcas();
            setSerii(seriiData);
            setMarci(marciData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const initMap = () => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 13,
                center: { lat: 47.6573, lng: 23.5681 },
            });
            mapRef.current = map;

            map.addListener('click', (e) => {
                setLatitude(e.latLng.lat().toFixed(6));
                setLongitude(e.latLng.lng().toFixed(6));
                placeMarkerAndPanTo(e.latLng, map);
            });
        };

        initMap();
    }, []);

    const placeMarkerAndPanTo = (latLng, map) => {
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }
        const marker = new window.google.maps.Marker({
            position: latLng,
            map: map,
        });
        markerRef.current = marker;
        map.panTo(latLng);
    };

    const handleResetMap = () => {
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }
        setLatitude('');
        setLongitude('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSerie || !selectedMarca || !latitude || !longitude || !azimut || !pesId) {
            alert('Te rog să completezi toate câmpurile.');
            return;
        }

        try {
            const invertorData = {
                serieId: selectedSerie,
                marcaId: selectedMarca,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                azimut: parseFloat(azimut),
                pesId: parseInt(pesId)
            };
            const response = await saveInvertor(invertorData);
            console.log('Invertor adăugat:', response);
            alert('Invertor adăugat cu succes!');
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
                        {serii.map((serie) => (
                            <option key={serie.id} value={serie.id}>{serie.nume}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="marca">Marca:</label>
                    <select id="marca" value={selectedMarca} onChange={(e) => setSelectedMarca(e.target.value)}>
                        <option value="">Selectează Marca</option>
                        {marci.map((marca) => (
                            <option key={marca.id} value={marca.id}>{marca.nume}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="latitude">Latitudine:</label>
                    <input
                        type="text"
                        id="latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        readOnly
                    />
                </div>
                <div>
                    <label htmlFor="longitude">Longitudine:</label>
                    <input
                        type="text"
                        id="longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        readOnly
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
                <div>
                    <label htmlFor="pesId">Pes ID:</label>
                    <input
                        type="number"
                        id="pesId"
                        value={pesId}
                        onChange={(e) => setPesId(e.target.value)}
                        required
                    />
                </div>
                <button type="button" onClick={handleResetMap}>Resetare Locație</button>
                <button type="submit">Adaugă Invertor</button>
            </form>
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
        </div>
    );
};

export default AdaugaInvertor;