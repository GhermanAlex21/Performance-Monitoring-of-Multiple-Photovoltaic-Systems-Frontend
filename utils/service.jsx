import axios from "axios";

export const api = axios.create({
	baseURL: "http://localhost:8000"
});

export const saveUser = async (user) => {
  try {
    const response = await api.post("/user-save", user);
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error("Eroare la salvarea utilizatorului:", error);
    // În cazul unui răspuns de eroare, acesta va fi inclus în error.response
    return {
      success: false,
      data: error.response ? error.response.data : null,
      status: error.response ? error.response.status : 500 // Un status implicit în cazul în care error.response nu există
    };
  }
}
export const compareInvertors = async (id1, id2) => {
  try {
      const response = await api.get(`/compare?id1=${id1}&id2=${id2}`);
      return response.data;
  } catch (error) {
      console.error("Eroare la compararea invertorilor:", error);
      throw error;
  }
};

export const getAllUsers = async() =>{
  try {
    const response = await api.get("/users-all");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export const saveSerie = async (serie) => {
    try {
      const response = await api.post("/series", serie);
      return response.data;
    } catch (error) {
      console.error("Eroare la adăugarea seriei:", error);
      throw error;
    }
  }

  export const saveMarca = async (marca) => {
    try {
        const response = await api.post("/adauga_marca", marca);
        return response.data;
    } catch (error) {
        console.error("Eroare la adăugarea producătorului:", error);
        throw error;
    }
}
export const saveInvertor = async (invertor) => {
    try {
        const response = await api.post("/invertors", invertor);
        return response.data;
    } catch (error) {
        console.error("Eroare la adăugarea invertorului:", error);
        throw error;
    }
}

export const updateMarca = async (id, updatedMarca) => {
  try {
    const response = await api.put(`/update_marca/${id}`, updatedMarca);
    return response.data;
  } catch (error) {
    console.error("Eroare la actualizarea mărcii:", error);
    throw error;
  }
}
export const getSeriesByMarcaId = async (marcaId) => {
  const response = await api.get(`/serii/by-marca/${marcaId}`);
  return response.data;
};


export const updateSerie = async (id, updatedSerie) => {
  try {
      const response = await api.put(`/update_serie/${id}`, updatedSerie);
      return response.data;
  } catch (error) {
      console.error("Eroare la actualizarea seriei:", error);
      throw error;
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/delete_user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Eroare la ștergerea utilizatorului:", error);
        throw error;
  }
}

export const getMarcaById = async (id) => {
  try {
      const response = await api.get(`/marca/${id}`);
      return response.data;
  } catch (error) {
      console.error("Eroare la obținerea mărcii:", error);
      throw error;
  }
}

export const getSerieById = async (id) => {
  try {
      const response = await api.get(`/serie/${id}`);
      return response.data;
  } catch (error) {
      console.error("Eroare la obținerea seriei:", error);
      throw error;
  }
}


export const getAllMarcas = async () => {
    try {
        const response = await api.get("/get_marca");
        return response.data;
    } catch (error) {
        console.error("Eroare la obținerea listei de mărci:", error);
        return [];
    }
}
export const getAllSeries = async () => {
    try {
        const response = await api.get("/get_serii");
        return response.data;
    } catch (error) {
        console.error("Eroare la obținerea listei de serii:", error);
        return [];
    }
}

export const deleteMarca = async (id) => {
    try {
        const response = await api.delete(`/delete_marca/${id}`);
        return response.data;
    } catch (error) {
        console.error("Eroare la ștergerea mărcii:", error);
        throw error;
    }
}

export const deleteSerie = async(id)=>{
  try {
    const response = await api.delete(`/delete_serie/${id}`);
    return response.data;
    
  } catch (error) {
    console.log("Eroarea la stergerea seriei:", error);
    throw error;
    
  }
}

export const getLoggedInUserDetails = async() =>{
  try {
    const response = await api.get("/users-single");
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getAllInvertors = async () => {
  try {
      const response = await api.get("/get_invertori");
      return response.data;
  } catch (error) {
      console.error("Eroare la obținerea listei de invertori:", error);
      return [];
  }
}

export const deleteInvertor = async (id) => {
  try {
      const response = await api.delete(`/delete_invertor/${id}`);
      return response.data;
  } catch (error) {
      console.error("Eroare la ștergerea invertorului:", error);
      throw error;
  }
}

export const updateInvertor = async (id, updatedInvertor) => {
  try {
    const response = await api.put(`/update_invertor/${id}`, updatedInvertor);
    return response.data;
  } catch (error) {
    console.error("Eroare la actualizarea invertorului:", error);
    throw error;
  }
}
export const getInvertorById = async (id) => {
  try {
    const response = await api.get(`/invertors/${id}`);
    return response.data;
  } catch (error) {
    console.error("Eroare la obținerea invertorului:", error);
    throw error;
  }
}
export const login = async (email, password) => {
  try {
    const response = await axios.post('/login', { email, password });
    return response.data; 
  } catch (error) {
    throw error; 
  }
}
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/user/${id}`);  
    return response.data;
  } catch (error) {
    console.error("Eroare la obținerea utilizatorului:", error);
    throw error;
  }
}

export const updateUser = async (id, updatedUser) => {
  try {
    const response = await api.put(`/update_user/${id}`, updatedUser); 
    return response.data;
  } catch (error) {
    console.error("Eroare la actualizarea utilizatorului:", error);
    throw error;
  }
}

