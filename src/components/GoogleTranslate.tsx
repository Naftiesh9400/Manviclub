import { useEffect } from "react";
import { Globe } from "lucide-react";

const GoogleTranslate = ({ id = "google_translate_element" }: { id?: string }) => {
  useEffect(() => {
    const initTranslate = () => {
      if ((window as any).google && (window as any).google.translate) {
        const element = document.getElementById(id);
        if (element && !element.hasChildNodes()) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,doi,sd,kok,mni,ne,sa", // Indian languages
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            id
          );
        }
      }
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      (window as any).googleTranslateElementInit = () => {
        // Global callback when script loads
      };
    }

    // Check periodically if script is loaded and element is ready
    const intervalId = setInterval(initTranslate, 1000);

    // Inject custom styles to make the widget look like a native component
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate { display: none !important; }
      body { top: 0px !important; }
      .goog-te-gadget {
        font-family: inherit !important;
        display: flex !important;
        align-items: center;
      }
      .goog-te-gadget span {
        display: none !important;
      }
      .goog-te-gadget .goog-te-combo {
        padding: 0 !important;
        border: none !important;
        font-size: 14px !important;
        background-color: transparent !important;
        color: inherit !important;
        cursor: pointer !important;
        outline: none !important;
        margin: 0 !important;
        font-weight: 500 !important;
        width: 100% !important;
      }
      /* Hide the google branding */
      .goog-logo-link {
        display: none !important;
      }
      .goog-te-gadget {
        color: transparent !important;
      }
      #${id} select {
        color: hsl(var(--foreground)) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(intervalId);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [id]);

  return (
    <div className="flex items-center gap-2 border border-input rounded-md px-3 py-1.5 bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div id={id} className="google-translate-container" />
    </div>
  );
};

export default GoogleTranslate;