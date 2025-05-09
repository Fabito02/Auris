import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import Button from "../components/buttons/Button";
import { Link } from "react-router-dom";
import { BlankLayout } from "../components/BlankLayout/BlankLayout";
import { Icon } from "@iconify-icon/react";

type Status = "loading" | "success" | "error";

export default function ConfirmarEmail() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    document.title = "Confirmar Email";

    const confirmar = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (!token) {
        setStatus("error");
        return;
      }

      const timeoutId = setTimeout(() => {
        setStatus((prevStatus) =>
          prevStatus !== "success" ? "error" : prevStatus
        );
      }, 2500);

      try {
        const res = await axios.get(`${API_BASE}/confirmar?token=${token}`);

        clearTimeout(timeoutId);

        if (res.data.success || res.data.verified) {
          setStatus("success");
        } else {
          setTimeout(
            () =>
              setStatus((prevStatus) =>
                prevStatus !== "success" ? "error" : prevStatus
              ),
            2500
          );
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("Erro na requisição:", err);
        setTimeout(
          () =>
            setStatus((prevStatus) =>
              prevStatus !== "success" ? "error" : prevStatus
            ),
          2500
        );
      }
    };

    confirmar();
  }, []);

  if (status === "loading") {
    return (
      <BlankLayout
        showFooter={false}
        showHeader={false}
        showNavbar={false}
        centerContent
        removeBodyPadding
      >
        <div className="text-center">
          <Icon
            icon="svg-spinners:90-ring"
            width="4.3em"
            className="text-[var(--color-primary)]"
          />
        </div>
      </BlankLayout>
    );
  }

  if (status === "error") {
    return (
      <BlankLayout
        showFooter={false}
        showHeader={false}
        showNavbar={false}
        centerContent
        removeBodyPadding
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
            Erro ao tentar verificar a sua conta.
          </h1>
          <p className="text-lg mb-6 text-muted-foreground">
            O link de verificação expirou ou é inválido.
          </p>
          <Link to="/login" className="flex items-center justify-center">
            <Button
              texto="fazer login"
              color="primary"
              outline
              className="mt-2"
            />
          </Link>
        </div>
      </BlankLayout>
    );
  }

  return (
    <BlankLayout
      showFooter={false}
      showHeader={false}
      showNavbar={false}
      centerContent
      removeBodyPadding
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
          Conta verificada com sucesso!
        </h1>
        <p className="text-lg mb-6 text-muted-foreground">
          Agora você pode fazer login.
        </p>
        <Link to="/login" className="flex items-center justify-center">
          <Button texto="login" color="primary" outline className="mt-2" />
        </Link>
      </div>
    </BlankLayout>
  );
}
