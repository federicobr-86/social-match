import { useNavigate } from "react-router-dom";
import "../styles/Matching.scss";

export default function Matching() {
  const navigate = useNavigate();

  const handleProfileClick = (userId) => {
    navigate(`/profile`);
  };

  return (
    <div className="main">
      <h1>Matching</h1>
      <div
        className="card"
        onClick={() => handleProfileClick(1)}
        style={{ cursor: "pointer" }}
      >
        <img
          src="https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Perfil"
          className="img"
        />
        <h2>Nombre</h2>
        <p>Descripción</p>
        <div className="buttons">
          <button className="button">Me gusta</button>
          <button className="button">No me gusta</button>
        </div>
      </div>
    </div>
  );
}
