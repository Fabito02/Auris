import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { BlankLayout } from "../../components/BlankLayout/BlankLayout";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import Button from "../../components/buttons/Button";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import { checkAuth } from "@/api/auth";
import { User, Endereco } from "@/types/api";
import {
  getEnderecoUsuarioAtual,
  updateEnderecoUsuarioAtual,
  updateUsuarioAtual,
  updateAvatarUsuarioAtual,
} from "@/api/api_routes";
import { toast } from "sonner";
import "./Perfil.css";
import { useUsuarioAtual } from "@/hooks/useUsuarioAtual";
import { URL_BASE_AVATAR } from "@/config";

const Perfil: React.FC = () => {
  const user = useUsuarioAtual();

  const navigate = useNavigate();
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Perfil";
    checkAuth(navigate, ["admin", "moderador", "user"]);
    (async () => {
      const respEnd = await getEnderecoUsuarioAtual();
      setEndereco(respEnd.endereco);
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

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(null);
      setTimeout(() => {
        setOriginalImage(reader.result as string);
        setShowCropper(true);
      }, 50);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onCropComplete = useCallback((_: unknown, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    if (!originalImage || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(originalImage, croppedAreaPixels);
    setProfilePic(cropped);
    setShowCropper(false);
    setOriginalImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const dados = Object.fromEntries(formData.entries());
    const enderecoData: Partial<Endereco> = {
      CEP: dados.cep?.toString() || "",
      Estado: dados.estado?.toString() || "",
      Cidade: dados.cidade?.toString() || "",
      Bairro: dados.bairro?.toString() || "",
      Logradouro: dados.logradouro?.toString() || "",
      Numero: dados.numero?.toString() || "",
      Complemento: dados.complemento?.toString() || "",
    };
    const usuarioData: Partial<User> = {
      Nome: dados.nome?.toString() || "",
      Telefone: dados.telefone?.toString() || "",
    };
    try {
      if (profilePic && profilePic.startsWith("data:")) {
        const blob = await fetch(profilePic).then((r) => r.blob());
        const file = new File([blob], "avatar.png", { type: blob.type });
        await updateAvatarUsuarioAtual(file);
      }
      await updateUsuarioAtual(usuarioData);
      await updateEnderecoUsuarioAtual(enderecoData);
      toast.success("Usuário atualizado com sucesso!", {
        icon: (
          <Icon
            icon="mdi:check-circle"
            height={20}
            className="text-[var(--color-success)]"
          />
        ),
      });
    } catch (err: any) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error, {
          icon: (
            <Icon
              icon="mdi:alert-circle"
              height={20}
              className="text-[var(--color-danger)]"
            />
          ),
        });
      } else {
        console.error(err);
        toast.error("Erro ao atualizar usuário!", {
          icon: (
            <Icon
              icon="mdi:alert-circle"
              height={20}
              className="text-[var(--color-danger)]"
            />
          ),
        });
      }
    }
  };

  return (
    <BlankLayout showFooter={false} showHeader showNavbar>
      <div className="pb-10 max-w-5xl mt-[6vh] mx-auto">
        <Card className="p-2 border-0 shadow-none">
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
              <div className="col-span-3 md:col-span-1 flex justify-center">
                <div className="relative w-[220px] h-[220px] rounded-full overflow-hidden">
                  <img
                    src={profilePic || "/user_placeholder.png"}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                  <label
                    htmlFor="imageInput"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                  >
                    <Icon
                      icon="material-symbols:edit-outline-rounded"
                      width={42}
                      className="text-white"
                    />
                  </label>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handlePicChange}
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
                    defaultValue={user?.Nome || ""}
                    placeholder="Seu nome completo"
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
                  defaultValue={user?.Email || ""}
                  disabled
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="col-span-3 sm:col-span-2 md:col-span-1">
                <h3 className="mb-1">Telefone</h3>
                <Input
                  name="telefone"
                  defaultValue={user?.Telefone || ""}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="col-span-1">
                <h3 className="mb-1">Estado</h3>
                <Select
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
                  defaultValue={endereco?.Cidade || ""}
                  placeholder="Sua cidade"
                />
              </div>
              <div className="col-span-1">
                <h3 className="mb-1">Número</h3>
                <Input
                  name="numero"
                  defaultValue={endereco?.Numero || ""}
                  placeholder="Número da residência"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h3 className="mb-1">CEP</h3>
                <Input
                  name="cep"
                  defaultValue={endereco?.CEP || ""}
                  placeholder="Seu CEP"
                />
              </div>
              <div className="col-span-3 sm:col-span-2 md:col-span-1">
                <h3 className="mb-1">Bairro</h3>
                <Input
                  name="bairro"
                  defaultValue={endereco?.Bairro || ""}
                  placeholder="Seu bairro"
                />
              </div>
              <div className="col-span-3 md:col-span-1">
                <h3 className="mb-1">Logradouro</h3>
                <Input
                  name="logradouro"
                  defaultValue={endereco?.Logradouro || ""}
                  placeholder="Rua/Avenida"
                />
              </div>
              <div className="col-span-3">
                <h3 className="mb-1">Complemento</h3>
                <Input
                  name="complemento"
                  defaultValue={endereco?.Complemento || ""}
                  placeholder="Complemento"
                />
              </div>
              <div className="grid md:grid-cols-2 md:flex-row gap-3 col-span-3">
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => navigate("/alterar-senha")}
                  className="w-auto"
                  texto="Alterar Senha"
                >
                  <Icon icon="mdi:lock-reset" className="mr-2" />
                </Button>

                <Button
                  type="submit"
                  className="w-auto"
                  texto="Salvar Alterações"
                >
                  <Icon icon="material-symbols-light:save" className="mr-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {showCropper && originalImage && (
        <div className="fixed inset-0 bg-black/65 z-50 flex flex-col justify-center items-center p-4 backdrop-blur">
          <div className="relative w-full max-w-lg h-[400px] overflow-hidden bg-white rounded-t-[1rem] rounded-b-none">
            <Cropper
              image={originalImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-lg w-full bg-black/40 rounded-b-[1rem] p-4">
            <input
              type="range"
              min={1}
              max={5}
              step={0.1}
              defaultValue={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="col-span-2"
            />
            <Button
              onClick={() => setShowCropper(false)}
              texto="Cancelar"
              color="danger"
              className="col-span-1"
            />
            <Button
              onClick={handleCropSave}
              texto="Salvar Recorte"
              color="success"
              className="col-span-1"
            />
          </div>
        </div>
      )}
    </BlankLayout>
  );
};

export default Perfil;
