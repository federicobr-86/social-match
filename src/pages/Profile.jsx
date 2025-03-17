import { useState, useEffect } from "react"; // Añadimos useEffect
import supabase from "../../utils/supabase";
import "../styles/Profile.scss";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Cargar el perfil al montar el componente
  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    setErrorMessage(null);

    try {
      // Obtener el usuario autenticado
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("No se pudo obtener el usuario autenticado");
      }

      console.log("Usuario autenticado:", user.email);

      // Buscar el perfil usando el email del usuario autenticado
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email) // Filtramos por email
        .single(); // Esperamos un solo resultado

      if (error) {
        throw new Error("Error al cargar el perfil: " + error.message);
      }

      if (data) {
        console.log("Perfil encontrado:", data);
        setProfile(data);
      } else {
        setProfile(null);
        setErrorMessage("No se encontró un perfil para este usuario");
      }
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="main">
      <h1>Perfil</h1>
      <button className="button" onClick={getProfile}>
        Recargar Perfil
      </button>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {profile ? (
        <div className="card">
          <img
            src={profile.photo || "https://via.placeholder.com/150"}
            alt="Perfil"
            className="img"
          />
          <p>
            <strong>Nombre:</strong> {profile.name || "No especificado"}
          </p>
          <p>
            <strong>Edad:</strong> {profile.age || "No especificada"}
          </p>
          <p>
            <strong>Descripción:</strong>{" "}
            {profile.description || "No especificada"}
          </p>
          <p>
            <strong>Instagram:</strong> {profile.instagram || "No especificado"}
          </p>
          <p>
            <strong>Teléfono:</strong> {profile.phone || "No especificado"}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
        </div>
      ) : (
        <p>No hay perfil cargado.</p>
      )}
    </div>
  );
}
