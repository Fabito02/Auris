import { ReactNode, useEffect } from "react";
import styles from "./BlankLayout.module.css";

interface BlankLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNavbar?: boolean;
  showFooter?: boolean;
  centerContent?: boolean;
  removeBodyPadding?: boolean;
}

export const BlankLayout = ({
  children,
  showHeader = false,
  showNavbar = false,
  showFooter = true,
  centerContent = false,
  removeBodyPadding = false,
}: BlankLayoutProps) => {
  useEffect(() => {
    const header = document.querySelector("header");
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");
    const body = document.body;

    const originalStyles = {
      header: { display: header?.style.display },
      navbar: { display: navbar?.style.display },
      footer: { display: footer?.style.display },
      body: { paddingTop: body.style.paddingTop },
    };

    if (!showHeader && header) header.style.display = "none";
    if (!showNavbar && navbar) navbar.style.display = "none";
    if (!showFooter && footer) footer.style.display = "none";
    if (removeBodyPadding) body.style.paddingTop = "0";

    return () => {
      if (header) header.style.display = originalStyles.header.display || "";
      if (navbar) navbar.style.display = originalStyles.navbar.display || "";
      if (footer) footer.style.display = originalStyles.footer.display || "";
      body.style.paddingTop = originalStyles.body.paddingTop || "";
    };
  }, [showHeader, showNavbar, showFooter, removeBodyPadding]);

  const layoutClass = centerContent
    ? `${styles.container} ${styles.centered}`
    : `${styles.container} ${styles.defaultLayout}`;

  return <div className={layoutClass}>{children}</div>;
};
