import "../styles/Register.scss";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegister = async () => {
    try {
      // 1. Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) {
        throw new Error(
          "Error en el registro de autenticación: " + authError.message
        );
      }

      // Verificar que obtuvimos un usuario
      if (!authData.user) {
        throw new Error("No se creó el usuario en auth.users");
      }

      console.log("Usuario creado en auth:", authData.user.id); // Para depuración

      // 2. Insertar datos del perfil usando el ID del usuario autenticado
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          name: name,
          age: age,
          description: description,
          instagram: instagram,
          phone: phone,
          email: email,
          password: password,
        })
        .select();

      if (profileError) {
        throw new Error("Error al insertar perfil: " + profileError.message);
      }

      console.log("Perfil creado:", profileData); // Para depuración

      // Redirigir a matching
      navigate("/matching");
    } catch (err) {
      console.error("Error al registrar el perfil:", err.message);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Crea tu perfil</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <input
          className="input"
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          type="number"
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
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
