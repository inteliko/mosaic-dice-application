
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Dice Mosaic Blog - Tips, Tutorials & Inspiration</title>
        <meta name="description" content="Discover the art of creating dice mosaics with our comprehensive guides, tutorials, and inspiration articles. Learn techniques, pricing, and best practices." />
        <meta name="keywords" content="dice mosaic, dice art, mosaic tutorials, dice projects, pixel art with dice" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Dice Mosaic Blog</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Complete Guide to Creating Your First Dice Mosaic</h2>
            <p className="text-gray-600 mb-4">
              Step-by-step tutorial covering image selection, dice calculation, and assembly techniques for beginners.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
          
          <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Understanding Dice Mosaic Pricing and Materials</h2>
            <p className="text-gray-600 mb-4">
              Detailed breakdown of costs, materials needed, and how to budget your dice mosaic project effectively.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
          
          <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Top 10 Tools for Professional Dice Mosaic Creation</h2>
            <p className="text-gray-600 mb-4">
              Essential tools and equipment that will help you create better dice mosaics with professional results.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
          
          <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Advanced Techniques: Creating 3D Effects with Dice</h2>
            <p className="text-gray-600 mb-4">
              Learn how to create depth and dimension in your dice mosaics using advanced placement techniques.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
          
          <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Color Theory in Dice Mosaic Design</h2>
            <p className="text-gray-600 mb-4">
              Understanding how to use different colored dice to create stunning visual effects in your mosaics.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
          
          <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Preserving and Displaying Your Dice Mosaic</h2>
            <p className="text-gray-600 mb-4">
              Best practices for mounting, framing, and protecting your finished dice mosaic artwork.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
          
          <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Digital vs Physical Dice Mosaic Planning</h2>
            <p className="text-gray-600 mb-4">
              Compare different approaches to planning your dice mosaic and choose the best method for your project.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
          
          <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Collaborative Dice Mosaic Projects</h2>
            <p className="text-gray-600 mb-4">
              How to organize and manage large-scale dice mosaic projects with multiple contributors.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
          
          <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Lighting and Photography Tips for Dice Mosaics</h2>
            <p className="text-gray-600 mb-4">
              Professional tips for capturing and showcasing your dice mosaic artwork in the best possible way.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
          
          <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Environmental Impact: Sustainable Dice Art</h2>
            <p className="text-gray-600 mb-4">
              Exploring eco-friendly options and sustainable practices in dice mosaic creation.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
