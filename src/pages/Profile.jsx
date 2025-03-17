import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import "../styles/Profile.scss";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Controla el modo edición
  const [editedProfile, setEditedProfile] = useState({}); // Estado para los campos editados

  // Cargar el perfil al montar el componente
  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    setErrorMessage(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("No se pudo obtener el usuario autenticado");
      }

      console.log("Usuario autenticado:", user.email);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email)
        .single();

      if (error) {
        throw new Error("Error al cargar el perfil: " + error.message);
      }

      if (data) {
        console.log("Perfil encontrado:", data);
        setProfile(data);
        setEditedProfile(data); // Inicializamos el estado editable con los datos actuales
      } else {
        setProfile(null);
        setErrorMessage("No se encontró un perfil para este usuario");
      }
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      setErrorMessage(err.message);
    }
  }

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar los cambios
  const handleSave = async () => {
    setErrorMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: editedProfile.name,
          age: editedProfile.age,
          description: editedProfile.description,
          instagram: editedProfile.instagram,
          phone: editedProfile.phone,
        })
        .eq("email", profile.email); // Actualizamos basados en el email

      if (error) {
        throw new Error("Error al actualizar el perfil: " + error.message);
      }

      setProfile(editedProfile); // Actualizamos el perfil mostrado
      setIsEditing(false); // Salimos del modo edición
      console.log("Perfil actualizado:", editedProfile);
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="main">
      <h1>Perfil</h1>
      <div className="buttons">
        <button className="button" onClick={getProfile}>
          Recargar Perfil
        </button>
        {profile && (
          <button className="button" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        )}
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {profile ? (
        <div className="card">
          <img
            src={profile.photo || "https://via.placeholder.com/150"}
            alt="Perfil"
            className="img"
          />
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={editedProfile.name || ""}
                onChange={handleInputChange}
                placeholder="Nombre"
                className="input"
              />
              <input
                type="number"
                name="age"
                value={editedProfile.age || ""}
                onChange={handleInputChange}
                placeholder="Edad"
                className="input"
              />
              <textarea
                name="description"
                value={editedProfile.description || ""}
                onChange={handleInputChange}
                placeholder="Descripción"
                className="input"
              />
              <input
                type="text"
                name="instagram"
                value={editedProfile.instagram || ""}
                onChange={handleInputChange}
                placeholder="Instagram"
                className="input"
              />
              <input
                type="text"
                name="phone"
                value={editedProfile.phone || ""}
                onChange={handleInputChange}
                placeholder="Teléfono"
                className="input"
              />
              <div className="buttons">
                <button className="button" onClick={handleSave}>
                  Guardar
                </button>
              </div>
            </>
          ) : (
            <>
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
                <strong>Instagram:</strong>{" "}
                {profile.instagram || "No especificado"}
              </p>
              <p>
                <strong>Teléfono:</strong> {profile.phone || "No especificado"}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
            </>
          )}
        </div>
      ) : (
        <p>No hay perfil cargado.</p>
      )}
    </div>
  );
}
