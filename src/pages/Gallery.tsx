import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Camera, X, ChevronLeft, ChevronRight, Heart, Download, Share2 } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  description: string;
  category: "catches" | "events" | "members";
  likes: number;
  author: string;
  date: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    title: "Trophy Bass Catch",
    description: "A beautiful 12kg bass caught at Krishna River during the Spring tournament.",
    category: "catches",
    likes: 124,
    author: "Rajesh Kumar",
    date: "March 15, 2024"
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1500463959177-e0869687df26?w=800",
    title: "Annual Club Meetup",
    description: "Members gathering for our annual fishing conference and prize ceremony.",
    category: "events",
    likes: 89,
    author: "Club Admin",
    date: "January 8, 2024"
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=800",
    title: "Sunrise at Tungabhadra",
    description: "Early morning fishing session with spectacular views.",
    category: "members",
    likes: 156,
    author: "Anil Sharma",
    date: "February 20, 2024"
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1545450660-3378a7f3a364?w=800",
    title: "Record Catfish",
    description: "Vikram's record-breaking 18kg catfish from the night tournament.",
    category: "catches",
    likes: 234,
    author: "Vikram Patel",
    date: "August 12, 2023"
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800",
    title: "Tournament Day",
    description: "Participants getting ready for the Summer Catch Classic.",
    category: "events",
    likes: 78,
    author: "Club Admin",
    date: "June 22, 2024"
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1514469755857-4ba77f95a81b?w=800",
    title: "Lake View Camp",
    description: "Our camping spot near Almatti Dam for the weekend tournament.",
    category: "events",
    likes: 92,
    author: "Club Admin",
    date: "April 5, 2024"
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1510425463958-14b34e361fc1?w=800",
    title: "First Catch of the Day",
    description: "Suresh with his first catch during the beginner's workshop.",
    category: "members",
    likes: 67,
    author: "Suresh Reddy",
    date: "March 3, 2024"
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1454021710686-4c641c5eeff9?w=800",
    title: "Golden Hour Fishing",
    description: "Perfect lighting for an evening fishing session.",
    category: "members",
    likes: 143,
    author: "Prakash Singh",
    date: "September 15, 2023"
  },
  {
    id: "9",
    src: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
    title: "Monster Pike",
    description: "Incredible 15kg pike caught using live bait technique.",
    category: "catches",
    likes: 198,
    author: "Mahesh Rao",
    date: "November 28, 2023"
  },
  {
    id: "10",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    title: "Mountain Lake Expedition",
    description: "Club trip to the remote mountain lakes for trout fishing.",
    category: "events",
    likes: 112,
    author: "Club Admin",
    date: "October 10, 2023"
  },
  {
    id: "11",
    src: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    title: "Teaching the Next Generation",
    description: "Senior members teaching young enthusiasts the art of fishing.",
    category: "members",
    likes: 176,
    author: "Club Admin",
    date: "July 18, 2024"
  },
  {
    id: "12",
    src: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800",
    title: "Double Catch Success",
    description: "Two beautiful catches in a single morning session.",
    category: "catches",
    likes: 145,
    author: "Ravi Verma",
    date: "May 5, 2024"
  }
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "catches" | "events" | "members">("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const categories = [
    { id: "all", label: "All Photos", count: galleryImages.length },
    { id: "catches", label: "Catches", count: galleryImages.filter(i => i.category === "catches").length },
    { id: "events", label: "Events", count: galleryImages.filter(i => i.category === "events").length },
    { id: "members", label: "Members", count: galleryImages.filter(i => i.category === "members").length },
  ];

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const currentIndex = lightboxImage ? filteredImages.findIndex(img => img.id === lightboxImage.id) : -1;

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!lightboxImage) return;
    const newIndex = direction === "prev" 
      ? (currentIndex - 1 + filteredImages.length) % filteredImages.length
      : (currentIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[newIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") navigateLightbox("prev");
    if (e.key === "ArrowRight") navigateLightbox("next");
    if (e.key === "Escape") setLightboxImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom px-4">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-6">
              <Camera className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Photo Gallery</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Fishing <span className="text-secondary">Memories</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore our collection of amazing catches, memorable events, and proud member moments 
              from the Manvi Fishing Club community.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "hero" : "outline"}
                onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
                className="gap-2"
              >
                {cat.label}
                <span className="bg-background/20 text-xs px-2 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer card-premium"
                onClick={() => setLightboxImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-white mb-1 line-clamp-1">{image.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-1">{image.author}</p>
                  <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
                    <Heart className="w-4 h-4" />
                    <span>{image.likes}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full capitalize">
                    {image.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxImage(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
            onClick={() => setLightboxImage(null)}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 z-10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 z-10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Image Container */}
          <div 
            className="max-w-5xl max-h-[90vh] mx-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              className="max-h-[70vh] w-auto mx-auto object-contain rounded-lg"
            />
            <div className="bg-card rounded-lg p-4 mt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-1">
                    {lightboxImage.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-2">
                    {lightboxImage.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    By <span className="text-secondary">{lightboxImage.author}</span> • {lightboxImage.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4 text-red-500" /> {lightboxImage.likes} likes
                </span>
                <span className="text-sm text-muted-foreground capitalize">
                  Category: {lightboxImage.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {filteredImages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
