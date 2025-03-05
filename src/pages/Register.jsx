import "../styles/Register.scss";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  // Estado para los inputs
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");

  // Manejar el registro
  const handleRegister = async () => {
    try {
      // Insertar datos del perfil en la base de datos
      const { error } = await supabase.from("profile").insert({
        id: 2,
        name,
        age,
        description,
        instagram,
        phone,
      });

      if (error) {
        throw error;
      }

      // Redirigir a la página de matching después del registro exitoso
      navigate("/matching");
    } catch (err) {
      console.error("Error al registrar el perfil:", err.message);
    }
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Crea tu perfil</h2>
        <input
          className="input"
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Edad"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="buttons">
          <button className="button" onClick={handleRegister}>
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}
