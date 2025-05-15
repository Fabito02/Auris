import { Card, CardContent } from "@/components/ui/card";
import { getUsuarios } from "@/api/api_routes";
import { useEffect, useState, useMemo } from "react";
import { User } from "@/types/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify-icon/react";
import { toast } from "sonner";
import { updateRole } from "@/api/api_routes";
import { getAvatar } from "@/api/api_routes";
import AnimarAoVer from "@/components/AnimarAoVer";

export default function Component() {
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

  const handleRoleChange = async (User_ID: number, Role: User["Role"]) => {
    try {
      await updateRole({ User_ID, Role });
      toast.success("Permissão atualizada com sucesso", {
        icon: (
          <Icon
            icon="mdi:check-circle"
            height={20}
            className="text-[var(--color-success)]"
          />
        ),
      });
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error);
      toast.error("Erro ao atualizar permissão!", {
        icon: (
          <Icon
            icon="mdi:alert-circle"
            height={20}
            className="text-[var(--color-danger)]"
          />
        ),
      });
    }
  };

  const usersFiltrados = useMemo(() => {
    return Users.filter(
      (user: User) =>
        user.Role?.toLowerCase().includes(search.toLowerCase()) ||
        user.Nome.toString().toLowerCase().includes(search.toLowerCase()) ||
        user.Email.toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [search, Users]);

  return (
    <Card className="border-0 shadow-none flex items-center">
      <CardContent className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl my-6 font-[500]">Gerenciar Permissões</h1>
        <div className="relative">
          <Icon
            icon="lucide:search"
            height={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Pesquisar por nome, email ou permissão..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 md:max-w-md pl-9"
          />
        </div>
        <div className="flex flex-col gap-4">
          {usersFiltrados
            .slice()
            .reverse()
            .map((User: User) => (
              <AnimarAoVer>
                <Card
                  key={User.User_ID}
                  className="grid grid-cols-2 items-center gap-2 p-3"
                >
                  <div className="flex items-center">
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
                  <div className="col-span-2 sm:col-span-1">
                    <Select
                      defaultValue={User.Role}
                      onValueChange={(
                        valor: "user" | "admin" | "moderador"
                      ) => {
                        handleRoleChange(Number(User.User_ID), valor);
                      }}
                    >
                      <SelectTrigger className="ml-auto mr-2 mt-2 sm:mt-0 w-full sm:w-[180px]">
                        <SelectValue placeholder="Permissão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="moderador">Moderador</SelectItem>
                      </SelectContent>
                    </Select>
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
