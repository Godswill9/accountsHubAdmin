
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container-custom py-12">
        {/* Main footer links */}
        <div className="grid md:grid-cols-6 gap-8">
          <div className="md:col-span-2">
            <a href="/" className="block mb-4">
              <span className="text-2xl font-bold text-flippa-navy">AccsMarket.</span>
            </a>
            <p className="text-gray-600 text-sm mb-4">
              The #1 platform to buy and sell Social Media, trusted by over 3 million entrepreneurs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                <span className="text-gray-600 text-sm">F</span>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                <span className="text-gray-600 text-sm">T</span>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                <span className="text-gray-600 text-sm">L</span>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                <span className="text-gray-600 text-sm">I</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Buy</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Instagram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Telegram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Email</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Snapchat</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Sell</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Instagram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Telegram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Email</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Podcast</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Affiliate Program</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Press</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-flippa-blue text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-gray-500">&copy; 2023 AccsMarket.com Pty Ltd. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-sm text-gray-500 hover:text-flippa-blue">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-flippa-blue">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-flippa-blue">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
