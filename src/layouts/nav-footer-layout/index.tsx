import { SimpleLink } from "@/components/link";
import Navbar from "@/components/navbar";
import RootLayout, { RootLayoutProps } from "../root-layout";
import Footer from "@/components/footer";

const navLinks: Array<SimpleLink> = [
  {
    text: "About",
    href: "/",
  },
  {
    text: "Docs",
    href: "/docs",
  },
  {
    text: "Discord",
    href: "https://discord.gg/ghostty",
  },
  {
    text: "Github",
    href: "https://github.com/ghostty-org/ghostty",
  },
];

export default function NavFooterLayout(props: RootLayoutProps) {
  const { children, ...otherProps } = props;
  return (
    <RootLayout {...otherProps}>
      <Navbar
        links={navLinks}
        cta={{
          href: "/download",
          text: "Download",
        }}
      />
      {children}
      <Footer links={navLinks} copyright="© Ghostty 2024" />
    </RootLayout>
  );
}
