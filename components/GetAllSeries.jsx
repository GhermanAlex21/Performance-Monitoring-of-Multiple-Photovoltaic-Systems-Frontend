import React, { useEffect, useState } from "react";
import { getAllSeries, deleteSerie } from "../utils/service";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit } from "react-icons/fa";

const GetAllSeries = () => {
  const [serii, setSerii] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSerieDeleted, setIsSerieDeleted] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role'); // Presupunând că rolul este stocat ca 'ADMIN' sau 'USER'
    setIsAdmin(role === 'ADMIN');
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const data = await getAllSeries();
      setSerii(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSerie = async (id) => {
    try {
      await deleteSerie(id);
      setSerii(serii.filter((serie) => serie.id !== id));
      setIsSerieDeleted(true);
      setDeleteSuccess("Serie deleted successfully.");
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      setDeleteSuccess("");
    }, 4000);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="container">
      <div className="row mt-5">
        <div className="col-md-6 mb-2 md-mb-0" style={{ color: "GrayText" }}>
          <h4>All Serii</h4>
        </div>
        <div className="col-md-4 d-flex justify-content-end">
          <Link to={"/series/add"}>
            <FaPlus /> Add Serie
          </Link>
        </div>
      </div>
      <hr />
      {isSerieDeleted && (
        <div className="alert alert-success">{deleteSuccess}</div>
      )}
      {serii.map((serie, index) => (
        <div key={serie.id}>
          <pre>
            <h4 style={{ color: "GrayText" }}>{`${index + 1}. ${serie.nume}`}</h4>
          </pre>
          {isAdmin && (
            <div className="btn-group mb-4">
              <Link to={`/update-serie/${serie.id}`}>
                <button className="btn btn-sm btn-outline-warning mr-2"><FaEdit /> Edit Serie</button>
              </Link>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteSerie(serie.id)}>
                Delete Serie
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default GetAllSeries;
