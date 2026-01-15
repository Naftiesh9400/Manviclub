import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Camera, X, ChevronLeft, ChevronRight, Heart, Download, Share2, Loader2 } from "lucide-react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "catches" | "events" | "members">("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const db = getFirestore();
        const snapshot = await getDocs(collection(db, "gallery"));
        const images = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GalleryImage[];
        setGalleryImages(images);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

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
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === "prev") {
      newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    }
    
    setLightboxImage(filteredImages[newIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setLightboxImage(null);
    if (e.key === "ArrowLeft") navigateLightbox("prev");
    if (e.key === "ArrowRight") navigateLightbox("next");
  };

  return (
    <div className="min-h-screen bg-background" onKeyDown={lightboxImage ? handleKeyDown : undefined} tabIndex={0}>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-6">
              <Camera className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Gallery</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Capturing the <span className="text-secondary">Moment</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore our collection of memorable catches, exciting tournaments, and 
              community events. Share your own fishing stories with us.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category.label}
                <span className={`ml-2 text-xs ${
                  selectedCategory === category.id ? "text-secondary-foreground/80" : "text-muted-foreground/70"
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            /* Gallery Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div 
                  key={image.id}
                  className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-muted cursor-pointer"
                  onClick={() => setLightboxImage(image)}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="text-xs font-medium text-secondary mb-1 uppercase tracking-wider">
                        {image.category}
                      </p>
                      <h3 className="font-display text-lg font-bold mb-1 line-clamp-1">
                        {image.title}
                      </h3>
                      <div className="flex items-center justify-between text-white/80 text-xs">
                        <span>{image.author}</span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {image.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxImage(null)}
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
