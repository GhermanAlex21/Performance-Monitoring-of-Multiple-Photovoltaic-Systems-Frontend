// UpdateInvertor.jsx

import React, { useEffect, useState } from "react";
import { getInvertorById, updateInvertor } from "../utils/service";
import { useParams, Link, useNavigate } from "react-router-dom";

const UpdateInvertor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invertor, setInvertor] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [invertorUpdated, setInvertorUpdated] = useState(false);

  useEffect(() => {
    fetchInvertor();
  }, []);

  const fetchInvertor = async () => {
    try {
      const invertorData = await getInvertorById(id);
      setInvertor(invertorData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateInvertor(id, invertor);
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
            <label className="text-info">Latitudine:</label>
            <input
              type="number"
              className="form-control mb-4"
              value={invertor.latitude}
              onChange={(e) => setInvertor({ ...invertor, latitude: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="text-info">Longitudine:</label>
            <input
              type="number"
              className="form-control mb-4"
              value={invertor.longitude}
              onChange={(e) => setInvertor({ ...invertor, longitude: e.target.value })}
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
          <div className="btn-group">
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
    </div>
  );
};

export default UpdateInvertor;
