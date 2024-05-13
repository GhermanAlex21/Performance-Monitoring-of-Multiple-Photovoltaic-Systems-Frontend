import React, { useEffect, useState, useRef } from 'react';
import { getAllInvertors } from '../utils/service';
import { useNavigate } from 'react-router-dom';  // Asigură-te că ai importat useNavigate

function HomePage() {
  const [invertors, setInvertors] = useState([]);
  const mapRef = useRef(null);
  const navigate = useNavigate();  // Inițializează useNavigate pentru a folosi în funcția de navigare

  useEffect(() => {
    const fetchData = async () => {
      const invertorData = await getAllInvertors();
      setInvertors(invertorData);
      initMap(invertorData);
    };

    fetchData();
  }, []);

  const initMap = (invertorData) => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 47.6573, lng: 23.5681 },
    });

    mapRef.current = map;

    invertorData.forEach(invertor => {
      const marker = new window.google.maps.Marker({
        position: { lat: invertor.latitude, lng: invertor.longitude },
        map: map,
        title: `${invertor.marca.nume} ${invertor.serie.nume}`,
      });

      marker.addListener('click', () => {
        const contentString = `
          <div>
            <h2>${invertor.marca.nume} ${invertor.serie.nume}</h2>
            <p>Latitudine: ${invertor.latitude}</p>
            <p>Longitudine: ${invertor.longitude}</p>
            <p>Azimut: ${invertor.azimut}</p>
            <button onclick="window.viewStatistics(${invertor.pesId})">Vizualizează Statisticile</button>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: contentString
        });

        infoWindow.open(map, marker);
      });
    });
  };

  // Functie pentru navigare
  window.viewStatistics = pesId => {
    navigate(`/statistics/${pesId}`);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
}

export default HomePage;
