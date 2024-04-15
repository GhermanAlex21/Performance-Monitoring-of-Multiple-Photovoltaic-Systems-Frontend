import React, { useEffect, useState } from "react";
import { getMarcaById, updateMarca } from "../utils/service";
import { useParams, Link, useNavigate } from "react-router-dom";

const UpdateMarca = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marca, setMarca] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [marcaUpdated, setMarcaUpdated] = useState(false); // State pentru urmărirea modificării mărcii

  useEffect(() => {
    fetchMarca();
  }, []);

  const fetchMarca = async () => {
    try {
      const marcaToUpdate = await getMarcaById(id);
      if (marcaToUpdate) {
        setMarca(marcaToUpdate.nume || "");
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarcaChange = (e) => {
    setMarca(e.target.value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedMarca = {
        nume: marca
      };
      await updateMarca(id, updatedMarca);
      setMarcaUpdated(true); // Setăm marcaUpdated pe true pentru a afișa mesajul
      setTimeout(() => {
        navigate("/marca/all");
      }, 2000); // Redirecționare după 2 secunde
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
        Update Marca
      </h4>
      <div className="col-8">
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="text-info">Marca:</label>
            <input
              type="text"
              className="form-control mb-4"
              value={marca}
              onChange={handleMarcaChange}
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-sm btn-outline-warning">
              Update Marca
            </button>
            <Link to={"/marca/all"} className="btn btn-outline-primary ml-2">
              Back to All Marcas
            </Link>
          </div>
        </form>
        {marcaUpdated && (
          <div className="alert alert-success mt-3">
            Marca updated successfully.
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateMarca;