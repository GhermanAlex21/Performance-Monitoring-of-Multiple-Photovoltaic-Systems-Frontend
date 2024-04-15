import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import AddUser from '../components/AddUser';
import AddSerie from '../components/AddSerie';
import AdaugaMarca from '../components/AdaugaMarca';
import AdaugaInvertor from '../components/AdaugaInvertor';
import MarcaTable from '../components/GetAllMarcas';
import Login from '../components/Login';
import UpdateMarca from '../components/UpdateMarca'; 
import GetAllSeries from '../components/GetAllSeries';
import UpdateSerie from '../components/UpdateSerie';
import GetAllUsers from '../components/GetAllUsers';
import GetAllInvertors from '../components/GetAllInvertors';
import UpdateInvertor from '../components/UpdateInvertor';

import PrivateRoute from '../components/PrivateRoute'; 
import Navbar from '../components/NavBar';
import 'tailwindcss/tailwind.css'
import UpdateUser from '../components/UpdateUser';
import ProfileView from '../components/ProfieView';
import ProfileUpdate from '../components/ProfileUpdate';

const App = () => {
    return (
        <Router>
            <div className="container mt-4">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/user-save" element={<AddUser />} /> 
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/series/add" element={<AddSerie />} />
                        <Route path="/marca/add" element={<AdaugaMarca />} />
                        <Route path="/invertor/add" element={<AdaugaInvertor />} />
                        <Route path="/serie/all" element={<GetAllSeries />} />
                        <Route path="/marca/all" element={<MarcaTable />} />
                        <Route path="/update-marca/:id" element={<UpdateMarca />} />
                        <Route path="/update-serie/:id" element={<UpdateSerie />} />
                        <Route path="/users/all" element={<GetAllUsers />} />
                        <Route path="/invertor/all" element={<GetAllInvertors />} />
                        <Route path="/invertor/update/:id" element={<UpdateInvertor />} />
                        <Route path ="/user/update/:id" element={<UpdateUser/>}/>
                        <Route path ="/my-profile" element={<ProfileView/>}/>
                        <Route path ="/update-profile" element={<ProfileUpdate/>}/>
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;