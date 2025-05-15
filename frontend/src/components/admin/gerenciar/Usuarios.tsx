import { Card, CardContent } from "@/components/ui/card";
import { getUsuarios } from "@/api/api_routes";
import { useEffect, useState, useMemo } from "react";
import { User } from "@/types/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify-icon/react";
import { getAvatar } from "@/api/api_routes";
import { useNavigate } from "react-router-dom";
import Button from "@/components/buttons/Button";
import AnimarAoVer from "@/components/AnimarAoVer";

export default function Component() {
  const navigate = useNavigate();

  const [Users, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [avatars, setAvatars] = useState<Record<number, string>>({});

  useEffect(() => {
    getUsuarios().then((res) => {
      setUsuarios(res.data);
    });
  }, []);

  useEffect(() => {
    async function fetchAvatars() {
      const avatarPromises = Users.map(async (user: User) => {
        try {
          const res = await getAvatar(user.User_ID || 0);
          return {
            id: user.User_ID,
            url: res?.avatarUrl || "/user_placeholder.png",
          };
        } catch (error) {
          return { id: user.User_ID, url: "/user_placeholder.png" };
        }
      });

      const avatarResults = await Promise.all(avatarPromises);
      const avatarMap: Record<number, string> = {};
      avatarResults.forEach(({ id, url }) => {
        avatarMap[id as number] = url;
      });

      setAvatars(avatarMap);
    }

    if (Users.length > 0) {
      fetchAvatars();
    }
  }, [Users]);

  const usersFiltrados = useMemo(() => {
    return Users.filter(
      (user: User) =>
        user.Role?.toLowerCase().includes(search.toLowerCase()) ||
        user.Nome.toString().toLowerCase().includes(search.toLowerCase()) ||
        user.Email.toString().toLowerCase().includes(search.toLowerCase()) ||
        user.Tipo?.toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [search, Users]);

  return (
    <Card className="border-0 shadow-none flex items-center">
      <CardContent className="w-full max-w-[950px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl my-6 font-[500]">Usuários</h1>
        <div className="relative">
          <Icon
            icon="lucide:search"
            height={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Pesquisar por nome, email, tipo ou permissão..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-[calc(100%-55px)] md:max-w-md pl-9"
          />
          <Button
            iconPosition="center"
            icon="ic:round-plus"
            color="secondary"
            className="p-0 w-9 h-9 absolute right-0 top-1/2 transform -translate-y-1/2"
            onClick={() => navigate("/admin/adicionar-usuario")}
          ></Button>
        </div>
        <div className="flex flex-col gap-4">
          {usersFiltrados
            .slice()
            .reverse()
            .map((User: User) => (
              <AnimarAoVer>
                <Card
                  key={User.User_ID}
                  className="grid grid-cols-6 items-center gap-2 p-3 cursor-pointer hover:bg-[var(--color-cinza-semitransparente-claro)]"
                  style={{ transition: "background-color 0.3s ease-in-out" }}
                  onClick={() =>
                    navigate(`/admin/gerenciar/${User.User_ID}/perfil`)
                  }
                >
                  <div className="flex items-center col-span-5">
                    <Avatar className="h-[65px] w-[65px]">
                      <AvatarImage
                        src={
                          avatars[User.User_ID || 0] ?? "/user_placeholder.png"
                        }
                      />
                    </Avatar>
                    <div className="grid grid-rows-2 pl-2">
                      <p className="text-base pt-2">{User.Nome}</p>
                      <p className="text-sm pb-2 self-end text-muted-foreground">
                        {User.Email}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 grid grid-rows-2 mr-2">
                    <p className="text-sm text-right pb-2 text-[var(--color-muted)]">
                      {User.Tipo
                        ? User.Tipo.charAt(0).toUpperCase() + User.Tipo.slice(1)
                        : ""}
                    </p>
                    <p
                      className={`text-sm text-right pt-2 ${
                        User.Role === "admin"
                          ? "text-[var(--color-danger)]"
                          : User.Role === "moderador"
                          ? "text-[var(--color-warning)]"
                          : "text-[var(--color-success)]"
                      }`}
                    >
                      {User.Role
                        ? User.Role.charAt(0).toUpperCase() + User.Role.slice(1)
                        : ""}
                    </p>
                  </div>
                </Card>
              </AnimarAoVer>
            ))}

          {usersFiltrados.length === 0 && (
            <div className="text-muted-foreground mt-4 w-full text-center ">
              Nenhum usuário encontrado.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
