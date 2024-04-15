import React from 'react';
import { useNavigate, Link } from 'react-router-dom';



function HomePage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');  // Preia rolul din localStorage
  console.log("Rolul curent este: ", localStorage.getItem('role'));


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles'); // Corectează numele cheii pentru a se potrivi cu ce ai setat la login
    navigate('/login');
};

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        {userRole !== 'USER' && <Link to="/users/all">Vizualizare Utilizatori</Link>}
      </div>
      <div>
        <Link to="/my-profile">Vizualizare Profil</Link> 
      </div>
      <div>
        {userRole !== 'USER' && <Link to="/series/add">Adăugare Serie</Link>}
      </div>
      <div>
        {userRole !== 'USER' && <Link to="/marca/add">Adaugare Producator</Link>}
      </div>
      <div>
        {userRole !== 'USER' && <Link to="/invertor/add">Adaugare Invertor</Link>}
      </div>
      <div>
        {userRole !== 'USER' && <Link to="/marca/all">Vezi marci</Link>}
      </div>
      <div>
        {userRole !== 'USER' && <Link to="/serie/all">Vezi Serii</Link>}
      </div>
      <div>
        {userRole !== 'USER' && <Link to="/invertor/all">Vezi Invertoare</Link>}
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default HomePage;