import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";
import { BlankLayout } from "../../components/BlankLayout/BlankLayout";

export default function Erro404() {
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
          401 - Autenticação necessária
        </h1>
        <p className="text-lg mb-6 text-muted-foreground">
          Para acessar esta página, você precisa fazer login.
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
