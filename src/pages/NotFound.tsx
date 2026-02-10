import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, HelpCircle, Map } from "lucide-react";
import logo from "@/assets/manvi2.png";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          {/* Animated Float/Bobbing effect for the icon */}
          <div className="w-32 h-32 flex items-center justify-center mx-auto animate-pulse">
            <img src={logo} alt="Manvi Fishing Club" className="w-full h-full object-contain" />
          </div>
          <div className="absolute top-0 right-1/4 bg-background p-2 rounded-full shadow-lg border border-border">
            <Map className="w-6 h-6 text-destructive" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl font-display font-bold text-primary">404</h1>
          <h2 className="text-2xl font-bold text-foreground">Looks like you're lost at sea!</h2>
          <p className="text-muted-foreground text-lg">
            The page you are fishing for has either been moved, deleted, or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <Home className="w-4 h-4" />
              Return to Shore
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
