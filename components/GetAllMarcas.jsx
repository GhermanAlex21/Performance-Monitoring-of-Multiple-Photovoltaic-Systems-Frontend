import React, { useEffect, useState } from "react";
import { getAllMarcas, deleteMarca } from "../utils/service";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

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
    <section className="container">
      <div className="row mt-5">
        <div className="col-md-6 mb-2 md-mb-0" style={{ color: "GrayText" }}>
          <h4>All Marci</h4>
        </div>
        {isAdmin && (
          <div className="col-md-4 d-flex justify-content-end">
            <Link to={"/marca/add"}>
              <FaPlus /> Add Marca
            </Link>
          </div>
        )}
      </div>
      <hr />
      {isMarcaDeleted && (
        <div className="alert alert-success">{deleteSuccess}</div>
      )}
      {marci.map((marca, index) => (
        <div key={marca.id}>
          <pre>
            <h4 style={{ color: "GrayText" }}>{`${index + 1}. ${marca.nume}`}</h4>
          </pre>
          {isAdmin && (
            <div className="btn-group mb-4">
              <Link to={`/update-marca/${marca.id}`}>
                <button className="btn btn-sm btn-outline-warning mr-2">Edit Marca</button>
              </Link>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteMarca(marca.id)}>
                Delete Marca
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default GetAllMarcas;