import { useState } from "react";
import supabase from "../../utils/supabase";
import "../styles/Profile.scss";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function getProfile() {
    setErrorMessage(null); // Limpiar errores previos

    const { data, error } = await supabase.from("profile").select();

    if (data && data.length > 0 && data[0]) {
      console.log("data", data);
      console.log("data 0", data[0]);
      setProfile(data[0]);
    } else {
      setProfile(null);
    }

    if (error) {
      console.error("Error fetching profile:", error.message);
      setErrorMessage("No se pudo cargar el perfil.");
      return;
    }
  }

  return (
    <div className="main">
      <h1>Perfil</h1>
      <button className="button" onClick={getProfile}>
        Cargar Perfil
      </button>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {profile ? (
        <div className="card">
          <img
            src="https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Perfil"
            className="img"
          />
          <p>
            <strong>Nombre:</strong> {profile.name}
          </p>
          <p>
            <strong>Edad:</strong> {profile.age}
          </p>
          <p>
            <strong>Descripción:</strong> {profile.description}
          </p>
          <p>
            <strong>Instagram:</strong> {profile.instagram}
          </p>
          <p>
            <strong>Teléfono:</strong> {profile.phone}
          </p>
        </div>
      ) : (
        <p>No hay perfil cargado.</p>
      )}
    </div>
  );
}
