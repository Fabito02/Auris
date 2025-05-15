import { useNavigate } from "react-router-dom";
import Button from "../../components/buttons/Button";
import { BlankLayout } from "../../components/BlankLayout/BlankLayout";

export default function Erro404() {
  const navigate = useNavigate();

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
          404 - Página não encontrada
        </h1>
        <p className="text-lg mb-6 text-muted-foreground">
          A página que você tentou acessar não existe.
        </p>
        <div className="flex items-center justify-center">
          <Button
            texto="página inicial"
            color="primary"
            outline
            className="mt-2"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    </BlankLayout>
  );
}

