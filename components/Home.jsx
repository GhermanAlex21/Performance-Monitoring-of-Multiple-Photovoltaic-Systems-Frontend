import React, { useEffect, useState, useRef } from 'react';
import { getAllInvertors } from '../utils/service';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [invertors, setInvertors] = useState([]);
  const [selectedInvertor1, setSelectedInvertor1] = useState(null);
  const [selectedInvertor1Details, setSelectedInvertor1Details] = useState(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const invertorData = await getAllInvertors();
      const visibleInvertors = invertorData.filter(invertor => invertor.visible); // Filtrăm doar invertoarele vizibile
      setInvertors(visibleInvertors);
      await initMap(visibleInvertors);
    };

    fetchData();
  }, []);

  const initMap = async (invertorData) => {
    // Load required libraries
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Initialize map with a valid Map ID
    const map = new Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 47.6573, lng: 23.5681 },
      mapId: '51f3d46cdbaab1df' // Replace with your actual Map ID
    });

    mapRef.current = map;

    invertorData.forEach((invertor, index) => {
      const markerContent = document.createElement('div');
      markerContent.innerHTML = `<div style="background-image: url('http://maps.google.com/mapfiles/ms/icons/red-dot.png'); width: 32px; height: 32px; background-size: cover;"></div>`;

      const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat: invertor.latitude, lng: invertor.longitude },
        title: `${invertor.marca.nume} ${invertor.serie.nume}`,
        content: markerContent
      });

      markersRef.current[index] = { marker, invertor };

      marker.addListener('click', () => {
        markersRef.current.forEach(({ marker }) => {
          marker.content.innerHTML = `<div style="background-image: url('http://maps.google.com/mapfiles/ms/icons/red-dot.png'); width: 32px; height: 32px; background-size: cover;"></div>`;
        });

        marker.content.innerHTML = `<div style="background-image: url('http://maps.google.com/mapfiles/ms/icons/green-dot.png'); width: 32px; height: 32px; background-size: cover;"></div>`;

        const contentString = `
          <div>
            <h2>${invertor.marca.nume} ${invertor.serie.nume}</h2>
            <p>Latitudine: ${invertor.latitude}</p>
            <p>Longitudine: ${invertor.longitude}</p>
            <p>Azimut: ${invertor.azimut}</p>
            <button onclick="window.viewStatistics(${invertor.pesId})">Vizualizează Statisticile</button>
            <button onclick="window.selectForComparison(${invertor.id}, '${invertor.marca.nume}', '${invertor.serie.nume}')">Compară</button>
          </div>
        `;

        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }

        const infoWindow = new google.maps.InfoWindow({
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
    });
  };

  window.viewStatistics = pesId => {
    navigate(`/statistics/${pesId}`);
  };

  window.selectForComparison = (invertorId, marca, serie) => {
    if (!selectedInvertor1) {
      setSelectedInvertor1(invertorId);
      setSelectedInvertor1Details({ marca, serie });
    } else if (invertorId !== selectedInvertor1) {
      navigate(`/compare/${selectedInvertor1}/${invertorId}/${selectedInvertor1Details.marca}/${selectedInvertor1Details.serie}/${marca}/${serie}`);
    }

    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
}

export default HomePage;
