import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Anchor, Heart, Users, Target, Award, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TeamSection from "@/components/sections/TeamSection";

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

                <TeamSection />


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
