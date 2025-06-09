import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";

const Regulamento = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Regulamento";
    checkAuth(navigate, ["admin", "moderador", "user"]);
  }, []);

  return (
    <div className="mx-auto flex items-center justify-center">
      <div className="max-w-6xl mx-4 mb-12">
        <style>{`

        .containerRegulamento h1 {
          font-size: 2.4rem;
          font-weight: bold;
          color: var(--color-primary-dark);
          text-align: center;
        }

        .containerRegulamento span {
          font-size: 1.3rem;
          font-weight: bold;
          color: var(--color-primary-dark);
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        strong {
          color: var(--color-primary-dark);
        }

        .containerRegulamento p {
          margin: 1rem 0;
          font-size: 1rem;
        }

        .containerRegulamento ul {
          background-color: #00000007;
          padding: 1rem 1.5rem;
          border-left: 5px solid var(--color-primary);
          border-radius: 10px;
          margin: 1rem 0;
        }

        .containerRegulamento ul li {
          margin: 0.7rem 0;
        }

        .welcome-message {
          background-color: #1cb15813;
          color: #256029;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.1rem;
          font-weight: 500;
        }
      `}</style>

        <div className="px-8 containerRegulamento">
          <h1 className="my-12">Regulamento da Auris - Ouvidoria Digital</h1>
          <div className="welcome-message">
            Aqui você encontra o regulamento que estabelece as diretrizes e estratégias para o funcionamento e a gestão das atividades desenvolvidas pelo serviço de Ouvidoria do Instituto Federal do Norte de Minas Gerais - Campus Almenara.
          </div>

          <p>
            <span>
              <strong>Art. 1º.</strong>
            </span>{" "}
            O presente Regulamento estabelece as diretrizes, estratégias,
            objetivos e responsabilidades para o funcionamento e a gestão das
            atividades desenvolvidas pelo serviço de Ouvidoria do Instituto
            Federal do Norte de Minas Gerais - Campus Almenara.
          </p>

          <p>
            <span>
              <strong>Art. 2º.</strong>
            </span>{" "}
            O serviço de Ouvidoria do Instituto Federal do Norte de Minas Gerais
            é um setor diretamente subordinado ao Gabinete do Reitor, sendo
            responsável pelo aperfeiçoamento do serviço institucional junto aos
            segmentos da sociedade civil e aos diversos setores do Instituto
            Federal do Norte de Minas Gerais.
          </p>

          <p>
            <span>
              <strong>Art. 3º.</strong>
            </span>{" "}
            O serviço de Ouvidoria do IFNMG - Campus Almenara, atenderá aos
            usuários pessoalmente ou por telefone, de segunda à sexta-feira, das
            8 às 12 horas e das 14 às 18 horas, ou através do formulário
            on-line, disponível na Auris - Ouvidoria Digital do IFNMG - Campus
            Almenara.
          </p>

          <p>
            <span>
              <strong>Art. 4º.</strong> São objetivos do serviço de Ouvidoria do
              IFNMG - Campus Almenara:
            </span>
          </p>
          <ul>
            <li>
              I - Assegurar a participação da comunidade na instituição em vista
              do aperfeiçoamento das atividades nela desenvolvidas;
            </li>
            <li>
              II - Garantir ao cidadão/usuário resposta às suas manifestações;
            </li>
            <li>
              III - Atuar com autonomia, transparência, imparcialidade e de
              forma personalizada no controle da qualidade dos serviços e no
              exercício da cidadania;
            </li>
            <li>
              IV - Encaminhar as demandas sobre o funcionamento administrativo e
              acadêmico da Instituição, com o fim de contribuir para uma gestão
              institucional mais eficiente.
            </li>
          </ul>
          <p>
            <strong>Parágrafo único:</strong> As unidades envolvidas nas
            demandas terão até 15 (quinze) dias para manifestar-se sobre cada
            assunto, contados a partir do serviço de Ouvidoria do IFNMG - Campus
            Almenara.
          </p>
          <ul>
            <li>
              V - Exercer direito de anonimato aos manifestantes, visando a
              integridade do usuário.
            </li>
          </ul>

          <p>
            <span>
              <strong>Art. 5º.</strong> Compete à Ouvidoria do IFNMG - Campus
              Almenara:
            </span>
          </p>
          <ul>
            <li>
              I. Receber, examinar e encaminhar reclamações, sugestões, elogios
              e denúncias;
            </li>
            <li>
              II. Acompanhar as providências solicitadas, informando os
              resultados aos interessados;
            </li>
            <li>
              III. Identificar e interpretar o grau de satisfação dos usuários;
            </li>
            <li>
              IV. Propor soluções e oferecer recomendações às instâncias
              pedagógicas e administrativas;
            </li>
            <li>
              V. Realizar ações para apurar a procedência das reclamações e
              denúncias;
            </li>
            <li>
              VI. Requisitar informações junto aos setores e às unidades da
              Instituição;
            </li>
            <li>
              VII. Revisar, organizar, documentar e publicar os procedimentos
              relacionados à sua área.
            </li>
          </ul>

          <p>
            <span>
              <strong>Art. 6º.</strong>
            </span>{" "}
            O Ouvidor está subordinado diretamente ao Reitor.
          </p>

          <p>
            <span>
              <strong>Art. 7º.</strong> São deveres do Ouvidor:
            </span>
          </p>
          <ul>
            <li>
              I - Facilitar e simplificar o acesso do usuário ao serviço da
              Ouvidoria;
            </li>
            <li>II – Atuar na prevenção de conflitos;</li>
            <li>III - Atender com cortesia e respeito;</li>
            <li>IV – Agir com integridade, transparência e imparcialidade;</li>
            <li>V – Resguardar o sigilo dos usuários;</li>
            <li>VI - Promover a divulgação do serviço.</li>
          </ul>

          <p>
            <span>
              <strong>Art. 8º.</strong> São atribuições do Ouvidor:
            </span>
          </p>
          <ul>
            <li>I - Receber demandas de qualquer origem;</li>
            <li>II - Identificar as unidades envolvidas nas demandas;</li>
            <li>III - Diligenciar junto aos Campi envolvidos;</li>
            <li>IV - Prestar ao público as informações solicitadas;</li>
            <li>V - Registrar todas as solicitações;</li>
            <li>VI - Sugerir medidas de aperfeiçoamento;</li>
            <li>VII - Promover eventos sobre Ouvidoria;</li>
            <li>VIII - Realizar outras tarefas atribuídas pela Reitoria.</li>
          </ul>

          <p>
            <span>
              <strong>Art. 9º.</strong> Constituem motivos para a destituição do
              Ouvidor:
            </span>
          </p>
          <ul>
            <li>I - Perda do vínculo funcional com a instituição;</li>
            <li>II - Prática de atos que extrapolem sua competência;</li>
            <li>III - Descumprimento das obrigações definidas;</li>
            <li>IV – Conduta ética incompatível com a função.</li>
          </ul>

          <p>
            <span>
              <strong>Art. 10º.</strong> A Ouvidoria pode ser utilizada:
            </span>
          </p>
          <ul>
            <li>I – Por estudantes do IFNMG - Campus Almenara;</li>
            <li>
              II – Por servidores docentes e técnico-administrativos do IFNMG -
              Campus Almenara;
            </li>
          </ul>
          <p>
            <strong>§ 1º</strong> – Serão atendidas solicitações anônimas quando
            aplicável.
          </p>
          <p>
            <strong>§ 2º</strong> – Será garantido o sigilo sobre nome e dados
            pessoais.
          </p>

          <p>
            <span>
              <strong>Art. 11º.</strong> Todas as solicitações são documentadas
              em ordem cronológica, contendo:
            </span>
          </p>
          <ul>
            <li>I – Data do recebimento;</li>
            <li>II – Data da resposta;</li>
            <li>III – Nome do solicitante;</li>
            <li>IV – Endereço/telefone/e-mail do solicitante;</li>
            <li>V - Proveniência da demanda - aluno ou servidor;</li>
            <li>
              VI – Tipo de demanda – reclamação, sugestão, denúncia ou elogio;
            </li>
            <li>VII – Unidade envolvida;</li>
          </ul>

          <p>
            <span>
              <strong>Art. 12º.</strong>
            </span>{" "}
            A documentação pode ser acessada por um ano, com exceção dos dados
            sigilosos (Art. 11, incisos III e IV), mediante justificativa
            fundamentada.
          </p>

          <p>
            <span>
              <strong>Art. 13º.</strong>
            </span>{" "}
            A Ouvidoria encaminhará ao Reitor, mensalmente, relatório com
            informações sobre tipo de ocorrência, unidade envolvida, situação
            apresentada e resposta dada.
          </p>

          <p>
            <span>
              <strong>Art. 14º.</strong>
            </span>{" "}
            A Ouvidoria poderá divulgar na página inicial do site institucional
            informações gerais sobre o funcionamento da unidade.
          </p>

          <p>
            <span>
              <strong>Art. 15º.</strong> A divulgação conterá os seguintes dados
              gerais:
            </span>
          </p>
          <ul>
            <li>I – Orientações sobre acesso aos serviços;</li>
            <li>II – Descrição das atividades da unidade;</li>
            <li>III – Dados estatísticos gerais;</li>
            <li>IV – Distribuição mensal das demandas;</li>
            <li>
              V – Quantidade de demandas por tipo (reclamações, sugestões,
              denúncias ou elogios);
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Regulamento;
