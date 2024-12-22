import { DOCS_PAGES_ROOT_PATH } from "@/pages/docs/[...path]";
import classNames from "classnames";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import GridContainer, { NavAndFooterGridConfig } from "../grid-container";
import Link, { ButtonLink, SimpleLink } from "../link";
import NavTree, { BreakNode, LinkNode, NavTreeNode } from "../nav-tree";
import GhosttyWordmark from "./ghostty-wordmark.svg";
import s from "./Navbar.module.css";

export interface NavbarProps {
  className?: string;
  links?: SimpleLink[];
  cta?: SimpleLink;
  docsNavTree: NavTreeNode[];
}

const MOBILE_MENU_BREAKPOINT = 768;

export default function Navbar({
  className,
  links,
  cta,
  docsNavTree,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    function handleSizeUpdated() {
      if (window.innerWidth > MOBILE_MENU_BREAKPOINT && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleSizeUpdated);
    return () => window.removeEventListener("resize", handleSizeUpdated);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("noScroll");
      // Scroll to active item when mobile menu is opened, so it's not hidden
      if (activeItemRef.current && mobileContentRef.current) {
        const mobileContent = mobileContentRef.current;
        const activeItem = activeItemRef.current;
        const mobileContentRect = mobileContent.getBoundingClientRect();
        const activeItemRect = activeItem.getBoundingClientRect();

        if (
          activeItemRect.top < mobileContentRect.top ||
          activeItemRect.bottom > mobileContentRect.bottom
        ) {
          mobileContent.scrollTo({
            top:
              activeItem.offsetTop -
              mobileContent.offsetTop -
              mobileContentRect.height / 2 +
              activeItemRect.height / 2,
            behavior: "instant", // easing here felt... wrong
          });
        }
      }
    } else {
      document.body.classList.remove("noScroll");
    }
  }, [mobileMenuOpen]);

  return (
    <nav className={classNames(s.navbar, className)}>
      <GridContainer
        className={s.gridContainer}
        gridConfig={NavAndFooterGridConfig}
      >
        <NextLink href="/">
          <Image src={GhosttyWordmark} alt="Ghostty" />
        </NextLink>
        <div className={s.desktopLinks}>
          {links && (
            <ul className={s.linkList}>
              {links.map((link) => {
                return (
                  <li key={link.text}>
                    <Link
                      className={classNames({
                        [s.active]: pathname == link.href,
                      })}
                      {...link}
                    />
                  </li>
                );
              })}
            </ul>
          )}
          {cta && (
            <ButtonLink
              className={s.cta}
              size="large"
              theme="brand"
              href={cta.href}
              text={cta.text}
            />
          )}
        </div>
        <div
          className={s.menuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </div>
      </GridContainer>
      <div
        ref={mobileContentRef}
        className={classNames(s.mobileContent, {
          [s.mobileMenuOpen]: mobileMenuOpen,
        })}
      >
        <NavTree
          className={s.navTree}
          onNavLinkClicked={() => {
            setMobileMenuOpen(false);
          }}
          nodeGroups={[
            {
              rootPath: "",
              nodes: [
                // Adds our CTA first
                ...(cta
                  ? [
                      {
                        type: "link",
                        title: cta.text,
                        path: cta.href,
                        active: pathname === cta.href,
                      } as LinkNode,
                    ]
                  : []),
                // Next our Nav Links, but exclude docs, that's going to get
                // special treatment in the next node group below.
                ...(links
                  ? links
                      .filter((link) => link.href != "/docs")
                      .map((link) => {
                        return {
                          type: "link",
                          title: link.text,
                          path: link.href,
                          active: pathname === link.href,
                        } as LinkNode;
                      })
                  : []),

                { type: "break" } as BreakNode,
              ],
            },
            // Render the docs links
            {
              rootPath: DOCS_PAGES_ROOT_PATH,
              nodes: docsNavTree,
            },
          ]}
          activeItemRef={activeItemRef}
        />
      </div>
    </nav>
  );
}
