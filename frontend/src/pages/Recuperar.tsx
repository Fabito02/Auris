import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/buttons/Button";
import { Link, useNavigate } from "react-router-dom";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import { Icon } from "@iconify-icon/react";
import { toast } from "sonner";
import { recuperarSenha } from "../api/api_routes";

type Status = "loading" | "ready" | "error";

export default function Recuperar() {
  const [status, setStatus] = useState<Status>("loading");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  useEffect(() => {
    document.title = "Recuperar Senha";

    if (!token) {
      setStatus("error");
      return;
    }

    setStatus("ready");
  }, [token]);

  const validarSenha = (senha: string, confirmacao: string): string | null => {
    if (senha !== confirmacao) {
      return "As senhas não coincidem.";
    }
    if (senha.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const loadingToast = toast.loading("Salvando nova senha...");
  
    const erroValidacao = validarSenha(novaSenha, confirmacao);
    if (erroValidacao) {
      setError(erroValidacao);
      toast.error(erroValidacao, {
        id: loadingToast,
        icon: (
          <Icon
            icon="mdi:alert-circle"
            className="text-[var(--color-danger)]"
          />
        ),
      });
      return;
    }
  
    try {
      const res = await recuperarSenha({ token: token ?? "", senha: novaSenha ?? "" });
  
      if (res.success) {
        toast.success("Senha alterada com sucesso!", {
          id: loadingToast,
          icon: (
            <Icon
              icon="material-symbols:check-circle"
              className="text-green-500"
            />
          ),
        });
        navigate("/login");
      } else {
        const mensagemErro = "Erro ao alterar senha.";
        setError(mensagemErro);
        toast.error(mensagemErro, {
          id: loadingToast,
          icon: (
            <Icon
              icon="mdi:alert-circle"
              className="text-[var(--color-danger)]"
            />
          ),
        });
      }
    } catch (err: any) {
      console.error(err);
      setError("Token inválido ou expirado.");
      toast.error("Erro ao alterar senha. Por favor, solicite uma nova recuperação.", {
        id: loadingToast,
        icon: (
          <Icon
            icon="mdi:alert-circle"
            className="text-[var(--color-danger)]"
          />
        ),
      });
    }
  };

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
          <Icon icon="svg-spinners:90-ring" width="4.3em" className="text-[var(--color-primary)]" />
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
            Link inválido ou expirado.
          </h1>
          <p className="text-lg mb-6 text-muted-foreground">
            Solicite uma nova recuperação de senha.
          </p>
          <Link to="/login" className="flex items-center justify-center">
            <Button texto="Fazer Login" color="primary" outline className="mt-2" />
          </Link>
        </div>
      </BlankLayout>
    );
  }

  return (
    <BlankLayout showFooter={false}>
      <div className="max-w-md mx-auto py-10 px-4">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-center mb-10">
            Alterar Senha
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <Input
                id="novaSenha"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmacao">Confirmar Nova Senha</Label>
              <Input
                id="confirmacao"
                type="password"
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              texto="Salvar Nova Senha"
              icon="material-symbols:lock"
              className="w-full"
            />
          </form>
        </div>
      </div>
    </BlankLayout>
  );
}