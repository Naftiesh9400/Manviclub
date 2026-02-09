import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Briefcase, MapPin, Clock, Loader2, Send, Search } from "lucide-react";
import { getFirestore, collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
}

const Openings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Application state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const db = getFirestore();
        const q = query(collection(db, "careers"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const handleApply = (job: Job | null) => {
    setSelectedJob(job);
    setFormData({
      jobId: job?.id || 'general',
      jobTitle: job?.title || 'General Application',
    });
    setResumeFile(null);
    setIsApplicationOpen(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let resumeUrl = "";
      if (resumeFile) {
        try {
          const storage = getStorage();
          const storageRef = ref(storage, `resumes/${Date.now()}_${resumeFile.name}`);
          const snapshot = await uploadBytes(storageRef, resumeFile);
          resumeUrl = await getDownloadURL(snapshot.ref);
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error("Failed to upload resume. Please try again.");
        }
      }

      const db = getFirestore();
      await addDoc(collection(db, "job_applications"), {
        jobId: formData.jobId || 'general',
        jobTitle: formData.jobTitle || 'General Application',
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        portfolio: formData.portfolio || '',
        coverLetter: formData.coverLetter || '',
        resumeUrl,
        appliedAt: new Date(),
        status: 'new'
      });
      
      toast({
        title: "Application Sent!",
        description: "We've received your application and will be in touch soon.",
      });
      setIsApplicationOpen(false);
      setFormData({});
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-6">
              <Briefcase className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Current Openings</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join Our <span className="text-secondary">Team</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Explore exciting opportunities to work with Manvi Fishing Club.
            </p>
            
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by role or location..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">No positions found matching your search.</p>
              <Button variant="link" onClick={() => setSearchTerm("")}>Clear Search</Button>
            </div>
          ) : (
            <div className="grid gap-6 max-w-4xl mx-auto">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                      </div>
                      <p className="text-muted-foreground">{job.description}</p>
                    </div>
                    <Button className="shrink-0" onClick={() => handleApply(job)}>Apply Now</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center bg-muted/30 p-8 rounded-2xl max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Don't see a perfect fit?</h3>
            <p className="text-muted-foreground mb-6">
              Send us your resume and we'll keep it on file for future opportunities.
            </p>
            <Button variant="outline" onClick={() => handleApply(null)}>
              <Send className="w-4 h-4 mr-2" /> Send Your Resume
            </Button>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob ? selectedJob.title : "Future Opportunities"}</DialogTitle>
            <DialogDescription>
              Please fill out the form below. We'll review your application and get back to you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitApplication} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input required placeholder="John Doe" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input required type="email" placeholder="john@example.com" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input required placeholder="+91 98765 43210" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Resume (PDF/Word)</Label>
              <Input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)} 
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn / Portfolio URL</Label>
              <Input placeholder="https://linkedin.com/in/..." value={formData.portfolio || ''} onChange={e => setFormData({...formData, portfolio: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Cover Letter / Experience</Label>
              <Textarea 
                required 
                placeholder="Tell us about your experience and why you'd be a good fit..." 
                rows={4}
                value={formData.coverLetter || ''} 
                onChange={e => setFormData({...formData, coverLetter: e.target.value})} 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Submit Application
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Openings;