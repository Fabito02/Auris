import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/buttons/Button";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";

const AlterarSenha = () => {

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Alterar Senha";
    const token = localStorage.getItem("auris_token");
    if (!token) {
      navigate("/errors/401");
    } else {
      checkAuth(navigate, ["admin", "moderador", "user"]);
    }
  }, []);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ senhaAtual, novaSenha, confirmacao });
  };

  return (
    <BlankLayout showFooter={false}>
      <div className="max-w-md mx-auto py-10 px-4">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-center mb-6">
            Alterar Senha
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="senhaAtual">Senha Atual</Label>
              <Input
                id="senhaAtual"
                type="password"
                value={senhaAtual}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenhaAtual(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovaSenha(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmacao(e.target.value)}
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
    </BlankLayout>
  );
};

export default AlterarSenha;