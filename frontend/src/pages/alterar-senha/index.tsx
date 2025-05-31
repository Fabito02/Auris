import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/buttons/Button";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { trocarSenha } from "@/api/api_routes";

const AlterarSenha = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Alterar Senha";
    checkAuth(navigate, ["admin", "moderador", "user"]);
  }, []);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [openConfirmacao, setOpenConfirmacao] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmacao) {
      setError("As senhas não coincidem!");
      return;
    }
    if (novaSenha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setOpenConfirmacao(true);
  };

  const closeModal = () => {
    setOpenConfirmacao(false);
  };

  const closeSuccess = () => {
    setOpenSuccess(false);
    navigate("/home");
  };

  const alterarSenha = async () => {
    const body = {
      senhaAtual: senhaAtual,
      senha: novaSenha,
    };

    try {
      const response = await trocarSenha(body);
      if (response.success) {
        setError(null);
        setOpenConfirmacao(false);
        setOpenSuccess(true);
      } else {
        setError(response.error || "Erro ao conectar com o servidor");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o servidor");
    }
  };

  return (
    <BlankLayout showFooter={false}>
      <div className="max-w-md mx-auto py-10 px-4">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-center mb-10">
            Alterar Senha
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
            <div className="space-y-1">
              <Label htmlFor="senhaAtual">Senha Atual</Label>
              <Input
                id="senhaAtual"
                type="password"
                value={senhaAtual}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSenhaAtual(e.target.value)
                }
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <Input
                id="novaSenha"
                type="password"
                value={novaSenha}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNovaSenha(e.target.value)
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmacao(e.target.value)
                }
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              texto="Salvar Nova Senha"
              icon="material-symbols:lock"
              className="w-full"
            />
          </form>
        </div>
      </div>

      <Dialog open={openConfirmacao} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
              Confirme a sua ação.
            </DialogTitle>
            <DialogDescription className="text-center">
              Deseja realmente alterar sua senha?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
            <Button
              onClick={alterarSenha}
              full_rounded
              color="success"
              className="w-full px-5"
              texto="sim"
            />
            <Button
              onClick={closeModal}
              full_rounded
              color="danger"
              className="w-full px-5"
              texto="cancelar"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openSuccess} onOpenChange={closeSuccess}>
        <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
              Senha alterada com sucesso!
            </DialogTitle>
            <DialogDescription className="text-center">
              Clique no botão abaixo para ir à home.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              onClick={closeSuccess}
              full_rounded
              color="success"
              className="w-full sm:max-w-[200px] px-5"
              texto="home"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BlankLayout>
  );
};

export default AlterarSenha;
