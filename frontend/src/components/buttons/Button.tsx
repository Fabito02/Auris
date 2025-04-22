import { Button as ShadButton } from "../../components/ui/button";
import { Icon } from "@iconify-icon/react";
import { ReactNode, CSSProperties } from "react";
import "./Buttons.css";

interface ButtonProps {
  texto?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  href?: string;
  icon?: string;
  outline?: boolean;
  iconPosition?: "left" | "right" | "center";
  onClick?: () => void;
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "white" | "muted";
  style?: CSSProperties;
  full_rounded?: boolean;
}

const iconSeExistir = (icon: string | undefined, iconPosition?: "left" | "right" | "center") => {
  if (icon) {
    return <Icon icon={icon} className={`icon-button ${iconPosition ?? "left"}`} />;
  }
  return null;
};

export default function Button({
  texto,
  className = "",
  type = "button",
  children,
  href,
  icon,
  outline = false,
  iconPosition = "left",
  onClick,
  color = "primary",
  style,
  full_rounded
}: ButtonProps) {
  const estilo = `${outline ? "button-outline" : "button"} ${color} ${className} ${full_rounded ? "full-rounded" : ""}`.trim();

  const conteudo = (
    <>
      {iconPosition === "left" && iconSeExistir(icon, iconPosition)}
      {children}
      {iconPosition === "center" && iconSeExistir(icon, iconPosition)}
      {texto?.toUpperCase().trim()}
      {iconPosition === "right" && iconSeExistir(icon, iconPosition)}
    </>
  );

  const commonProps = {
    type,
    onClick,
    className: estilo,
    style,
  };

  if (href) {
    return (
      <ShadButton variant="ghost" asChild {...commonProps}>
        <a href={href}>{conteudo}</a>
      </ShadButton>
    );
  }

  return (
    <ShadButton variant="ghost" {...commonProps}>
      {conteudo}
    </ShadButton>
  );
}
