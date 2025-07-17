
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ServicesOverview from "@/components/home/ServicesOverview";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <ServicesOverview />
      {/* <Testimonials /> */}
      <CallToAction />
    </div>
  );
};

export default Home;
