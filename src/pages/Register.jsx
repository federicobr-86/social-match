import "../styles/Register.scss";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/matching");
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Crea tu perfil</h2>
        <input className="input" type="text" placeholder="Nombre" />
        <input className="input" type="number" placeholder="Edad" />
        <input className="input" type="email" placeholder="Email" />
        <input className="input" type="password" placeholder="Password" />
        Imagen
        <input
          className="input"
          type="file"
          placeholder="Imagen"
          accept="image/*"
        />
        <textarea className="input" placeholder="Descripción"></textarea>
        <div className="buttons">
          <button className="button" onClick={handleRegister}>
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}
