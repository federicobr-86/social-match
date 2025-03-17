import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import "../styles/Matching.scss";

export default function Matching() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]); // Cambiamos a array para múltiples perfiles
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    getProfiles(); // Cambiamos a plural
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    getCurrentUser();
  }, []);

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`); // Añadimos el ID al path
  };

  async function getProfiles() {
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        console.log("profiles", data);
        setProfiles(data); // Guardamos todos los perfiles
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error.message);
      setErrorMessage("No se pudieron cargar los perfiles.");
    }
  }

  async function handleLike(likedUserId) {
    if (!currentUserId) {
      setErrorMessage("Debes estar autenticado para dar like");
      return;
    }

    try {
      const { data, error } = await supabase.from("likes").insert({
        user_id: currentUserId,
        liked_user_id: likedUserId,
        like_time: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      console.log("Like registrado:", data);
    } catch (error) {
      console.error("Error al dar like:", error.message);
      setErrorMessage("No se pudo registrar el like");
    }
  }

  return (
    <div className="main">
      <h1>Matching</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {profiles.length > 0 ? (
        <div className="profiles-container">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="card"
              onClick={() => handleProfileClick(profile.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  profile.photo ||
                  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt="Perfil"
                className="img"
              />
              <h2>{profile.name || "Nombre"}</h2>
              <p>
                {profile.age ? `${profile.age} años` : "Edad no especificada"}
              </p>
              <div className="buttons">
                <button
                  className="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(profile.id);
                  }}
                >
                  Me gusta
                </button>
                <button className="button">No me gusta</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay perfiles disponibles o cargando...</p>
      )}
    </div>
  );
}
