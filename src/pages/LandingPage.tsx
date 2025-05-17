
import { Link } from "react-router-dom";
import { TrendingUp, Globe, BarChart2, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-business-teal" />
            <span className="text-xl font-bold text-business-navy">
              Business Vista Advisor
            </span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link to="/app">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 text-center px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-business-navy mb-6">
            Your Complete Business <span className="text-business-teal">Intelligence</span> Platform
          </h1>
          <p className="text-lg sm:text-xl text-business-gray mb-10 max-w-3xl mx-auto">
            Make strategic business decisions with real-time currency tracking, 
            competitive analytics, and AI-powered recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/app">
              <Button className="text-base px-8 py-6" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/app/register">
              <Button variant="outline" className="text-base px-8 py-6" size="lg">
                Register Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-business-navy mb-12">
            Powerful Features for Every Business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="h-14 w-14 rounded-full bg-business-teal/10 flex items-center justify-center mb-4">
                <Globe className="h-7 w-7 text-business-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Currency Exchange Tracker</h3>
              <p className="text-gray-600">
                Monitor major world currencies in real-time to make informed financial decisions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="h-14 w-14 rounded-full bg-business-teal/10 flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-business-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Business Registration</h3>
              <p className="text-gray-600">
                Easily register your business and manage important documentation in one place.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="h-14 w-14 rounded-full bg-business-teal/10 flex items-center justify-center mb-4">
                <BarChart2 className="h-7 w-7 text-business-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comparative Analytics</h3>
              <p className="text-gray-600">
                Benchmark your performance against similar businesses in your industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-business-navy mb-4">
            For Every Business Type and Scale
          </h2>
          <p className="text-center mb-12 text-gray-600 max-w-3xl mx-auto">
            Whether you run a global corporation or a local business, our platform adapts to your specific needs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                🌍 Global Corporations
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                For businesses operating in multiple countries with international influence.
              </p>
              <div className="flex items-center text-sm text-business-teal">
                <CheckCircle className="h-4 w-4 mr-2" /> Analytics at global scale
              </div>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                🌐 Regional Enterprises
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                For businesses operating across specific regions or continents.
              </p>
              <div className="flex items-center text-sm text-business-teal">
                <CheckCircle className="h-4 w-4 mr-2" /> Regional market insights
              </div>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                🏙️ National Businesses
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                For businesses operating primarily within a single country.
              </p>
              <div className="flex items-center text-sm text-business-teal">
                <CheckCircle className="h-4 w-4 mr-2" /> National competition data
              </div>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                🏡 Local/SMEs
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                For small and medium local businesses serving communities.
              </p>
              <div className="flex items-center text-sm text-business-teal">
                <CheckCircle className="h-4 w-4 mr-2" /> Local market optimization
              </div>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                💻 Digital Businesses
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                For online-only businesses with potentially global reach.
              </p>
              <div className="flex items-center text-sm text-business-teal">
                <CheckCircle className="h-4 w-4 mr-2" /> Digital growth metrics
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link to="/app">
              <Button>Explore All Features</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-business-navy text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <TrendingUp className="h-6 w-6 text-business-teal" />
              <span className="text-xl font-bold">Business Vista Advisor</span>
            </div>
            <div className="text-sm text-gray-300">
              © 2025 Business Vista Advisor. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
