import React, { useEffect, useState, useRef } from 'react';
import { getAllInvertors, getUserInverters } from '../utils/service';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [inverters, setInverters] = useState([]);
    const mapRef = useRef(null);
    const infoWindowRef = useRef(null);
    const markersRef = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');

            if (!userId) {
                console.error('User ID is not set');
                return;
            }

            let allInverters = [];
            if (role === 'ADMIN') {
                allInverters = await getAllInvertors(); // Admin sees all inverters
            } else {
                const publicInverters = await getAllInvertors(); // Fetch all public inverters
                const userInverters = await getUserInverters(userId); // Fetch user's private inverters

                // Combine public inverters and user's private inverters, avoiding duplicates
                allInverters = [
                    ...publicInverters.filter(inverter => inverter.visible),
                    ...userInverters
                ];
            }

            setInverters(allInverters);
            await initMap(allInverters, userId);
        };

        fetchData();
    }, []);

    const initMap = async (inverterData, userId) => {
        if (!window.google) {
            console.error('Google Maps API not loaded');
            return;
        }

        const { Map } = await window.google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

        const map = new Map(document.getElementById('map'), {
            zoom: 13,
            center: { lat: 47.6573, lng: 23.5681 },
            mapId: '2fa6cf127c91e2b6' 
        });

        mapRef.current = map;

        const legend = document.createElement('div');
        legend.innerHTML = `
            <div style="background-color: white; padding: 10px; margin: 10px; border: 1px solid #ccc;">
                <h3>Legend</h3>
                <p><img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" /> Your Inverters</p>
                <p><img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" /> Other Inverters</p>
            </div>
        `;
        map.controls[window.google.maps.ControlPosition.RIGHT_TOP].push(legend);

        inverterData.forEach((inverter, index) => {
            const isUserInverter = inverter.user && inverter.user.id === parseInt(userId);
            const markerContent = document.createElement('div');
            markerContent.innerHTML = `<div style="background-image: url('${isUserInverter ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}'); width: 32px; height: 32px; background-size: cover;"></div>`;

            const marker = new AdvancedMarkerElement({
                map: map,
                position: { lat: inverter.latitude, lng: inverter.longitude },
                title: `${inverter.marca.nume} ${inverter.serie.nume}`,
                content: markerContent
            });

            markersRef.current[index] = { marker, inverter };

            marker.addListener('click', () => {
                markersRef.current.forEach(({ marker, inverter }) => {
                    const isUserInverter = inverter.user && inverter.user.id === parseInt(userId);
                    marker.content.innerHTML = `<div style="background-image: url('${isUserInverter ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}'); width: 32px; height: 32px; background-size: cover;"></div>`;
                });

                marker.content.innerHTML = `<div style="background-image: url('http://maps.google.com/mapfiles/ms/icons/green-dot.png'); width: 32px; height: 32px; background-size: cover;"></div>`;

                const contentString = `
                    <div>
                        <h2>${inverter.marca.nume} ${inverter.serie.nume}</h2>
                        <p>Latitudine: ${inverter.latitude}</p>
                        <p>Longitudine: ${inverter.longitude}</p>
                        <p>Azimut: ${inverter.azimut}</p>
                        <p>Proprietar: ${inverter.user.nume} ${inverter.user.prenume}</p>
                        <button onclick="window.viewStatistics(${inverter.pesId})">Vizualizează Statisticile</button>
                        <button onclick="window.selectForComparison(${inverter.id}, '${inverter.marca.nume}', '${inverter.serie.nume}')">Compară</button>
                    </div>
                `;

                if (infoWindowRef.current) {
                    infoWindowRef.current.close();
                }

                const infoWindow = new window.google.maps.InfoWindow({
                    content: contentString
                });

                infoWindowRef.current = infoWindow;
                infoWindow.open(map, marker);
            });
        });

        map.addListener('click', () => {
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
            // Reset markers to their original colors
            markersRef.current.forEach(({ marker, inverter }) => {
                const isUserInverter = inverter.user && inverter.user.id === parseInt(userId);
                marker.content.innerHTML = `<div style="background-image: url('${isUserInverter ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}'); width: 32px; height: 32px; background-size: cover;"></div>`;
            });
        });
    };

    window.viewStatistics = pesId => {
        navigate(`/statistics/${pesId}`);
    };

    window.selectForComparison = (inverterId, marca, serie) => {
        const selectedInverter1 = localStorage.getItem('selectedInverter1');
        if (!selectedInverter1) {
            localStorage.setItem('selectedInverter1', inverterId);
            localStorage.setItem('selectedInverter1Details', JSON.stringify({ marca, serie }));
        } else if (inverterId !== selectedInverter1) {
            const selectedInverter1Details = JSON.parse(localStorage.getItem('selectedInverter1Details'));
            navigate(`/compare/${selectedInverter1}/${inverterId}/${selectedInverter1Details.marca}/${selectedInverter1Details.serie}/${marca}/${serie}`);
            localStorage.removeItem('selectedInverter1');
            localStorage.removeItem('selectedInverter1Details');
        }

        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }

        // Keep the marker green when compare button is clicked
        markersRef.current.forEach(({ marker, inverter }) => {
            if (inverter.id === parseInt(inverterId)) {
                marker.content.innerHTML = `<div style="background-image: url('http://maps.google.com/mapfiles/ms/icons/green-dot.png'); width: 32px; height: 32px; background-size: cover;"></div>`;
            }
        });
    };

    return (
        <div>
            <h1>Home Page</h1>
            <div id="map" style={{ height: '500px', width: '100%' }}></div>
        </div>
    );
}

export default Home;