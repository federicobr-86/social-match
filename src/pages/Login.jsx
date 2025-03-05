import "../styles/Login.scss";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/register");
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Login</h2>
        <input className="input" type="email" placeholder="Email" />
        <input className="input" type="password" placeholder="Password" />
        <div className="buttons">
          <button className="button" onClick={handleLogin}>
            Ingresar
          </button>
        </div>
        <p className="text">
          No teenes una cuenta?{" "}
          <a href="/register" className="link">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
