import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import "../styles/Matching.scss";

export default function Matching() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    getProfiles();
  }, []);

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  async function getProfiles() {
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("id");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        console.log("profiles", data);
        setProfiles(data);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error.message);
      setErrorMessage("No se pudieron cargar los perfiles.");
    }
  }

  async function handleLike(likedUserId) {
    try {
      const { data, error } = await supabase.from("likes").insert({
        user_id: likedUserId,
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
      {profiles?.length > 0 ? (
        <div className="profiles-container">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="card"
              onClick={() => handleProfileClick(profile.id)}
              style={{ cursor: "pointer" }}
            >
              <img src={profile.photo || ""} alt="Perfil" className="img" />
              <h2>{profile.name || "Nombre"}</h2>
              <p>
                {profile.age ? `${profile.age} años` : "Edad no especificada"}
              </p>
              <p>
                {profile.description
                  ? `${profile.description}`
                  : "No hay descripcion"}
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
                {/* <button className="button">No me gusta</button> */}
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
