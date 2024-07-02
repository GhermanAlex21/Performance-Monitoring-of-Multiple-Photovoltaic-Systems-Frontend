import React, { useEffect, useState } from "react";
import { getAllInvertors, deleteInvertor } from "../utils/service";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const GetAllInvertors = () => {
  const [invertors, setInvertors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvertorDeleted, setIsInvertorDeleted] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role'); // Presupunând că rolul este stocat ca 'ADMIN' sau 'USER'
    setIsAdmin(role === 'ADMIN');
    fetchInvertors();
  }, []);

  const fetchInvertors = async () => {
    try {
      const data = await getAllInvertors();
      setInvertors(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteInvertor = async (id) => {
    try {
      await deleteInvertor(id);
      setInvertors(invertors.filter((invertor) => invertor.id !== id));
      setIsInvertorDeleted(true);
      setDeleteSuccess("Invertor deleted successfully.");
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
          <h4>All Invertors</h4>
        </div>
        {isAdmin && (
          <div className="col-md-4 d-flex justify-content-end">
            <Link to={"/invertor/add"}>
              <FaPlus /> Add Invertor
            </Link>
          </div>
        )}
      </div>
      <hr />
      {isInvertorDeleted && (
        <div className="alert alert-success">{deleteSuccess}</div>
      )}
      {invertors.map((invertor, index) => (
        <div key={invertor.id}>
          <pre>
            <h4 style={{ color: "GrayText" }}>
              {`${index + 1}. Marca: ${invertor.marca.nume}, Serie: ${invertor.serie.nume}, Proprietar: ${invertor.user.nume} ${invertor.user.prenume}`}
            </h4>
          </pre>
          {isAdmin && (
            <div className="btn-group mb-4">
              <Link to={`/invertor/update/${invertor.id}`}>
                <button className="btn btn-sm btn-outline-warning mr-2">
                  <FaEdit /> Update Invertor
                </button>
              </Link>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteInvertor(invertor.id)}
              >
                <FaTrash /> Delete Invertor
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default GetAllInvertors;