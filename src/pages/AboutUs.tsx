import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Anchor, Heart, Users, Target, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
                            {[
                                {
                                    name: "Mr. Manish Sharma",
                                    role: "Founder & Director",
                                    bio: "Highly qualified with over 16 years of experience in management activities. He manages multiple companies and has served as a member of several advisory committees for the Government of India. He possesses qualities like passion, idealism, honesty, positive attitude, goal-orientation, and self-reliance. With 16 years of experience, he has received national recognition for his work in the fisheries industry. In 2010, he started several businesses including construction and media. In 2021, he founded M/s Manvi Fish & Duck Farming India Pvt Ltd.",
                                    bioHindi: "उच्च योग्यता प्राप्त और प्रबंधन गतिविधियों में 16 वर्षों से अधिक का अनुभव रखने वाले, उन्होंने कई कंपनियों का प्रबंधन भी कर रहे है और भारत सरकार की कई सलाहकार समितियों के सदस्य के रूप में कार्य किया है।उनमें जुनून, आदर्शवाद, ईमानदारी, सकारात्मक दृष्टिकोण, लक्ष्य-उन्मुखीकरण और आत्मनिर्भरता जैसे गुण होते हैं।16 वर्षों के अनुभव के साथ, उन्हें मत्स्य पालन/उद्योग में उनके काम के लिए राष्ट्रीय स्तर पर मान्यता प्राप्त हुई है।2010 में उन्होंने निर्माण, मीडिया, व्यवसाय सहित कई व्यवसाय शुरू किए, 2021 में उन्होंने मेसर्स मानवी फिश एंड डक फार्मिंग इंडिया प्राइवेट लिमिटेड की स्थापना की और 2021 में ही मेसर्स मानवी फिश एंड डक फार्मिंग इंडिया प्राइवेट लिमिटेड को निगमित किया।",
                                    shortBio: "Highly qualified with over 16 years of experience in management activities and advisory committees."
                                },
                                {
                                    name: "Mr. Srimanta Porel",
                                    role: "Training & Management Lead",
                                    bio: "After graduating from university, he has been overseeing the company's training and management systems for the past 5 years. He is responsible for quality, communication, and supervision with official bodies. He has the ability to collaborate effectively with people of varying skill levels. He provides direction and guidance to the company's executive directors.",
                                    bioHindi: "विश्वविद्यालय से स्नातक की उपाधि प्राप्त करने के बाद, वे पिछले 5 वर्षों से कंपनी के प्रशिक्षण और प्रबंधन प्रणाली की देखरेख कर रहे हैं। वे गुणवत्ता, संचार और आधिकारिक निकायों के साथ पर्यवेक्षण के लिए जिम्मेदार हैं।अलग-अलग स्तर की कार्यकुशलता वाले लोगों के साथ प्रभावी ढंग से सहयोग करने की क्षमता मौजूद है। कंपनी के कार्यकारी निदेशकों को दिशा-निर्देश और मार्गदर्शन प्रदान करता है।",
                                    shortBio: "Oversees training and management systems with 5 years of experience."
                                },
                                {
                                    name: "Ishant Sharma ",
                                    role: "Executive Director",
                                    bio: "A national player (Gold Medalist in Kia King National Championship), she is the youngest Executive Director. Hardworking, enthusiastic, and passionate, her approach is always positive towards exploring new possibilities, understanding the market's unmet needs, and fulfilling them. Focused on her dedication and pursuit of excellence, she actively participates in various industrial development activities.",
                                    bioHindi: " एक राष्ट्रीय खिलाड़ी (किया किंग राष्ट्रीय चैम्पियनशिप में स्वर्ण पदक विजेता) है, वह सबसे युवा कार्यकारी निदेशक हैं। मेहनती, उत्साही और जुनूनी, उनका दृष्टिकोण हमेशा नई संभावनाओं को तलाशने और बाजार की अनसुलझी जरूरतों को समझने और परिणामस्वरूप उन्हें पूरा करने के प्रति सकारात्मक रहता है।अपनी लगन और उत्कृष्टता की खोज पर केंद्रित रहते हुए, वह कई औद्योगिक विकास गतिविधियों में सक्रिय रूप से भाग लेती हैं।",
                                    shortBio: "National player and youngest Executive Director, focused on new possibilities and market needs."
                                },
                                {
                                    name: "Isha Sharma",
                                    role: "Executive Director",
                                    bio: "A graduate and entrepreneur with over 5 years of experience in transport and fish marketing, as well as film and serial acting. He is dynamic, entrepreneurial, adaptable, and innovative in his business planning approach. He is credited with the creation and development of the new idea for the fish farming website. He has played a key role in the development of Manvi Fish & Duck Farming India Pvt Ltd Industries.",
                                    bioHindi: "परिवहन और मछली विपणन के साथ-साथ फिल्म और धारावाहिक अभिनय कला में 5 से अधिक वर्षों के अनुभव वाले स्नातक और उद्यमी के रूप में, वह अपने व्यावसायिक नियोजन दृष्टिकोण में गतिशील, उद्यमशील, अनुकूलनीय और नवोन्मेषी हैं।मछली पालन वेबसाइट के लिए नए विचार के निर्माण और विकास का श्रेय उन्हें ही जाता है। उन्होंने मानवी फिश एंड डक फार्मिंग इंडिया प्राइवेट लिमिटेड इंडस्ट्रीज के विकास में महत्वपूर्ण भूमिका निभाई है।",
                                    shortBio: "Entrepreneur with experience in transport, fish marketing, and media. Credited with the website idea."
                                },
                                {
                                    name: "Mr. Kartikey Pathak",
                                    role: "Entrepreneur & Innovator",
                                    bio: "A graduate and entrepreneur with over 5 years of experience in transport and fish marketing, as well as film and serial acting. He is dynamic, entrepreneurial, adaptable, and innovative in his business planning approach. He is credited with the creation and development of the new idea for the fish farming website. He has played a key role in the development of Manvi Fish & Duck Farming India Pvt Ltd Industries.",
                                    bioHindi: "परिवहन और मछली विपणन के साथ-साथ फिल्म और धारावाहिक अभिनय कला में 5 से अधिक वर्षों के अनुभव वाले स्नातक और उद्यमी के रूप में, वह अपने व्यावसायिक नियोजन दृष्टिकोण में गतिशील, उद्यमशील, अनुकूलनीय और नवोन्मेषी हैं।मछली पालन वेबसाइट के लिए नए विचार के निर्माण और विकास का श्रेय उन्हें ही जाता है। उन्होंने मानवी फिश एंड डक फार्मिंग इंडिया प्राइवेट लिमिटेड इंडस्ट्रीज के विकास में महत्वपूर्ण भूमिका निभाई है।",
                                    shortBio: "Entrepreneur with experience in transport, fish marketing, and media. Credited with the website idea."
                                },
                                {
                                    name: "Mr. Priber Kumar Sinha",
                                    role: "Director",
                                    bio: "Mr. Sinha is a farmer with extensive experience in agriculture and fisheries, including work related to the textile industry. He currently serves as a director in various non-governmental companies.",
                                    bioHindi: "श्री सिन्हा कृषि और मत्स्य पालन में व्यापक अनुभव रखने वाले किसान हैं, जिनमें वस्त्र उद्योग से संबंधित कार्य भी शामिल हैं। वे वर्तमान में विभिन्न गैर-सरकारी कंपनियों में निदेशक के रूप में कार्यरत हैं।",
                                    shortBio: "Farmer with extensive experience in agriculture, fisheries, and textile industry."
                                }
                            ].map((member, i) => (
                                <Dialog key={i}>
                                    <DialogTrigger asChild>
                                        <div className="bg-background rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow group cursor-pointer h-full flex flex-col pt-6">
                                            <div className="flex justify-center">
                                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Users className="w-10 h-10 text-primary/40" />
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
                                                {member.bio.split('\n').map((paragraph, index) => (
                                                    <p key={index}>{paragraph}</p>
                                                ))}
                                            </div>

                                            <div className="border-t pt-4 text-muted-foreground leading-relaxed space-y-4">
                                                <h4 className="font-semibold text-primary">Hindi (हिंदी)</h4>
                                                {member.bioHindi.split('\n').map((paragraph, index) => (
                                                    <p key={index}>{paragraph}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ))}
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
