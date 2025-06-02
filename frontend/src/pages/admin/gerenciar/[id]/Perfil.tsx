import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkAuth } from "@/api/auth";
import { User, Endereco } from "@/types/api";
import {
  getUsuarioByUserId,
  getEnderecoByUserId,
  deleteUser
} from "@/api/api_routes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useParams } from "react-router-dom";
import Button from "@/components/buttons/Button";
import { toast } from "sonner";
import { URL_BASE_AVATAR } from "@/config";

const Perfil: React.FC = () => {
  const { id } = useParams();
  const userId = Number(id);

  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [openConfirmacao, setOpenConfirmacao] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    document.title = "Perfil";
    checkAuth(navigate, ["admin", "moderador"]);
    (async () => {
      const respUser = await getUsuarioByUserId(userId);
      setUser(respUser.data);
      const respEnd = await getEnderecoByUserId(userId);
      setEndereco(respEnd.data);
    })();
  }, [navigate]);
  
  useEffect(() => {
    const fetchAvatar = async () => {
      if (user?.Avatar) {
        setProfilePic(
          `${URL_BASE_AVATAR}/${user.Avatar}`
        );
      }
    };
    fetchAvatar();
  }, [user, setProfilePic]);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user?.Avatar) {
        setProfilePic(
          `${URL_BASE_AVATAR}/${user.Avatar}`
        );
      }
    };
    fetchAvatar();
  }, [user, setProfilePic]);
  
    const closeModal = () => {
      setOpenConfirmacao(false);
    };
  
    const closeSuccess = () => {
      setOpenSuccess(false);
      navigate("/admin/gerenciar");
    };
  
    const handleDelete = async () => {
      try {
        const response = await deleteUser(userId);
        if (response.success) {
          setOpenConfirmacao(false);
          setOpenSuccess(true);
        } else {
          toast.error("Erro ao conectar com o servidor:" + response.error, {
            icon: (
              <Icon
                icon="mdi:alert-circle"
                className="text-[var(--color-danger)]"
              />
            ),
          });
        }
      } catch (err: any) {
        toast.error("Erro ao conectar com o servidor:" + err.message, {
          icon: (
            <Icon
              icon="mdi:alert-circle"
              className="text-[var(--color-danger)]"
            />
          ),
        });
      }
    };

  return (
    <BlankLayout showFooter={false} showHeader showNavbar>
      <div className="py-10 max-w-5xl mx-auto">
        <Card className="p-2 border-0 shadow-none">
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3 md:col-span-1 flex justify-center">
                <div className="relative w-[220px] h-[220px] rounded-full overflow-hidden">
                  <img
                    src={profilePic || "/user_placeholder.png"}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="col-span-3 md:col-span-2 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h3 className="mb-1">Nome</h3>
                  <Input
                    name="nome"
                    value={user?.Nome || ""}
                    placeholder="Nome completo"
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  <h3 className="mb-1 mt-4">Permissão</h3>
                  <Input value={user?.Role} disabled />
                </div>
                <div className="col-span-1">
                  <h3 className="mb-1 mt-4">
                    {user?.Tipo === "servidor" ? "SIAPE" : "Matrícula"}
                  </h3>
                  <Input value={user?.SIAPE || "Indefinido"} disabled />
                </div>
                <div className="col-span-1">
                  <h3 className="mb-1">Tipo</h3>
                  <Input value={user?.Tipo} disabled />
                </div>
              </div>
              <div className="col-span-3 lg:col-span-2">
                <h3 className="mb-1">Email</h3>
                <Input
                  name="email"
                  value={user?.Email || ""}
                  disabled
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="col-span-3 sm:col-span-2 md:col-span-1">
                <h3 className="mb-1">Telefone</h3>
                <Input
                  name="telefone"
                  value={user?.Telefone || ""}
                  placeholder="(00) 00000-0000"
                  disabled
                />
              </div>
              <div className="col-span-1">
                <h3 className="mb-1">Estado</h3>
                <Select
                  disabled
                  name="estado"
                  value={endereco?.Estado || ""}
                  onValueChange={(value) =>
                    setEndereco(
                      (prev) => ({ ...prev, Estado: value } as Endereco)
                    )
                  }
                >
                  <SelectTrigger className="w-full custom-select">
                    <SelectValue placeholder="Selecione seu estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">Acre</SelectItem>
                    <SelectItem value="AL">Alagoas</SelectItem>
                    <SelectItem value="AP">Amapá</SelectItem>
                    <SelectItem value="AM">Amazonas</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="CE">Ceará</SelectItem>
                    <SelectItem value="DF">Distrito Federal</SelectItem>
                    <SelectItem value="ES">Espírito Santo</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="MA">Maranhão</SelectItem>
                    <SelectItem value="MT">Mato Grosso</SelectItem>
                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PA">Pará</SelectItem>
                    <SelectItem value="PB">Paraíba</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="PE">Pernambuco</SelectItem>
                    <SelectItem value="PI">Piauí</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="RO">Rondônia</SelectItem>
                    <SelectItem value="RR">Roraima</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="SE">Sergipe</SelectItem>
                    <SelectItem value="TO">Tocantins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 sm:col-span-2 md:col-span-1">
                <h3 className="mb-1">Cidade</h3>
                <Input
                  name="cidade"
                  value={endereco?.Cidade || ""}
                  placeholder="Cidade"
                  disabled
                />
              </div>
              <div className="col-span-1">
                <h3 className="mb-1">Número</h3>
                <Input
                  name="numero"
                  value={endereco?.Numero || ""}
                  placeholder="Número da residência"
                  disabled
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h3 className="mb-1">CEP</h3>
                <Input
                  name="cep"
                  value={endereco?.CEP || ""}
                  placeholder="CEP"
                  disabled
                />
              </div>
              <div className="col-span-3 sm:col-span-2 md:col-span-1">
                <h3 className="mb-1">Bairro</h3>
                <Input
                  name="bairro"
                  value={endereco?.Bairro || ""}
                  placeholder="Bairro"
                  disabled
                />
              </div>
              <div className="col-span-3 md:col-span-1">
                <h3 className="mb-1">Logradouro</h3>
                <Input
                  name="logradouro"
                  value={endereco?.Logradouro || ""}
                  placeholder="Rua/Avenida"
                  disabled
                />
              </div>
              <div className="col-span-3">
                <h3 className="mb-1">Complemento</h3>
                <Input
                  name="complemento"
                  value={endereco?.Complemento || ""}
                  placeholder="Complemento"
                  disabled
                />
              </div>
            </div>
              <div className="grid md:grid-cols-2 md:flex-row gap-3 col-span-3 mt-4">
                <Button
                  type="button"
                  color="danger"
                  onClick={() => setOpenConfirmacao(true)}
                  className="w-auto"
                  texto="deletar usuário"
                >
                  <Icon icon="material-symbols-light:delete-rounded" className="mr-2" />
                </Button>

                <Button
                  type="submit"
                  className="w-auto"
                  texto="Salvar Alterações"
                >
                  <Icon icon="material-symbols-light:save" className="mr-2" />
                </Button>
              </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openConfirmacao} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
              Confirme a sua ação.
            </DialogTitle>
            <DialogDescription className="text-center">
              Deseja realmente deletar o usuário?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
            <Button
              onClick={handleDelete}
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
              Usuário deletado com sucesso!
            </DialogTitle>
            <DialogDescription className="text-center">
              Clique no botão abaixo para voltar ao gerenciamento.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              onClick={closeSuccess}
              full_rounded
              color="success"
              className="w-full sm:max-w-[200px] px-5"
              texto="gerenciar"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BlankLayout>
  );
};

export default Perfil;
