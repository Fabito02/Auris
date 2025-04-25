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
import "./Perfil.css";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import { checkAuth } from "@/api/auth";
import { User, Endereco } from "@/types/api";
import { getUsuarioAtual, getEnderecoUsuarioAtual } from "@/api/api_routes";

const Perfil = () => {
  const [user, setUser] = useState<User | null>(null);
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Perfil";
    const token = localStorage.getItem("auris_token");
    if (!token) {
      navigate("/errors/401");
    } else {
      checkAuth(navigate, ["admin", "moderador", "user"]);
    }

    const fetchUser = async () => {
      const usuario = await getUsuarioAtual();
      setUser(usuario.user);
    };

    fetchUser();

    const fetchEndereco = async () => {
      const endereco = await getEnderecoUsuarioAtual();
      setEndereco(endereco.endereco);
    };

    fetchEndereco();

    console.log(user);
  }, []);

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [name, setName] = useState("Seu Nome");
  const [email, setEmail] = useState("email@exemplo.com");
  const [phone, setPhone] = useState("(00) 00000-0000");

  const navigate = useNavigate();

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(null);
        setTimeout(() => {
          setOriginalImage(reader.result as string);
          setShowCropper(true);
        }, 50);
      };
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropSave = async () => {
    if (!originalImage || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(originalImage, croppedAreaPixels);
    setProfilePic(cropped);
    setOriginalImage(null);
    setShowCropper(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, phone, profilePic });
  };

  return (
    <BlankLayout showFooter={false} showHeader={true} showNavbar={true}>
      <div className="py-10 max-w-5xl mx-auto">
        <Card className="p-2 border-0 card-configuracoes shadow-none ">
          <CardContent className="">
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <div className="col-span-3 md:col-span-1 flex justify-center">
              <div className="relative w-[100%] w-[220px] h-[220px] aspect-[1/1] rounded-full overflow-hidden">
                <img
                  src={user?.Foto_Perfil || "/user_placeholder.png"}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
                <label
                  htmlFor="profilePicInput"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                >
                  <Icon icon="mdi:pencil" width={42} className="text-white" />
                </label>
                <input
                  id="profilePicInput"
                  type="file"
                  accept="image/*"
                  onChange={handlePicChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>
            </div>

              <div className="col-span-3 md:col-span-2 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h3 className="mb-1">Nome</h3>
                  <Input
                    type="text"
                    value={user?.Nome}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="col-span-1">
                  <h3 className="mb-1 mt-4">Permissão</h3>
                  <Input
                    type="text"
                    value={user?.Role}
                    disabled
                    placeholder="Seu SIAPE"
                  />
                </div>

                <div className="col-span-1">
                  <h3 className="mb-1 mt-4">SIAPE</h3>
                  <Input
                    type="text"
                    value={user?.SIAPE? user.SIAPE : "Sem SIAPE"}
                    disabled
                    placeholder="Seu SIAPE"
                  />
                </div>

                <div className="col-span-1 md:col-span-1">
                  <h3 className="mb-1">Tipo</h3>
                  <Input
                    type="text"
                    value={user?.Tipo}
                    disabled
                    placeholder="Seu tipo de usuário"
                  />
                </div>
              </div>

              <div className="col-span-3 lg:col-span-2">
                <h3 className="mb-1">Email</h3>
                <Input
                  type="email"
                  value={user?.Email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="col-span-3 sm:col-span-2 md:col-span-1">
                <h3 className="mb-1">Telefone</h3>
                <Input
                  type="tel"
                  value={user?.Telefone ? user.Telefone : ""}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="col-span-1">
                <h3 className="mb-1">Estado</h3>
                <Select value={endereco?.Estado} onValueChange={(value) => console.log(value)}>
                  <SelectTrigger className="custom-select w-full">
                    <SelectValue placeholder="Selecione seu estado" />
                  </SelectTrigger>
                  <SelectContent className="custom-select-content">
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
                  type="text"
                  value={endereco?.Cidade}
                  // onChange={(e) => }
                  placeholder="Sua cidade"
                />
              </div>

              <div className="col-span-1">
                <h3 className="mb-1">Número</h3>
                <Input
                  type="text"
                  value={endereco?.Numero}
                  // onChange={(e) => }
                  placeholder="Seu bairro"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h3 className="mb-1">CEP</h3>
                <Input
                  type="text"
                  value={endereco?.CEP}
                  // onChange={(e) => }
                  placeholder="Seu bairro"
                />
              </div>

              <div className="col-span-3 sm:col-span-2 md:col-span-1">
                <h3 className="mb-1">Bairro</h3>
                <Input
                  type="text"
                  value={endereco?.Bairro}
                  // onChange={(e) => }
                  placeholder="Seu bairro"
                />
              </div>

              <div className="col-span-3 md:col-span-1">
                <h3 className="mb-1">Logradouro</h3>
                <Input
                  type="text"
                  value={endereco?.Logradouro}
                  // onChange={(e) => }
                  placeholder="Seu bairro"
                />
              </div>

              <div className="col-span-3">
                <h3 className="mb-1">Complemento</h3>
                <Input
                  type="text"
                  value={endereco?.Complemento}
                  // onChange={(e) => }
                  placeholder="Seu bairro"
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
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-center items-center p-4">
          <div className="relative w-full max-w-md h-[400px] bg-black rounded-[20px] overflow-hidden">
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
          <div className="flex gap-4 mt-4">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              className="bg-green"
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <Button
              onClick={handleCropSave}
              texto="Salvar Recorte"
              color="success"
              className="bg-blue-500 text-white"
            />
            <Button
              onClick={() => setShowCropper(false)}
              texto="Cancelar"
              color="danger"
              className="bg-red-500 text-white"
            />
          </div>
        </div>
      )}
    </BlankLayout>
  );
};

export default Perfil;
