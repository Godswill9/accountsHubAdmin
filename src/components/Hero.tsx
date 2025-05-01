
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/digital-products?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <div className="bg-hero-pattern text-white">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            Premium Digital Products
            <br />
            <span className="text-white/90">For Creators & Businesses</span>
          </h1>
          
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6">
            Discover high-quality digital products to enhance your workflow, boost productivity, 
            and take your projects to the next level.
          </p>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-4 md:mt-8 max-w-2xl mx-auto relative">
            <div className="flex flex-col sm:flex-row items-center bg-white rounded-lg sm:rounded-full overflow-hidden shadow-lg">
              <input
                type="text"
                placeholder="Search digital products..."
                className="w-full flex-grow px-4 sm:px-6 py-3 sm:py-4 text-gray-800 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-4 transition-colors duration-300 flex items-center justify-center mt-1 sm:mt-0"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-2">Search</span>
              </button>
            </div>
          </form>
          
          {/* Category pills - replaced with social media platforms */}
          <div className="flex flex-wrap justify-center mt-6 gap-2 px-2">
            <div className="bg-white/10 backdrop-blur-sm text-white rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm border border-white/20">
              Instagram
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm border border-white/20">
              Facebook
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm border border-white/20">
              Twitter
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm border border-white/20">
              LinkedIn
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm border border-white/20">
              TikTok
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm border border-white/20">
              YouTube
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm border border-white/20">
              Snapchat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
