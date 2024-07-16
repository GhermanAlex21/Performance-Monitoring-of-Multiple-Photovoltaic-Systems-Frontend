import React, { useEffect, useState } from "react";
import { getAllMarcas, getSeriesByMarcaId, deleteSerie } from "../utils/service";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const GetAllSeries = () => {
  const [serii, setSerii] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSerieDeleted, setIsSerieDeleted] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'ADMIN');
    fetchMarcas();
  }, []);

  const fetchMarcas = async () => {
    try {
      const data = await getAllMarcas();
      setMarcas(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSeries = async (marcaId) => {
    try {
      const data = await getSeriesByMarcaId(marcaId);
      setSerii(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarcaChange = (e) => {
    const marcaId = e.target.value;
    setSelectedMarca(marcaId);
    fetchSeries(marcaId);
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
    <section className="series-container">
      <div className="series-header">
        <h4>All Serii</h4>
        {isAdmin && (
          <Link to={"/series/add"}>
            <button className="btn btn-sm btn-outline-success">
              <FaPlus /> Add Serie
            </button>
          </Link>
        )}
      </div>
      <div className="row mt-3">
        <div className="col-md-4">
          <select
            id="selectMarca"
            className="form-control"
            value={selectedMarca}
            onChange={handleMarcaChange}
          >
            <option value="">Select Marca</option>
            {marcas.map(marca => (
              <option key={marca.id} value={marca.id}>
                {marca.nume}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr />
      {isSerieDeleted && (
        <div className="alert alert-success">{deleteSuccess}</div>
      )}
      {selectedMarca && serii.length === 0 && (
        <p>No series available for the selected marca.</p>
      )}
      {selectedMarca && serii.length > 0 && (
        <table className="series-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Serie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {serii.map((serie, index) => (
              <tr key={serie.id}>
                <td>{index + 1}</td>
                <td>{serie.nume}</td>
                <td>
                  {isAdmin && (
                    <div className="btn-group-series">
                      <Link to={`/update-serie/${serie.id}`}>
                        <button className="btn btn-sm btn-outline-warning">
                          <FaEdit /> Edit Serie
                        </button>
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteSerie(serie.id)}
                      >
                        <FaTrash /> Delete Serie
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default GetAllSeries;