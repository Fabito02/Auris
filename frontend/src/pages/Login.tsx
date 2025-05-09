import Button from "@/components/buttons/Button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify-icon/react";
import { BlankLayout } from "../components/BlankLayout/BlankLayout";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postLogin } from "../api/api_routes";
import "./LoginERegistrar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type FormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  token?: string;
  error?: string;
  user?: {
    User_ID: number;
    Email: string;
    role: string;
  };
};

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loginSucesso, setLoginSucesso] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login";
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response: LoginResponse = await postLogin({
        Email: formData.email,
        Senha: formData.password,
      });

      if (response.success && response.token && response.user) {
        localStorage.setItem("auris_token", response.token);
        setLoginSucesso(true);
        setError(null);
        setFormData({ email: "", password: "" });
      } else {
        setError(response.error || "Credenciais inválidas");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o servidor");
      console.error("Erro no login:", err);
    }
  };

  const closeModal = () => {
    setLoginSucesso(false);
    navigate("/home");
  };

  return (
    <BlankLayout
      showFooter={false}
      showHeader={false}
      showNavbar={false}
      removeBodyPadding
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-screen">
          <div className="col-lg-5 col-span-2 box">
            <h1 className="title-login">Bem Vindo!</h1>
            <p className="subtitle mt-4">
              Caso você não possua uma conta,
              <br />
              crie com o botão abaixo
            </p>
            <Link to="/registrar" className="mt-2">
              <Button outline full_rounded color="white" className="mt-4">
                REGISTRAR
              </Button>
            </Link>
          </div>

          <div className="col-span-3 formulario h-screen">
            <div className="max-w-md mx-auto w-full">
              <h1 className="title2 mb-12">LOGIN</h1>
              <form className="px-15" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 mb-3">{error}</p>}

                <div className="relative mb-3">
                  <Icon
                    className="iconeForm"
                    icon="material-symbols:stacked-email-rounded"
                  />
                  <Input
                    className="custom-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="E-mail"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="relative">
                  <Icon
                    className="iconeForm"
                    icon="material-symbols:password-rounded"
                  />
                  <Input
                    className="custom-input"
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Senha"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Link to="/recuperar-senha" className="text-muted-foreground">
                  Esqueceu sua senha?
                </Link>

                <div className="w-full flex justify-center mt-5">
                  <Button full_rounded style={{ width: "220px" }} type="submit">
                    ENTRAR
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={loginSucesso} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
              Login realizado com sucesso!
            </DialogTitle>
            <DialogDescription className="text-center">
              Você já pode acessar a plataforma.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              onClick={closeModal}
              full_rounded
              color="success"
              className="w-full sm:max-w-[200px] px-5"
              texto="acessar"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BlankLayout>
  );
};

export default Login;
