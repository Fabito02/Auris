import Button from "@/components/buttons/Button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify-icon/react";
import { BlankLayout } from "../components/BlankLayout/BlankLayout";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postRegistrar } from "../api/api_routes";
import "./LoginERegistrar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {toast} from "sonner";

const Registrar = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [registrarSucesso, setRegistrarSucesso] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Registrar";
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarSenha = (password: string): string | null => {
    if (formData.password !== formData.confirmPassword) {
      return "As senhas não coincidem.";
    }
    if (password.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ nome: "", email: "", password: "", confirmPassword: "" });
    toast.loading("Carregando...", {
      id: "carregando",
    });

    const senhaInsegura = validarSenha(formData.password);
    if (senhaInsegura) {
      setError(senhaInsegura);
      toast.dismiss("carregando");
      return;
    }

    try {
      const response = await postRegistrar({
        User_ID: 0,
        Nome: formData.nome,
        Email: formData.email,
        Senha: formData.password,
      });

      if (response.success) {
        setRegistrarSucesso(true);
        setError(null);
        toast.dismiss("carregando");
      }
    } catch (err: any) {
      setError(err.message);
      toast.dismiss("carregando");
    }
  };

  const closeModal = () => {
    setRegistrarSucesso(false);
    navigate("/login");
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
              Caso você já possua uma conta,
              <br />
              entre com o botão abaixo
            </p>
            <Link to="/login">
              <Button outline full_rounded color="white" className="mt-4">
                FAZER LOGIN
              </Button>
            </Link>
          </div>

          <div className="col-span-3 formulario h-screen">
            <div className="max-w-md mx-auto w-full">
              <h1 className="title2 mb-12">CRIAR CONTA</h1>

              <form className="px-15" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 mb-3">{error}</p>}

                <div className="relative mb-3">
                  <Icon
                    className="iconeForm"
                    icon="material-symbols:group-rounded"
                  />
                  <Input
                    className="custom-input"
                    type="text"
                    name="nome"
                    placeholder="Nome completo"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="relative mb-3">
                  <Icon
                    className="iconeForm"
                    icon="material-symbols:stacked-email-rounded"
                  />
                  <Input
                    className="custom-input"
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="relative mb-3">
                  <Icon
                    className="iconeForm"
                    icon="material-symbols:password-rounded"
                  />
                  <Input
                    className="custom-input"
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="relative mb-3">
                  <Icon
                    className="iconeForm"
                    icon="material-symbols:password-rounded"
                  />
                  <Input
                    className="custom-input"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar senha"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="w-full flex justify-center">
                  <Button full_rounded style={{ width: "220px" }} type="submit">
                    REGISTRAR
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={registrarSucesso} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
              Conta criada com sucesso!
            </DialogTitle>
            <DialogDescription className="text-center">
              Verifique seu e-mail para ativar sua conta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              onClick={closeModal}
              full_rounded
              color="success"
              className="w-full sm:max-w-[200px] px-5"
              texto="fazer login"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BlankLayout>
  );
};

export default Registrar;
