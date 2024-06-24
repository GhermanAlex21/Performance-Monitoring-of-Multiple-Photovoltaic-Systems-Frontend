import React, { useEffect, useState, useRef } from "react";
import { getInvertorById, updateInvertor } from "../utils/service";
import { useParams, Link, useNavigate } from "react-router-dom";

const UpdateInvertor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invertor, setInvertor] = useState({});
  const [initialLatitude, setInitialLatitude] = useState(null);
  const [initialLongitude, setInitialLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [invertorUpdated, setInvertorUpdated] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    fetchInvertor();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      initMap();
    }
  }, [isLoading]);

  const fetchInvertor = async () => {
    try {
      const invertorData = await getInvertorById(id);
      setInvertor(invertorData);
      setInitialLatitude(invertorData.latitude);
      setInitialLongitude(invertorData.longitude);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: invertor.latitude || 47.6573, lng: invertor.longitude || 23.5681 },
    });
    mapRef.current = map;

    const initialPosition = { lat: invertor.latitude, lng: invertor.longitude };
    placeMarkerAndPanTo(initialPosition, map);

    map.addListener('click', (e) => {
      setInvertor({ ...invertor, latitude: e.latLng.lat().toFixed(6), longitude: e.latLng.lng().toFixed(6) });
      placeMarkerAndPanTo(e.latLng, map);
    });
  };

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
    const initialPosition = { lat: initialLatitude, lng: initialLongitude };
    setInvertor({ ...invertor, latitude: initialLatitude, longitude: initialLongitude });
    placeMarkerAndPanTo(initialPosition, mapRef.current);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const invertorData = {
        latitude: parseFloat(invertor.latitude),
        longitude: parseFloat(invertor.longitude),
        azimut: parseFloat(invertor.azimut),
        pesId: invertor.pesId,
        visible: invertor.visible,
        userId: invertor.user.id
      };
      await updateInvertor(id, invertorData);
      setInvertorUpdated(true);
      setTimeout(() => {
        navigate("/invertor/all");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h4 className="mt-5" style={{ color: "GrayText" }}>
        Update Invertor
      </h4>
      <div className="col-8">
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="text-info">Marca:</label>
            <span>{invertor.marca ? invertor.marca.nume : 'Nume necunoscut'}</span>
          </div>
          <div className="form-group">
            <label className="text-info">Serie:</label>
            <span>{invertor.serie ? invertor.serie.nume : 'Serie necunoscută'}</span>
          </div>
          <div className="form-group">
            <label className="text-info">Proprietar:</label>
            <span>{invertor.user ? `${invertor.user.nume} ${invertor.user.prenume}` : 'Proprietar necunoscut'}</span>
          </div>
          <div className="form-group">
            <label className="text-info">Latitudine:</label>
            <input
              type="text"
              className="form-control mb-4"
              value={invertor.latitude}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="text-info">Longitudine:</label>
            <input
              type="text"
              className="form-control mb-4"
              value={invertor.longitude}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="text-info">Azimut:</label>
            <input
              type="number"
              className="form-control mb-4"
              value={invertor.azimut}
              onChange={(e) => setInvertor({ ...invertor, azimut: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="text-info">Vizibilitate:</label>
            <select
              className="form-control mb-4"
              value={invertor.visible}
              onChange={(e) => setInvertor({ ...invertor, visible: e.target.value })}
            >
              <option value="true">Public</option>
              <option value="false">Privat</option>
            </select>
          </div>
          <div className="btn-group">
            <button type="button" onClick={handleResetMap} className="btn btn-secondary">Resetare Locație</button>
            <button type="submit" className="btn btn-sm btn-outline-warning">
              Update Invertor
            </button>
            <Link to={"/invertor/all"} className="btn btn-outline-primary ml-2">
              Back to All Invertors
            </Link>
          </div>
        </form>
        {invertorUpdated && (
          <div className="alert alert-success mt-3">
            Invertor updated successfully.
          </div>
        )}
      </div>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default UpdateInvertor;
