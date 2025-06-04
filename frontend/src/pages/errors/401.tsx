import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Erro404() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  })
}

