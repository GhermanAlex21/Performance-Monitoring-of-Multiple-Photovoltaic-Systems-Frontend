import React, { useEffect, useState } from "react";
import { getAllMarcas, deleteMarca } from "../utils/service";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import '../src/GetAllMarcas.css';

const GetAllMarcas = () => {
  const [marci, setMarci] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarcaDeleted, setIsMarcaDeleted] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role'); // Presupunând că rolul este stocat ca 'ADMIN' sau 'USER'
    setIsAdmin(role === 'ADMIN');
    fetchMarcas();
  }, []);

  const fetchMarcas = async () => {
    try {
      const data = await getAllMarcas();
      setMarci(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMarca = async (id) => {
    try {
      await deleteMarca(id);
      setMarci(marci.filter((marca) => marca.id !== id));
      setIsMarcaDeleted(true);
      setDeleteSuccess("Marca deleted successfully.");
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
    <section className="marcas-container">
      <div className="marcas-header">
        <h4>All Marci</h4>
        {isAdmin && (
          <Link to={"/marca/add"}>
            <button className="btn btn-sm btn-outline-success">
              <FaPlus /> Add Marca
            </button>
          </Link>
        )}
      </div>
      <hr />
      {isMarcaDeleted && (
        <div className="alert alert-success">{deleteSuccess}</div>
      )}
      <table className="marcas-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Marca</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {marci.map((marca, index) => (
            <tr key={marca.id}>
              <td>{index + 1}</td>
              <td>{marca.nume}</td>
              <td>
                {isAdmin && (
                  <div className="btn-group-marcas">
                    <Link to={`/update-marca/${marca.id}`}>
                      <button className="btn btn-sm btn-outline-warning">
                        <FaEdit /> Edit Marca
                      </button>
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteMarca(marca.id)}
                    >
                      <FaTrash /> Delete Marca
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default GetAllMarcas;