import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFirestore, collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/manvi2.png";
import GoogleTranslate from "../GoogleTranslate";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    if (user) {
      // Listen for user-specific notifications
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(notifs);

        // Count unread notifications
        const count = notifs.filter((n: any) => !n.read).length;
        setUnreadCount(count);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen && notifications.length > 0) {
      // Mark as read by updating local timestamp to now
      localStorage.setItem("lastReadNotificationTime", new Date().toISOString());
      setUnreadCount(0);
    }
  };

  const navLinks = [
    { name: "About", href: "/about-us" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Gallery", href: "/gallery" },
    { name: "Membership", href: "/#membership" },
    { name: "Careers", href: "/careers" },

  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/10">
      {!user && (
        <div className="w-full bg-primary text-primary-foreground py-1 overflow-hidden">
          <style>
            {`
              @keyframes marquee-header {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: inline-block;
                white-space: nowrap;
                animation: marquee-header 30s linear infinite;
              }
            `}
          </style>
          <div className="animate-marquee">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <span key={i} className="mx-8 text-sm font-medium">
                Please login first. कृपया पहले लॉगिन करें.
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Manvi Fishing Club" className="w-20 h-20 md:w-20 md:h-20 object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-lg md:text-xl font-bold text-primary">
                Manvi
              </span>
              <span className="text-xs text-primary/70 -mt-1">
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
                  className="text-primary/80 hover:text-primary transition-colors font-medium text-sm"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-primary/80 hover:text-primary transition-colors font-medium text-sm"
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <GoogleTranslate id="google_translate_element_desktop" />

            {user && (
              <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative mr-2" onClick={handleNotificationClick}>
                    <Bell className="w-5 h-5 text-primary" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-border bg-muted/30">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                  </div>
                  <ScrollArea className="h-[300px]">
                    {notifications.length > 0 ? (
                      <div className="flex flex-col">
                        {notifications.map((notif: any) => (
                          <div key={notif.id} className="p-4 border-b border-border hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${notif.type === 'urgent' ? 'bg-red-100 text-red-600' :
                                notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                  'bg-blue-100 text-blue-600'
                                }`}>
                                {notif.type?.toUpperCase() || 'INFO'}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleDateString() : 'Just now'}
                              </span>
                            </div>
                            <h5 className="font-medium text-sm mb-1">{notif.title}</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                        <Bell className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}

            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
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
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
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
            className="lg:hidden text-primary p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-primary/10 py-4 px-4">
            <nav className="flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                <GoogleTranslate id="google_translate_element_mobile" />
              </div>
              {navLinks.map((link) => (
                link.href.startsWith("/#") ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-primary/80 hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-primary/80 hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-primary/10">
                {user ? (
                  <>
                    <div className="flex items-center justify-between py-2 px-1">
                      <span className="text-sm font-medium">Notifications</span>
                      <div className="relative" onClick={() => navigate("/dashboard")}>
                        {/* Mobile just goes to dashboard or shows count */}
                        <div className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-primary" />
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
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
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
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
