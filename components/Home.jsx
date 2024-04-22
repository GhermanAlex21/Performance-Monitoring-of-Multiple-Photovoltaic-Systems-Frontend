import React, { useEffect, useState, useRef } from 'react';
import { getAllInvertors } from '../utils/service';

function HomePage() {
  const [invertors, setInvertors] = useState([]);
  const [selectedInvertor, setSelectedInvertor] = useState(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(new window.google.maps.InfoWindow());

  useEffect(() => {
    const fetchData = async () => {
      const invertorData = await getAllInvertors();
      setInvertors(invertorData);
      initMap(invertorData); // Inițializează harta
    };

    fetchData();
  }, []);

  const initMap = (invertorData) => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 47.6573, lng: 23.5681 },
    });
  
    mapRef.current = map; // Stochează referința hărții
  
    invertorData.forEach((invertor) => {
      const marker = new window.google.maps.Marker({
        position: { lat: invertor.latitude, lng: invertor.longitude },
        map: map,
        title: `${invertor.marca.nume} ${invertor.serie.nume}`,
      });
  
      marker.addListener('click', () => {
        setSelectedInvertor(invertor);
      });
    });
  
    // Ascultă pentru clicuri pe hartă pentru a închide InfoWindow
    map.addListener('click', () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        setSelectedInvertor(null); // Resetează invertorul selectat
      }
    });
  };

  useEffect(() => {
    if (selectedInvertor && mapRef.current) {
      const contentString = `
        <div>
          <h2>${selectedInvertor.marca.nume} ${selectedInvertor.serie.nume}</h2>
          <p>Latitudine: ${selectedInvertor.latitude}</p>
          <p>Longitudine: ${selectedInvertor.longitude}</p>
          <p>Azimut: ${selectedInvertor.azimut}</p>
        </div>
      `;

      infoWindowRef.current.setContent(contentString);
      infoWindowRef.current.setPosition({
        lat: selectedInvertor.latitude,
        lng: selectedInvertor.longitude,
      });

      infoWindowRef.current.open(mapRef.current); // Deschide fereastra informativă pe harta stocată
    }
  }, [selectedInvertor]);

  return (
    <div>
      <h1>Home Page</h1>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
}

export default HomePage;