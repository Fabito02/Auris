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
    <div>
      <h1>Bem-vindo ao Regulamento do site</h1>

      <h1>REGULAMENTO DA AURIS - OUVIDORIA DIGITAL DO IFNMG - CAMPUS ALMENARA</h1>

      <p><strong>Art. 1º.</strong> O presente Regulamento estabelece as diretrizes, estratégias, objetivos e responsabilidades para o funcionamento e a gestão das atividades desenvolvidas pelo serviço de Ouvidoria do Instituto Federal do Norte de Minas Gerais - Campus Almenara.</p>

      <p><strong>Art. 2º.</strong> O serviço de Ouvidoria do Instituto Federal do Norte de Minas Gerais é um setor diretamente subordinado ao Gabinete do Reitor, sendo responsável pelo aperfeiçoamento do serviço institucional junto aos segmentos da sociedade civil e aos diversos setores do Instituto Federal do Norte de Minas Gerais.</p>

      <p><strong>Art. 3º.</strong> O serviço de Ouvidoria do IFNMG - Campus Almenara, atenderá aos usuários pessoalmente ou por telefone, de segunda à sexta-feira, das 8 às 12 horas e das 14 às 18 horas, ou através do formulário on-line, disponível na Auris - Ouvidoria Digital do IFNMG - Campus Almenara.</p>

      <p><strong>Art. 4º.</strong> São objetivos do serviço de Ouvidoria do IFNMG - Campus Almenara:</p>
      <ul>
        <li>I - Assegurar a participação da comunidade na instituição em vista do aperfeiçoamento das atividades nela desenvolvidas;</li>
        <li>II - Garantir ao cidadão/usuário resposta às suas manifestações;</li>
        <li>III - Atuar com autonomia, transparência, imparcialidade e de forma personalizada no controle da qualidade dos serviços e no exercício da cidadania;</li>
        <li>IV - Encaminhar as demandas sobre o funcionamento administrativo e acadêmico da Instituição, com o fim de contribuir para uma gestão institucional mais eficiente.</li>
      </ul>

      <p><strong>Parágrafo único:</strong> As unidades envolvidas nas demandas terão até 15 (quinze) dias para manifestar-se sobre cada assunto, contados a partir do serviço de Ouvidoria do IFNMG - Campus Almenara.</p>
      <ul>
        <li>V - Exercer direito de anonimato aos manifestantes, visando a integridade do usuário.</li>
      </ul>

      <p><strong>Art. 5º.</strong> Compete à Ouvidoria do IFNMG - Campus Almenara:</p>
      <ul>
        <li>I. Receber, examinar e encaminhar reclamações, sugestões, elogios e denúncias;</li>
        <li>II. Acompanhar as providências solicitadas, informando os resultados aos interessados;</li>
        <li>III. Identificar e interpretar o grau de satisfação dos usuários;</li>
        <li>IV. Propor soluções e oferecer recomendações às instâncias pedagógicas e administrativas;</li>
        <li>V. Realizar ações para apurar a procedência das reclamações e denúncias;</li>
        <li>VI. Requisitar informações junto aos setores e às unidades da Instituição;</li>
        <li>VII. Revisar, organizar, documentar e publicar os procedimentos relacionados à sua área.</li>
      </ul>

      <p><strong>Art. 6º.</strong> O Ouvidor está subordinado diretamente ao Reitor.</p>

      <p><strong>Art. 7º.</strong> São deveres do Ouvidor:</p>
      <ul>
        <li>I - Facilitar e simplificar o acesso do usuário ao serviço da Ouvidoria;</li>
        <li>II – Atuar na prevenção de conflitos;</li>
        <li>III - Atender com cortesia e respeito;</li>
        <li>IV – Agir com integridade, transparência e imparcialidade;</li>
        <li>V – Resguardar o sigilo dos usuários;</li>
        <li>VI - Promover a divulgação do serviço.</li>
      </ul>

      <p><strong>Art. 8º.</strong> São atribuições do Ouvidor:</p>
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

      <p><strong>Art. 9º.</strong> Constituem motivos para a destituição do Ouvidor:</p>
      <ul>
        <li>I - Perda do vínculo funcional com a instituição;</li>
        <li>II - Prática de atos que extrapolem sua competência;</li>
        <li>III - Descumprimento das obrigações definidas;</li>
        <li>IV – Conduta ética incompatível com a função.</li>
      </ul>

      <p><strong>Art. 10º.</strong> A Ouvidoria pode ser utilizada:</p>
      <ul>
        <li>I – Por estudantes do IFNMG - Campus Almenara;</li>
        <li>II – Por servidores docentes e técnico-administrativos do IFNMG - Campus Almenara;</li>
      </ul>

      <p><strong>§ 1º.</strong> Serão atendidas solicitações anônimas quando aplicável.</p>
      <p><strong>§ 2º.</strong> Será garantido o sigilo sobre nome e dados pessoais.</p>

      <p><strong>Art. 11º.</strong> Todas as solicitações são documentadas em ordem cronológica, contendo:</p>
      <ul>
        <li>I – Data do recebimento;</li>
        <li>II – Data da resposta;</li>
        <li>III – Nome do solicitante;</li>
        <li>IV – Endereço/telefone/e-mail do solicitante;</li>
        <li>V - Proveniência da demanda - aluno ou servidor;</li>
        <li>VI – Tipo de demanda – reclamação, sugestão, denúncia ou elogio;</li>
        <li>VII – Unidade envolvida;</li>
      </ul>

      <p><strong>Art. 12º.</strong> A documentação pode ser acessada por um ano, com exceção dos dados sigilosos (Art. 11, incisos III e IV), mediante justificativa fundamentada.</p>

      <p><strong>Art. 13º.</strong> A Ouvidoria encaminhará ao Reitor, mensalmente, relatório com informações sobre tipo de ocorrência, unidade envolvida, situação apresentada e resposta dada.</p>

      <p><strong>Art. 14º.</strong> A Ouvidoria poderá divulgar na página inicial do site institucional informações gerais sobre o funcionamento da unidade.</p>

      <p><strong>Art. 15º.</strong> A divulgação conterá os seguintes dados gerais:</p>
      <ul>
        <li>I – Orientações sobre acesso aos serviços;</li>
        <li>II – Descrição das atividades da unidade;</li>
        <li>III – Dados estatísticos gerais;</li>
        <li>IV – Distribuição mensal das demandas;</li>
        <li>V – Quantidade de demandas por tipo (reclamações, sugestões, denúncias ou elogios);</li>
      </ul>
    </div>
  );
};

export default Regulamento;
