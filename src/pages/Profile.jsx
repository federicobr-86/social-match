import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import "../styles/Profile.scss";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [file, setFile] = useState(null);

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
        setEditedProfile(data);
      } else {
        setProfile(null);
        setErrorMessage("No se encontró un perfil para este usuario");
      }
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      setErrorMessage(err.message);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage("La imagen no debe exceder 5MB");
        return;
      }
      if (
        !["image/jpeg", "image/png", "image/gif"].includes(selectedFile.type)
      ) {
        setErrorMessage("Solo se permiten imágenes JPG, PNG o GIF");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSave = async () => {
    setErrorMessage(null);

    try {
      let photoUrl = editedProfile.photo;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${profile.email}/${fileName}`;
        const bucketName = "SocialStorage";

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (uploadError) {
          throw new Error("Error al subir la imagen: " + uploadError.message);
        }

        console.log("Imagen subida:", uploadData);

        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error("No se pudo generar una URL pública válida");
        }

        photoUrl = publicUrlData.publicUrl;
        console.log("URL pública generada:", photoUrl);
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          name: editedProfile.name,
          age: editedProfile.age,
          description: editedProfile.description,
          instagram: editedProfile.instagram,
          phone: editedProfile.phone,
          photo: photoUrl,
        })
        .eq("email", profile.email);

      if (error) {
        throw new Error("Error al actualizar el perfil: " + error.message);
      }

      setProfile({ ...editedProfile, photo: photoUrl });
      setIsEditing(false);
      setFile(null);
      console.log("Perfil actualizado:", { ...editedProfile, photo: photoUrl });
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="main">
      <h1>Perfil</h1>
      <div className="buttons">
        {/* <button className="button" onClick={getProfile}>
          Recargar Perfil
        </button> */}
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
            <div className="edit-form">
              <div className="field">
                <label>
                  <strong>Nombre:</strong>
                  <input
                    type="text"
                    name="name"
                    value={editedProfile.name || ""}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    className="input"
                  />
                </label>
              </div>
              <div className="field">
                <label>
                  <strong>Edad:</strong>
                  <input
                    type="number"
                    name="age"
                    value={editedProfile.age || ""}
                    onChange={handleInputChange}
                    placeholder="Edad"
                    className="input"
                  />
                </label>
              </div>
              <div className="field">
                <label>
                  <strong>Descripción:</strong>
                  <textarea
                    name="description"
                    value={editedProfile.description || ""}
                    onChange={handleInputChange}
                    placeholder="Descripción"
                    className="input"
                  />
                </label>
              </div>
              <div className="field">
                <label>
                  <strong>Instagram:</strong>
                  <input
                    type="text"
                    name="instagram"
                    value={editedProfile.instagram || ""}
                    onChange={handleInputChange}
                    placeholder="Instagram"
                    className="input"
                  />
                </label>
              </div>
              <div className="field">
                <label>
                  <strong>Teléfono:</strong>
                  <input
                    type="text"
                    name="phone"
                    value={editedProfile.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Teléfono"
                    className="input"
                  />
                </label>
              </div>
              <div className="field">
                <label>
                  <strong>Foto:</strong>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="input"
                  />
                </label>
              </div>
              <div className="buttons">
                <button className="button" onClick={handleSave}>
                  Guardar
                </button>
              </div>
            </div>
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
