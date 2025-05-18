import { Icon } from "@iconify-icon/react";
import Button from "./buttons/Button";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const sections = [
    {
      title: "Páginas",
      items: [
        { name: "Página Inicial", link: "/" },
        { name: "Home", link: "/home" },
        { name: "Fale Conosco", link: "/fale-conosco" },
        { name: "Informações e FAQs", link: "/informacoes" },
        { name: "Políticas e Regulamentos", link: "/regulamento" },
      ],
      target: "",
    },
    {
      title: "Desenvolvedores",
      items: [
        {
          name: "Fabiano Júnior - Design, Frontend, Backend",
          link: "https://github.com/Fabito02/",
        },
        {
          name: "Francisco Rodrigues - Design, Backend",
          link: "https://github.com/FranSRodrigues/",
        },
        {
          name: "Pablo Messias - Design, Backend",
          link: "https://github.com/PabloMessias007/",
        },
        { name: "Bruno Araújo - Design, Backend", link: "https://github.com/EoBrunin/" },
      ],
      target: "blank",
    },
  ];

  return (
    <footer className="footer-container">
      <div className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-2">
            <img
              src="/Logo - Footer.svg"
              alt="Logo Auris"
              className="logo-footer"
            />
          </div>

          {sections.map((section, idx) => (
            <div key={idx} className="md:col-span-3">
              <h5 className="text-white font-semibold mb-4">{section.title}</h5>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.link}
                      className="text-white hover:text-gray-400 text-sm"
                      target={section.target}
                      rel="noopener noreferrer"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-4">
            <h5 className="text-white font-semibold mb-4">
              Visite o site oficial do IFNMG - Campus Almenara
            </h5>
            <p className="text-white mb-6 text-sm">
              Encontre informações acadêmicas, administrativas e as últimas
              notícias do campus Almenara.
            </p>
            <Button
              href="https://almenara.ifnmg.edu.br/"
              texto="VISITAR SITE"
              icon="mdi:world-wide-web"
              className="mb-0"
            />
          </div>
        </div>

        <div className="mt-8 border-t border-gray-400 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm">
            &copy; 2025 IFNMG - Campus Almenara. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://www.youtube.com/c/IFNMGCampusAlmenara"
              className="text-white hover:text-red-600"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="mdi:youtube" width="24" height="24" />
            </a>
            <a
              href="https://www.instagram.com/almenara_ifnmg/"
              className="text-white hover:text-pink-500"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="ri:instagram-fill" width="24" height="24" />
            </a>
            <a
              href="https://www.facebook.com/IFNMGoficial"
              className="text-white hover:text-blue-500"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="mdi:facebook" width="24" height="24" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
