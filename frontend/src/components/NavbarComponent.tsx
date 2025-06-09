import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavbarComponent.css";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Icon } from "@iconify-icon/react";
import { checkRole } from "../api/auth";

const NavbarComponent = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [permissao, setPermissao] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.current) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    const checkPermissao = async () => {
      const isAdmin = await checkRole("admin");
      setPermissao(isAdmin);
      if (!isAdmin) {
        const isModerador = await checkRole("moderador");
        setPermissao(isModerador);
      }
    };
    checkPermissao();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    document.getElementById("link-home")?.classList.remove("active");
    document.getElementById("link-fale-conosco")?.classList.remove("active");
    document.getElementById("link-informacoes")?.classList.remove("active");
    document.getElementById("link-regulamento")?.classList.remove("active");
    document.getElementById("link-gerenciar")?.classList.remove("active");
    document.getElementById("link-acompanhamento")?.classList.remove("active");

    const page = location.pathname.split("/")[1];
    const pageAdmin = location.pathname.split("/admin/")[1];

    if (page === "home") {
      document.getElementById("link-home")?.classList.add("active");
    } else if (page === "fale-conosco") {
      document.getElementById("link-fale-conosco")?.classList.add("active");
    } else if (page === "informacoes") {
      document.getElementById("link-informacoes")?.classList.add("active");
    } else if (page === "regulamento") {
      document.getElementById("link-regulamento")?.classList.add("active");
    } else if (pageAdmin === "gerenciar") {
      document.getElementById("link-gerenciar")?.classList.add("active");
    } else if (pageAdmin === "acompanhamento") {
      document.getElementById("link-acompanhamento")?.classList.add("active");
    }
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-[65px] left-0 w-full z-50 bg-white border-t border-b py-1.5 lg:flex justify-between mx-auto px-4 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ height: "45px" }}
    >
      <div className="hidden xl:flex space-x-4 justify-center w-full">
        <Link to="/home" className="link-navbar active" id="link-home">
          HOME
        </Link>
        <Link to="/fale-conosco" className="link-navbar" id="link-fale-conosco">
          FALE CONOSCO
        </Link>
        <Link to="/informacoes" className="link-navbar" id="link-informacoes">
          INFORMAÇÕES E FAQs
        </Link>
        <Link to="/regulamento" className="link-navbar" id="link-regulamento">
          POLÍTICAS E REGULAMENTOS
        </Link>
        {permissao && (
          <>
            <div className="border-r"></div>
            <Link
              to="/admin/gerenciar"
              className="link-navbar"
              id="link-gerenciar"
            >
              GERENCIAR
            </Link>
            <Link
              to="/admin/acompanhamento"
              className="link-navbar"
              id="link-acompanhamento"
            >
              ACOMPANHAMENTO
            </Link>
          </>
        )}
      </div>
      <div className="xl:hidden ml-auto flex items-center justify-end">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="focus:outline-none">
            <Icon
              icon="heroicons-solid:menu-alt-3"
              height="30px"
              className="text-gray-700"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="menu-mobile-content mt-1 mr-2 border-0">
            <Link to="/home">
              <DropdownMenuItem className="link-navbar-menu">
                HOME
              </DropdownMenuItem>
            </Link>
            <Link to="/fale-conosco">
              <DropdownMenuItem className="link-navbar-menu">
                FALE CONOSCO
              </DropdownMenuItem>
            </Link>
            <Link to="/informacoes">
              <DropdownMenuItem className="link-navbar-menu">
                INFORMAÇÕES E FAQs
              </DropdownMenuItem>
            </Link>
            <Link to="/regulamento">
              <DropdownMenuItem className="link-navbar-menu">
                POLÍTICAS EREGULAMENTOS
              </DropdownMenuItem>
            </Link>
            {permissao && (
              <>
                <div className="border-t my-2 rounded-[0]"></div>
                <Link to="/admin/gerenciar">
                  <DropdownMenuItem className="link-navbar-menu">
                    GERENCIAR
                  </DropdownMenuItem>
                </Link>
                <Link to="/admin/acompanhamento">
                  <DropdownMenuItem className="link-navbar-menu">
                    ACOMPANHAMENTO
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavbarComponent;
