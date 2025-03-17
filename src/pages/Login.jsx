import "../styles/Login.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import supabase from "../../utils/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw new Error("Error al iniciar sesión: " + error.message);
      }

      if (!data.user) {
        throw new Error("No se pudo autenticar al usuario");
      }

      console.log("Usuario autenticado:", data.user.id);
      navigate("/profile"); // Cambiado de /matching a /profile
    } catch (err) {
      console.error("Error en login:", err.message);
      setErrorMessage(err.message);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Login</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <input
          className="input"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="buttons">
          <button className="button" onClick={handleLogin}>
            Ingresar
          </button>
        </div>
        <p className="text">
          ¿No tienes una cuenta?{" "}
          <span
            className="link"
            onClick={handleRegisterRedirect}
            style={{ cursor: "pointer" }}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}
