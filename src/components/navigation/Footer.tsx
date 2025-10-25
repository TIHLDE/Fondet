import { Separator } from "../ui/separator";
import Image from "next/image";
import Link from "next/link";
import FondetLogo from "../miscellaneous/FondetLogo";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaDiscord,
  FaSnapchatGhost,
} from "react-icons/fa";
import { SiNotion } from "react-icons/si";

const Footer = () => {
  const attributes = [
    { id: "email", key: "E-post", value: "hs@tihlde.org" },
    { id: "orgNumber", key: "Organisasjonsnummer", value: "989 684 183" },
    { id: "location", key: "Lokasjon", value: "c/o IDI NTNU" },
  ];

  const socials = [
    {
      id: "instagram",
      icon: <FaInstagram size={24} />,
      href: "https://instagram.com/tihlde",
    },
    {
      id: "facebook",
      icon: <FaFacebookF size={24} />,
      href: "https://facebook.com/tihlde",
    },
    {
      id: "notion",
      icon: <SiNotion size={24} />,
      href: "https://www.notion.so/tihlde/invite/442710f897b596ecd4f8e078cb25fcf76045125a",
    },
    {
      id: "discord",
      icon: <FaDiscord size={24} />,
      href: "https://discord.gg/HNt5XQdyxy",
    },
  ];

  return (
    <div className="px-4 py-16 md:px-20 md:py-16 w-full max-w-7xl mx-auto">
      <div className="flex flex-col items-center space-y-12 md:space-y-0 md:flex-row md:justify-between md:items-start w-full">
        {/* Left side - Tihlde logo with social icons */}
        <div className="flex flex-col items-center md:items-start space-y-6">
          <Link
            href="/"
            aria-label="Til forsiden"
            className="text-logo font-bold text-2xl"
          >
            <FondetLogo size="large" className="w-52 h-fit" />
          </Link>
          <div className="flex space-x-8">
            {socials.map((social) => (
              <Link
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.id}
                className="text-foreground-secondary hover:text-accent transition-colors"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Middle - Contact information */}
        <div className="space-y-4 md:items-start">
          <h3 className="text-3xl font-semibold">Kontakt</h3>
          {attributes.map((attribute) => (
            <div key={attribute.id}>
              <h4 className="text-sm">{attribute.key}</h4>
              {attribute.id === "email" ? (
                <a
                  href={`mailto:${attribute.value}`}
                  className="font-semibold hover:underline"
                >
                  {attribute.value}
                </a>
              ) : (
                <p className="font-semibold">{attribute.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Right side - Nito logo */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="text-2xl font-semibold text-center">Samarbeid</h3>
          {/* Show light logo in light mode, white logo in dark mode */}
          <div className="relative h-[46px] w-[200px]">
            <Image
              src={"/nito_logo_primaer_gronn_dyp.png"}
              alt="NITO Logo light"
              fill
              className="object-contain block dark:hidden"
              sizes="200px"
              priority={false}
            />
            <Image
              src={"/nito-logo-hvit.png"}
              alt="NITO Logo dark"
              fill
              className="object-contain hidden dark:block"
              sizes="200px"
              priority={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
