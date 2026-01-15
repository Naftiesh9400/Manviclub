import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/manvi2.png";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Tournaments", href: "#tournaments" },
    { name: "Membership", href: "#membership" },
    { name: "Gallery", href: "#" },
    { name: "Blog", href: "#" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Feedback", href: "#" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Refund Policy", href: "#" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer id="footer" className="bg-white text-primary border-t border-primary/10">
      {/* Main Footer */}
      <div className="container-custom section-padding pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Manvi Fishing Club" className="w-12 h-12 object-contain" />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-primary">Manvi</span>
                <span className="text-sm text-primary/70 -mt-1">
                  Fishing Club
                </span>
              </div>
            </a>
            <p className="text-primary/70 mb-6 max-w-sm leading-relaxed">
              Karnataka's premier fishing community. Join us for unforgettable 
              fishing experiences, exciting tournaments, and a passion for the waters.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary/70 text-sm">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>Manvi, Raichur District, Karnataka 584123</span>
              </div>
              <div className="flex items-center gap-3 text-primary/70 text-sm">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-primary/70 text-sm">
                <Mail className="w-4 h-4 text-secondary" />
                <span>info@manvifishingclub.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary/10">
        <div className="container-custom px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary/60 text-sm text-center md:text-left">
              © 2025 Manvi Fishing Club. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center hover:bg-secondary transition-colors group"
                >
                  <social.icon className="w-5 h-5 text-primary/70 group-hover:text-secondary-foreground transition-colors" />
                </a>
              ))}
            </div>

            {/* Member Login */}
            <a
              href="#"
              className="text-secondary hover:text-secondary/80 text-sm font-medium transition-colors"
            >
              Member Login →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
