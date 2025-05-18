import { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { toast } from "sonner";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./Search.css";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { getManifestacoesDoUsuario } from "@/api/api_routes";
import { Manifestacao } from "@/types/api";

const SearchBar = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const navigate = useNavigate();

  const [visibilidade, setVisibilidade] = useState(false);
  const [busca, setBusca] = useState("");
  const [manifestacoes, setManifestacoes] = useState<Manifestacao[]>([]);

  useEffect(() => {
    if (visibilidade) {
      (async () => {
        const response = await getManifestacoesDoUsuario();
        setManifestacoes([response.data]);
      })();
    }
  }, [visibilidade]);

  useEffect(() => {
    if (transcript) {
      setBusca(transcript);
      setVisibilidade(true);
      SpeechRecognition.stopListening();
    }
  }, [transcript]);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.info("Seu navegador não suporta reconhecimento de voz.", {
        icon: (
          <Icon
            icon="mdi:information"
            height={20}
            className="text-[var(--color-info)]"
          />
        ),
      });
      return;
    }
    if (!isMicrophoneAvailable) {
      toast.warning(
        "Microfone não disponível, ative a permissão. Você ainda pode digitar sua pesquisa.",
        {
          icon: (
            <Icon
              icon="mdi:microphone-off"
              height={20}
              className="text-[var(--color-warning)]"
            />
          ),
        }
      );
      return;
    }
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: false,
        language: "pt-BR",
      }).catch((error?: unknown) => {
        console.error("Erro ao iniciar reconhecimento de voz:", error);
        toast.error(
          "Erro ao acessar o microfone. Você ainda pode digitar sua pesquisa.",
          {
            icon: (
              <Icon
                icon="mdi:alert-circle"
                height={20}
                className="text-[var(--color-danger)]"
              />
            ),
          }
        );
      });
    }
  };

  const resultadosBase = [
    {
      grupo: "Fale conosco",
      label: "Reclamação",
      icon: "material-symbols:feedback-rounded",
      color: "var(--color-danger)",
      pagina: "/fale-conosco/reclamacao",
    },
    {
      grupo: "Fale conosco",
      label: "Elogio",
      icon: "material-symbols:thumb-up-rounded",
      color: "var(--color-danger)",
      pagina: "/fale-conosco/elogio",
    },
    {
      grupo: "Fale conosco",
      label: "Denúncia",
      icon: "material-symbols:report-rounded",
      color: "var(--color-danger)",
      pagina: "/fale-conosco/denuncia",
    },
    {
      grupo: "Fale conosco",
      label: "Sugestão",
      icon: "material-symbols:lightbulb-rounded",
      color: "var(--color-danger)",
      pagina: "/fale-conosco/sugestao",
    },
    {
      grupo: "Configurações",
      label: "Minhas Manifestações",
      icon: "material-symbols:record-voice-over-rounded",
      color: "var(--color-primary)",
      pagina: "/minhas-manifestacoes",
    },
    {
      grupo: "Configurações",
      label: "Configurações",
      icon: "material-symbols:settings-rounded",
      color: "var(--color-primary)",
      pagina: "/perfil",
    },
  ];

  // junta base + as manifestações do usuário
  const todosResultados = [
    ...manifestacoes.map((m) => ({
      grupo: "Suas manifestações",
      label: m.Titulo,
      icon: "material-symbols:article-rounded",
      color: "var(--color-secondary)",
      pagina: `/manifestacoes/${m.Manifestacao_ID}`,
    })),
    ...resultadosBase,
  ];

  const resultadosFiltrados = todosResultados.filter((item) =>
    item.label?.toLowerCase().includes(busca.toLowerCase())
  );

  const grupos = Array.from(new Set(resultadosFiltrados.map((r) => r.grupo)));

  return (
    <div className="container-search">
      <Command className="flex items-center relative search-input-container">
        <CommandInput
          placeholder="Pesquisar..."
          className="flex-grow search-input"
          style={{ borderRadius: "14px", fontSize: "15px", height: "38px" }}
          value={busca}
          onValueChange={(value) => setBusca(value)}
          onFocus={() => setVisibilidade(true)}
          onBlur={() => setVisibilidade(false)}
        />

        <Icon
          icon={listening ? "material-symbols:mic-off" : "material-symbols:mic"}
          className="absolute right-1 microphone-icon flex items-center justify-center h-[100%] aspect-square"
          onClick={toggleListening}
          style={{
            fontSize: "22px",
            color: listening ? "var(--color-secondary)" : "#00000075",
            cursor: "pointer",
          }}
          aria-label={listening ? "Parar gravação" : "Iniciar gravação"}
          role="button"
          tabIndex={0}
        />
        <CommandList
          className={`left-1/2 transform -translate-x-1/2 w-full max-w-[500px] max-h-[600px] lista-comandos-searchbar rounded-lg fixed shadow-lg bg-white mt-15 mr-4 ${
            visibilidade ? "visivel" : ""
          }`}
        >
          {resultadosFiltrados.length === 0 ? (
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          ) : (
            grupos.map((grupo) => (
              <div key={grupo}>
                <CommandGroup heading={grupo}>
                  {resultadosFiltrados
                    .filter((item) => item.grupo === grupo)
                    .map((item) => (
                      <CommandItem
                        key={item.label}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => navigate(item.pagina)}
                        onClick={() => navigate(item.pagina)}
                        className="search-item"
                      >
                        <Icon
                          icon={item.icon}
                          className="text-[var(--color-secondary)]"
                          style={{ color: item.color }}
                        />
                        <span>{item.label}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
              </div>
            ))
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default SearchBar;
