import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Fish } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Gallery", href: "/gallery" },
    { name: "Membership", href: "/#membership" },
    { name: "Careers", href: "/#careers" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary flex items-center justify-center">
              <Fish className="w-6 h-6 md:w-7 md:h-7 text-secondary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg md:text-xl font-bold text-primary-foreground">
                Manvi
              </span>
              <span className="text-xs text-primary-foreground/70 -mt-1">
                Fishing Club
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith("/#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium text-sm"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium text-sm"
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="heroOutline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="aqua" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="heroOutline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="aqua" size="sm">
                    Join Club
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-primary-foreground p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-primary border-t border-primary-foreground/10 py-4 px-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.href.startsWith("/#") ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-primary-foreground/10">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="heroOutline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="aqua" className="w-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="heroOutline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="aqua" className="w-full">
                        Join Club
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
