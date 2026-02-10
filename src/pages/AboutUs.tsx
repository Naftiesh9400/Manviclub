import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Anchor, Heart, Users, Target, Award, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const AboutUs = () => {
    const stats = [
        { label: "Years Experience", value: "15+" },
        { label: "Active Members", value: "500+" },
        { label: "Tournaments Held", value: "50+" },
        { label: "Conservation Projects", value: "20+" },
    ];



    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const db = getFirestore();
                const q = query(collection(db, "team_members"), orderBy("createdAt", "asc"));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setTeamMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                } else {
                    // Fallback to hardcoded data if DB is empty
                    setTeamMembers([
                        {
                            name: "Mallikarjun",
                            role: "President",
                            bio: "A visionary leader with over 15 years of experience in community building and environmental conservation. Mallikarjun leads the club with a focus on sustainable fishing practices and verified tournaments.",
                            bioHindi: "सामुदायिक निर्माण और पर्यावरण संरक्षण में 15 से अधिक वर्षों के अनुभव वाले एक दूरदर्शी नेता। मल्लिकार्जुन स्थायी मछली पकड़ने की प्रथाओं और सत्यापित टूर्नामेंटों पर ध्यान केंद्रित करते हुए क्लब का नेतृत्व करते हैं।",
                            shortBio: "Visionary leader with 15+ years experience in community building."
                        },
                        {
                            name: "Sharanbasva",
                            role: "Vice President",
                            bio: "An expert angler and strategy maker, Sharanbasva ensures that all club activities run smoothly. His dedication to the sport inspires new members to join and excel.",
                            bioHindi: "एक विशेषज्ञ एंगलर और रणनीति निर्माता, शरणबसवा यह सुनिश्चित करते हैं कि सभी क्लब गतिविधियाँ सुचारू रूप से चलें। खेल के प्रति उनका समर्पण नए सदस्यों को शामिल होने और उत्कृष्टता प्राप्त करने के लिए प्रेरित करता है।",
                            shortBio: "Expert angler and strategist ensuring smooth club activities."
                        },
                        {
                            name: "Isha Sharma",
                            role: "Executive Director",
                            bio: "A national player (Gold Medalist in Kia King National Championship), she is the youngest Executive Director. Hardworking, enthusiastic, and passionate, her approach is always positive towards exploring new possibilities, understanding the market's unmet needs, and fulfilling them. Focused on her dedication and pursuit of excellence, she actively participates in various industrial development activities.",
                            bioHindi: " एक राष्ट्रीय खिलाड़ी (किया किंग राष्ट्रीय चैम्पियनशिप में स्वर्ण पदक विजेता) है, वह सबसे युवा कार्यकारी निदेशक हैं। मेहनती, उत्साही और जुनूनी, उनका दृष्टिकोण हमेशा नई संभावनाओं को तलाशने और बाजार की अनसुलझी जरूरतों को समझने और परिणामस्वरूप उन्हें पूरा करने के प्रति सकारात्मक रहता है।अपनी लगन और उत्कृष्टता की खोज पर केंद्रित रहते हुए, वह कई औद्योगिक विकास गतिविधियों में सक्रिय रूप से भाग लेती हैं।",
                            shortBio: "National player and youngest Executive Director, focused on new possibilities and market needs."
                        },
                    ]);
                }
            } catch (error) {
                console.error("Error fetching team members:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeam();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative bg-primary py-24 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                    <div className="container-custom relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                            <Anchor className="w-4 h-4 text-secondary" />
                            <span className="text-sm font-medium text-white">Our Story</span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Guardians of the <span className="text-secondary">Waters</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            We are a community of passionate anglers dedicated to the sport of fishing,
                            conservation, and building lasting friendships by the water.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="section-padding bg-background">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <div className="space-y-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 rounded-lg bg-secondary/10">
                                            <Target className="w-6 h-6 text-secondary" />
                                        </div>
                                        <h2 className="font-display text-2xl font-bold">Our Mission</h2>
                                    </div>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        To foster a responsible and thriving fishing community that respects nature,
                                        promotes sustainable practices, and passes on the tradition of angling to future generations.
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 rounded-lg bg-secondary/10">
                                            <Heart className="w-6 h-6 text-secondary" />
                                        </div>
                                        <h2 className="font-display text-2xl font-bold">Our Vision</h2>
                                    </div>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        To be the leading voice for recreational fishing in the region, known for our
                                        commitment to conservation, education, and community building.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    {stats.map((stat, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border">
                                            <div className="font-display text-3xl font-bold text-primary mb-1">{stat.value}</div>
                                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=2070&auto=format&fit=crop"
                                        alt="Fishing Team"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
                                    <p className="font-display text-lg font-bold text-primary mb-2">"Fishing is not just a sport, it's a way of life."</p>
                                    <p className="text-secondary font-medium">- Club Founder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="section-padding bg-muted/30">
                    <div className="container-custom">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-6">
                                <Users className="w-4 h-4 text-secondary" />
                                <span className="text-sm font-medium text-secondary">Our Team</span>
                            </div>
                            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Meet the Faces Behind the Club</h2>
                            <p className="text-lg text-muted-foreground">
                                Dedicated individuals working together to create the best fishing experience for our members.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {isLoading ? (
                                <div className="col-span-full flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                teamMembers.map((member, i) => (
                                    <Dialog key={member.id || i}>
                                        <DialogTrigger asChild>
                                            <div className="bg-background rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow group cursor-pointer h-full flex flex-col pt-6">
                                                <div className="flex justify-center">
                                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                        {member.imageUrl ? (
                                                            <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Users className="w-10 h-10 text-primary/40" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-6 flex-grow flex flex-col text-center">
                                                    <h3 className="font-display text-xl font-bold mb-1">{member.name}</h3>
                                                    <p className="text-secondary font-medium mb-4">{member.role}</p>
                                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow line-clamp-3 text-left">
                                                        {member.shortBio}
                                                    </p>
                                                    <Button variant="ghost" className="w-full mt-auto group-hover:bg-primary group-hover:text-white transition-colors">
                                                        Read Full Bio
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-display font-bold text-primary">{member.name}</DialogTitle>
                                                <DialogDescription className="text-lg font-medium text-secondary">
                                                    {member.role}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-4 space-y-6">
                                                <div className="text-muted-foreground leading-relaxed space-y-4">
                                                    <h4 className="font-semibold text-primary">English</h4>
                                                    {member.bio?.split('\n').map((paragraph: string, index: number) => (
                                                        <p key={index}>{paragraph}</p>
                                                    )) || <p>No bio available.</p>}
                                                </div>

                                                {member.bioHindi && (
                                                    <div className="border-t pt-4 text-muted-foreground leading-relaxed space-y-4">
                                                        <h4 className="font-semibold text-primary">Hindi (हिंदी)</h4>
                                                        {member.bioHindi.split('\n').map((paragraph: string, index: number) => (
                                                            <p key={index}>{paragraph}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )))}
                        </div>
                    </div>
                </section>

                {/* Values/Features */}
                <section className="section-padding bg-primary text-white">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-6">
                                    <Award className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-display text-xl font-bold mb-3">Excellence</h3>
                                <p className="text-white/70">Striving for the highest standards in everything we do, from tournaments to training.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-6">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-display text-xl font-bold mb-3">Community</h3>
                                <p className="text-white/70">Building a welcoming and inclusive environment for anglers of all skill levels.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-6">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-display text-xl font-bold mb-3">Education</h3>
                                <p className="text-white/70">Sharing knowledge and skills to help every member become a better angler.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-background">
                    <div className="container-custom">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 lg:p-16 text-center border border-blue-100">
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-6">
                                Ready to Join Our Community?
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                                Become a member today and get access to exclusive events, tournaments, and a community of passionate anglers.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/auth">
                                    <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
                                        Join Now <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/contact">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8 bg-transparent border-primary text-primary hover:bg-primary hover:text-white">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AboutUs;
