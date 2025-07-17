
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-20 bg-agro-brown text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Agricultural Community?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create an account today to access exclusive products, services, and connect with farmers and manufacturers directly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-agro-brown hover:bg-agro-cream"
            asChild
          >
            <Link to="/auth">Sign Up Now</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
            asChild
          >
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
