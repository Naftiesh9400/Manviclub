import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AlertCircle, X, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmailVerificationBanner = () => {
    const { user, resendVerificationEmail } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const { toast } = useToast();

    // Don't show banner if user is verified, not logged in, or banner is dismissed
    if (!user || user.emailVerified || !isVisible) {
        return null;
    }

    const handleResend = async () => {
        setIsSending(true);
        try {
            await resendVerificationEmail();
            toast({
                title: "Verification Email Sent",
                description: "Please check your inbox and spam folder.",
            });
        } catch (error: any) {
            console.error("Resend verification error:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to send verification email.",
                variant: "destructive",
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-amber-50 border-b border-amber-200">
            <div className="container-custom px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-amber-900 font-medium">
                                Please verify your email address
                            </p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                We sent a verification link to <strong>{user.email}</strong>. Check your inbox and spam folder.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResend}
                            disabled={isSending}
                            className="border-amber-300 text-amber-900 hover:bg-amber-100"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            {isSending ? "Sending..." : "Resend Email"}
                        </Button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-amber-600 hover:text-amber-900 p-1"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationBanner;
