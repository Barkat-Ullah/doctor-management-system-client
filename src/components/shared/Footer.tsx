import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const menuItems = [
    { name: "Consultation", href: "#" },
    { name: "Health Plans", href: "#" },
    { name: "Medicine", href: "#" },
    { name: "Diagnostics", href: "#" },
    { name: "SOPs", href: "#" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-green-400">Nov</span>
              <span className="text-xl font-bold text-white">ena</span>
            </Link>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <link.icon size={20} />
                <span className="sr-only">{link.icon.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Novena Health Care. All Rights
            Reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-xs text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
