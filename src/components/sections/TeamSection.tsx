import { useState, useEffect } from "react";
import { Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const TeamSection = () => {
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fallbackData = [
        {
            name: "Mr. Manish Sharma",
            role: "Founder & Managing Director",
            bio: "Highly qualified with over 16 years of experience in management activities, he manages several companies and has served as a member of various advisory committees of the Government of India. He possesses qualities such as passion, idealism, honesty, positive attitude, goal-orientation, and self-reliance. With 16 years of experience, he has been nationally recognized for his work in fisheries/industry. In 2010, he started several businesses including construction, media, and business. In 2021, he established Messrs Manvi Fish and Duck Farming India Private Limited and incorporated it in the same year.",
            bioHindi: "उच्च योग्यता प्राप्त और प्रबंधन गतिविधियों में 16 वर्षों से अधिक का अनुभव रखने वाले, उन्होंने कई कंपनियों का प्रबंधन भी कर रहे है और भारत सरकार की कई सलाहकार समितियों के सदस्य के रूप में कार्य किया है।उनमें जुनून, आदर्शवाद, ईमानदारी, सकारात्मक दृष्टिकोण, लक्ष्य-उन्मुखीकरण और आत्मनिर्भरता जैसे गुण होते हैं।16 वर्षों के अनुभव के साथ, उन्हें मत्स्य पालन/उद्योग में उनके काम के लिए राष्ट्रीय स्तर पर मान्यता प्राप्त हुई है।2010 में उन्होंने निर्माण, मीडिया, व्यवसाय सहित कई व्यवसाय शुरू किए, 2021 में उन्होंने मेसर्स मानवी फिश एंड डक फार्मिंग इंडिया प्राइवेट लिमिटेड की स्थापना की और 2021 में ही मेसर्स मानवी फिश एंड डक फार्मिंग इंडिया प्राइवेट लिमिटेड को निगमित किया।",
            shortBio: "Founder with 16+ years experience in management and fisheries industry, nationally recognized for his work."
        },
        {
            name: "Mr. Srimanta Porel",
            role: "Training & Management Director",
            bio: "After obtaining a graduate degree from the university, he has been overseeing the company's training and management system for the past 5 years. He is responsible for quality, communication, and supervision with official bodies. He has the ability to effectively collaborate with people of different skill levels and provides guidance and direction to the company's executive directors.",
            bioHindi: "विश्वविद्यालय से स्नातक की उपाधि प्राप्त करने के बाद, वे पिछले 5 वर्षों से कंपनी के प्रशिक्षण और प्रबंधन प्रणाली की देखरेख कर रहे हैं। वे गुणवत्ता, संचार और आधिकारिक निकायों के साथ पर्यवेक्षण के लिए जिम्मेदार हैं।अलग-अलग स्तर की कार्यकुशलता वाले लोगों के साथ प्रभावी ढंग से सहयोग करने की क्षमता मौजूद है। कंपनी के कार्यकारी निदेशकों को दिशा-निर्देश और मार्गदर्शन प्रदान करता है।",
            shortBio: "Graduate overseeing training and management systems for 5 years, responsible for quality and communication."
        },
        {
            name: "Ishant Sharma",
            role: "Board Member",
            bio: "A national player (Gold Medalist in Kia King National Championship), he is the youngest board member. Hardworking, enthusiastic, and passionate, his approach is always positive towards exploring new possibilities, understanding the market's unmet needs, and fulfilling them. Focused on his dedication and pursuit of excellence, he actively participates in various industrial development activities.",
            bioHindi: "एक राष्ट्रीय खिलाड़ी (किया किंग राष्ट्रीय चैम्पियनशिप में स्वर्ण पदक विजेता) है, वह बोर्ड की सबसे युवा सदस्य हैं। मेहनती, उत्साही और जुनूनी, उनका दृष्टिकोण हमेशा नई संभावनाओं को तलाशने और बाजार की अनसुलझी जरूरतों को समझने और परिणामस्वरूप उन्हें पूरा करने के प्रति सकारात्मक रहता है।अपनी लगन और उत्कृष्टता की खोज पर केंद्रित रहते हुए, वह कई औद्योगिक विकास गतिविधियों में सक्रिय रूप से भाग लेते हैं।",
            shortBio: "National player and youngest board member, gold medalist focused on new possibilities and market needs."
        },
        {
            name: "Mr. Kartikey Pathak",
            role: "Marketing & Transport Director",
            bio: "As a graduate and entrepreneur with over 5 years of experience in transportation and fish marketing, as well as film and serial acting, he is dynamic, entrepreneurial, adaptable, and innovative in his business planning approach. He is credited with creating and developing new ideas for the fish farming website. He has played a significant role in the development of Manvi Fish and Duck Farming India Private Limited Industries.",
            bioHindi: "परिवहन और मछली विपणन के साथ- साथ फिल्म और धारावाहिक अभिनय कला में 5 से अधिक वर्षों के अनुभव वाले स्नातक और उद्यमी के रूप में, वह अपने व्यावसायिक नियोजन दृष्टिकोण में गतिशील, उद्यमशील, अनुकूलनीय और नवोन्मेषी हैं।मछली पालन वेबसाइट के लिए नए विचार के निर्माण और विकास का श्रेय उन्हें ही जाता है। उन्होंने मानवी फिश एंड डक फार्मिंग इंडिया प्राइवेट लिमिटेड इंडस्ट्रीज के विकास में महत्वपूर्ण भूमिका निभाई है।",
            shortBio: "Graduate and entrepreneur with 5+ years in transport and fish marketing, innovative in business planning."
        },
        {
            name: "Isha Sharma",
            role: "Executive Director",
            bio: "A dynamic and visionary youngest female leader, currently leading the company's strategic development as Executive Director. While pursuing business studies, she specializes in bringing innovation and operational excellence to the company's business. Her vision has not only increased the company's productivity but also developed an inclusive and employee-friendly culture. Under her leadership, the company is further strengthening its position in the market.",
            bioHindi: "एक गतिशील और दूरदर्शी सबसे युवा महिला लीडर हैं, जो वर्तमान में executive डायरेक्टर के रूप में कंपनी के रणनीतिक विकास का नेतृत्व कर रही हैं। बिजनेस विषय में अध्यनरत  होने के साथ- साथ वे कंपनी व्यापार में नवाचार और परिचालन उत्कृष्टता लाने में माहिर हैं। उनकी दूरदर्शिता ने न केवल कंपनी की उत्पादकता को बढ़ाया है, बल्कि एक समावेशी और कर्मचारी-हितैषी संस्कृति भी विकसित की है। उनके नेतृत्व में, कंपनी  बाजार में अपनी स्थिति को और अधिक मजबूत कर रही है।",
            shortBio: "Youngest female Executive Director leading strategic development, specializing in innovation and operational excellence."
        },
        {
            name: "Mr. Priber Kumar Sinha",
            role: "Director",
            bio: "Mr. Sinha is a farmer with extensive experience in agriculture and fisheries, including work related to the textile industry. He is currently serving as a director in various non-governmental companies.",
            bioHindi: "श्री सिन्हा कृषि और मत्स्य पालन में व्यापक अनुभव रखने वाले किसान हैं, जिनमें वस्त्र उद्योग से संबंधित कार्य भी शामिल हैं। वे वर्तमान में विभिन्न गैर-सरकारी कंपनियों में निदेशक के रूप में कार्यरत हैं।",
            shortBio: "Experienced farmer in agriculture and fisheries, currently serving as director in various companies."
        },
    ];

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const q = query(collection(db, "team_members"), orderBy("createdAt", "asc"));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setTeamMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                } else {
                    setTeamMembers(fallbackData);
                }
            } catch (error) {
                console.error("Error fetching team members:", error);
                setTeamMembers(fallbackData);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeam();
    }, []);

    return (
        <section id="team" className="section-padding bg-muted/30">
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
    );
};

export default TeamSection;
