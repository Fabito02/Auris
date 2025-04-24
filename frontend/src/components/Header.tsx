import Search from "../components/Search";
import PerfilHeader from "../components/PerfilHeader";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      style={{
        width: "100%",
        height: "auto",
        padding: "5px",
        position: "fixed",
        backgroundColor: "rgb(255 255 255 / 87%)",
        backdropFilter: "blur(15px)",
        top: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <Link to="/">
        <img
          className="ifnmg-imagem pr-2"
          src={
            window.innerWidth <= 768 ? "/IFNMG.png" : "/IFNMG - Almenara.png"
          }
          alt="IFNMG - Almenara"
          style={{
            maxHeight: "55px",
            minHeight: "55px",
            objectFit: "cover",
          }}
        />
      </Link>
      <Search />
      <PerfilHeader />
    </header>
  );
};

export default Header;
