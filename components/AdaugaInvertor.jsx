import React, { useState, useEffect, useRef } from 'react';
import { saveInvertor, getAllMarcas, getSeriesByMarcaId, getAllUsers } from '../utils/service'; // Importăm getAllUsers
import '../src/AddInvertor.css';

const AdaugaInvertor = () => {
    const [selectedSerie, setSelectedSerie] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');
    const [selectedUser, setSelectedUser] = useState(''); // Nou câmp pentru utilizator
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [azimut, setAzimut] = useState('');
    const [serii, setSerii] = useState([]);
    const [marci, setMarci] = useState([]);
    const [users, setUsers] = useState([]); // Nou câmp pentru utilizatori
    const [visibility, setVisibility] = useState(''); // Nou câmp pentru vizibilitate
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const availablePesIds = [0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    useEffect(() => {
        const fetchData = async () => {
            const marciData = await getAllMarcas();
            setMarci(marciData);
            const usersData = await getAllUsers(); // Fetch utilizatori
            setUsers(usersData);
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

    const getRandomPesId = () => {
        return availablePesIds[Math.floor(Math.random() * availablePesIds.length)];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSerie || !selectedMarca || !latitude || !longitude || !azimut || !selectedUser || !visibility) {
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
                userId: selectedUser,
                visible: visibility === 'public',
                pesId: getRandomPesId()
            };
            const response = await saveInvertor(invertorData);
            console.log('Invertor adăugat:', response);
            alert('Invertor adăugat cu succes!');

            // Reset fields after successful submission
            setSelectedSerie('');
            setSelectedMarca('');
            setLatitude('');
            setLongitude('');
            setAzimut('');
            setSelectedUser('');
            setVisibility('');
            setSerii([]);
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
        } catch (error) {
            console.error('Eroare la adăugarea invertorului:', error);
            alert('A apărut o eroare la adăugarea invertorului. Te rog să încerci din nou mai târziu.');
        }
    };

    const handleMarcaChange = async (e) => {
        const marcaId = e.target.value;
        setSelectedMarca(marcaId);
        setSelectedSerie(''); // Resetează seria selectată
        if (marcaId) {
            const seriiData = await getSeriesByMarcaId(marcaId);
            setSerii(seriiData);
        } else {
            setSerii([]);
        }
    };

    return (
        <div className="adauga-invertor-container">
            <h2>Adăugare Invertor</h2>
            <form onSubmit={handleSubmit} className="adauga-invertor-form">
                <div className="form-group">
                    <label htmlFor="marca">Marca:</label>
                    <select id="marca" value={selectedMarca} onChange={handleMarcaChange}>
                        <option value="">Selectează Marca</option>
                        {marci.map((marca) => (
                            <option key={marca.id} value={marca.id}>{marca.nume}</option>
                        ))}
                    </select>
                </div>
                {selectedMarca && (
                    <div className="form-group">
                        <label htmlFor="serie">Serie:</label>
                        <select id="serie" value={selectedSerie} onChange={(e) => setSelectedSerie(e.target.value)}>
                            <option value="">Selectează Serie</option>
                            {serii.map((serie) => (
                                <option key={serie.id} value={serie.id}>{serie.nume}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="latitude">Latitudine:</label>
                    <input
                        type="text"
                        id="latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="longitude">Longitudine:</label>
                    <input
                        type="text"
                        id="longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="azimut">Azimut:</label>
                    <input
                        type="number"
                        id="azimut"
                        value={azimut}
                        onChange={(e) => setAzimut(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="user">Utilizator:</label>
                    <select id="user" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">Selectează Utilizator</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.nume} {user.prenume}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="visibility">Vizibilitate:</label>
                    <select id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                        <option value="">Selectează Vizibilitate</option>
                        <option value="public">Public</option>
                        <option value="private">Privat</option>
                    </select>
                </div>
                <div className="form-group">
                    <button type="button" onClick={handleResetMap} className="btn btn-secondary">Resetare Locație</button>
                    <button type="submit" className="btn btn-primary">Adaugă Invertor</button>
                </div>
            </form>
            <div id="map" style={{ height: '600px', width: '100%' }}></div>
        </div>
    );
};

export default AdaugaInvertor;