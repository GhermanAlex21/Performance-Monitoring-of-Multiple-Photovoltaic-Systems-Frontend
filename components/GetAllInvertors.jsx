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
    <section className="get-all-invertors-container">
      <div className="row mt-5">
        <div className="col-md-6">
          <h4>All Invertors</h4>
        </div>
        {isAdmin && (
          <div className="col-md-6 d-flex justify-content-end">
            <Link to={"/invertor/add"}>
              <button className="btn btn-sm btn-outline-success mr-2">
                <FaPlus /> Add Invertor
              </button>
            </Link>
          </div>
        )}
      </div>
      <hr />
      {isInvertorDeleted && (
        <div className="alert alert-success">{deleteSuccess}</div>
      )}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Marca</th>
            <th>Serie</th>
            <th>Proprietar</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {invertors.map((invertor, index) => (
            <tr key={invertor.id}>
              <td>{index + 1}</td>
              <td>{invertor.marca.nume}</td>
              <td>{invertor.serie.nume}</td>
              <td>{`${invertor.user.nume} ${invertor.user.prenume}`}</td>
              {isAdmin && (
                <td className="btn-group">
                  <Link to={`/invertor/update/${invertor.id}`}>
                    <button className="btn btn-sm btn-outline-warning">
                      <FaEdit /> Update Invertor
                    </button>
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteInvertor(invertor.id)}
                  >
                    <FaTrash /> Delete Invertor
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default GetAllInvertors;