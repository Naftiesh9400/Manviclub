import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, MembershipPlan } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Check, Crown, Star, Zap, CreditCard, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { getFirestore, collection, addDoc } from "firebase/firestore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const MembershipSection = () => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const { user, setMembershipPlan } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plans = [
    {
      name: "Basic" as const,
      planId: "basic" as MembershipPlan,
      icon: Zap,
      price: "₹999",
      priceValue: 999,
      period: "per year",
      description: "Perfect for beginners exploring the fishing community",
      features: [
        "Access to member events",
        "Monthly newsletter",
        "Community forum access",
        "Basic fishing tips & guides",
        "10% discount on merchandise",
      ],
      popular: false,
      buttonVariant: "outline" as const,
    },
    {
      name: "Premium" as const,
      planId: "premium" as MembershipPlan,
      icon: Star,
      price: "₹2,999",
      priceValue: 2999,
      period: "per year",
      description: "For dedicated anglers who want the full experience",
      features: [
        "Everything in Basic",
        "Priority tournament registration",
        "Exclusive fishing spot access",
        "Expert mentorship program",
        "20% discount on merchandise",
        "Free gear rental (2x/month)",
        "Members-only WhatsApp group",
      ],
      popular: true,
      buttonVariant: "hero" as const,
    },
    {
      name: "Elite" as const,
      planId: "elite" as MembershipPlan,
      icon: Crown,
      price: "₹5,999",
      priceValue: 5999,
      period: "per year",
      description: "For the serious angler who wants it all",
      features: [
        "Everything in Premium",
        "VIP tournament access",
        "Personal fishing coach",
        "Unlimited gear rental",
        "30% discount on merchandise",
        "Exclusive boat trips",
        "Guest passes (3x/year)",
        "Custom club merchandise",
      ],
      popular: false,
      buttonVariant: "accent" as const,
    },
  ];

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase a membership.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setSelectedPlan(plan);
    setEmail(user.email || "");
    setIsPaymentOpen(true);
    setIsSuccess(false);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    const db = getFirestore();
    setIsProcessing(true);

    // Check if Razorpay is loaded
    if (typeof window.Razorpay === "undefined") {
      // Load Razorpay script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_S48GPMRpTiySYx", // Replace with actual Razorpay key
      amount: selectedPlan.priceValue * 100, // Amount in paise
      currency: "INR",
      name: "Manvi Fishing Club",
      description: `${selectedPlan.name} Membership - 1 Year`,
      image: "/favicon.ico",
      handler: function (response: any) {
        // Payment successful
        console.log("Payment successful:", response);
        
        // Record transaction
        addDoc(collection(db, "transactions"), {
          userId: user?.uid,
          userName: user?.displayName || "Unknown",
          userEmail: email,
          plan: selectedPlan.planId,
          amount: selectedPlan.priceValue,
          razorpayPaymentId: response.razorpay_payment_id,
          date: new Date(),
          status: "success"
        });

        setMembershipPlan(selectedPlan.planId).then(() => {
        setIsSuccess(true);
        setIsProcessing(false);
        
        toast({
          title: "Payment Successful! 🎉",
          description: `Welcome to ${selectedPlan.name} membership!`,
        });
        });
      },
      prefill: {
        email: email,
        name: user?.displayName || "",
      },
      theme: {
        color: "#1e6091",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleGoToDashboard = () => {
    setIsPaymentOpen(false);
    navigate("/dashboard");
  };

  return (
    <section id="membership" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Membership</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose Your{" "}
            <span className="text-secondary">Membership</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Unlock exclusive benefits, connect with fellow anglers, and take your 
            fishing journey to the next level with our membership plans.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative card-premium p-8 ${
                plan.popular
                  ? "border-2 border-secondary ring-4 ring-secondary/20 scale-105 z-10"
                  : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center ${
                plan.popular ? "bg-gradient-ocean" : "bg-muted"
              }`}>
                <plan.icon className={`w-7 h-7 ${
                  plan.popular ? "text-primary-foreground" : "text-secondary"
                }`} />
              </div>

              {/* Plan Name */}
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <span className="font-display text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-6">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Button 
                variant={plan.buttonVariant} 
                className="w-full" 
                size="lg"
                onClick={() => handleSelectPlan(plan)}
              >
                Get {plan.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          All plans include a 30-day money-back guarantee. No questions asked.
        </p>
      </div>

      {/* Payment Modal */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="max-w-md">
          {!isSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-secondary" />
                  Complete Your Purchase
                </DialogTitle>
                <DialogDescription>
                  You're purchasing the {selectedPlan?.name} membership for {selectedPlan?.price}/year.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Plan Summary */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {selectedPlan && <selectedPlan.icon className="w-6 h-6 text-secondary" />}
                      <span className="font-semibold text-foreground">{selectedPlan?.name} Plan</span>
                    </div>
                    <span className="font-bold text-foreground">{selectedPlan?.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedPlan?.description}</p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="payment-email">Confirmation Email</Label>
                  <Input
                    id="payment-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Receipt and membership details will be sent to this email.
                  </p>
                </div>

                {/* Payment Info */}
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <p className="text-sm text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <strong>Secure Payment via Razorpay</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your payment information is encrypted and secure.
                  </p>
                </div>

                <Button 
                  variant="hero" 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay ${selectedPlan?.price}`}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-secondary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Welcome to {selectedPlan?.name}! 🎉
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your membership is now active. Check your email for confirmation.
                </p>

                {/* Benefits Unlocked */}
                <div className="bg-muted p-4 rounded-lg text-left mb-6">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    Benefits Now Unlocked
                  </h3>
                  <ul className="space-y-2">
                    {selectedPlan?.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-secondary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setIsPaymentOpen(false)}>
                    <Mail className="w-4 h-4" />
                    Check Email
                  </Button>
                  <Button variant="hero" className="flex-1" onClick={handleGoToDashboard}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MembershipSection;
