import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "../components/buttons/Button";
import { BlankLayout } from "../components/BlankLayout/BlankLayout";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { emailRecuperacao } from "../api/api_routes";
import { Icon } from "@iconify-icon/react";
import { useEffect } from "react";

function RecuperarSenha() {

    useEffect(() => {
        document.title = "Recuperar Senha";
    }, []);

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailBackup = email;
    setEmail("");

    const loadingToast = toast.loading("Enviando email de recuperação...");

    const data = { "email": emailBackup };

    try {
      const response = await emailRecuperacao(data);

      if (response.success) {
        toast.success("Email de recuperação enviado!", {
          id: loadingToast,
          icon: (
            <Icon
              icon="mdi:check-circle"
              className="text-[var(--color-success)]"
            />
          )
        });
        navigate("/login");
      } else {
        toast.error("Erro ao enviar email de recuperação.", {
          id: loadingToast,
          icon: (
            <Icon
              icon="mdi:alert-circle"
              className="text-[var(--color-danger)]"
            />
          )
        });
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.", {
        id: loadingToast,
        icon: (
          <Icon
            icon="mdi:alert-circle"
            className="text-[var(--color-danger)]"
          />
        )
      });
    }
  };

  return (
    <BlankLayout showFooter={false}>
      <div className="max-w-md mx-auto py-10 px-4">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-center mb-10">
            Recuperar Senha
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="email">Email da sua conta</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="exemplo@ifnmg.edu.br"
                required
              />
            </div>

            <Button
              type="submit"
              texto="Enviar email"
              icon="material-symbols:mail-rounded"
              className="w-full"
            />
          </form>
        </div>
      </div>
    </BlankLayout>
  );
}

export default RecuperarSenha;
