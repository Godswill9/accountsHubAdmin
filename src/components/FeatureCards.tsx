
import React from 'react';
import { ArrowRight, Search, Package, HeartHandshake, Users, ShoppingCart, DollarSign, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FeatureCards = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12">What would you like to do?</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Buy & Sell Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-xl font-bold mb-2">Buy & Sell Social Media Accounts</h3>
            <p className="text-gray-600 mb-6">Direct connection between buyers and sellers through our secure marketplace. No intermediaries.</p>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-flippa-lightBlue rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-flippa-blue" />
              </div>
              <div>
                <h4 className="font-medium">Low flat fee</h4>
                <p className="text-sm text-gray-500">No commission or hidden fees</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Button variant="outline" className="border-gray-200 text-gray-700">
                Browse Accounts
              </Button>
              <Button className="bg-flippa-blue hover:bg-blue-700 text-white">
                Sell Account
              </Button>
            </div>
          </div>
          
          {/* Security & Protection Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-xl font-bold mb-2">Secure Transaction Guarantee</h3>
            <p className="text-gray-600 mb-6">Our secure escrow service ensures both buyers and sellers are protected throughout the transaction process.</p>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-flippa-lightBlue rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-flippa-blue" />
              </div>
              <div>
                <h4 className="font-medium">100% Secure Transfers</h4>
                <p className="text-sm text-gray-500">Verified accounts with guaranteed access</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button className="bg-flippa-blue hover:bg-blue-700 text-white">
                Learn About Security
              </Button>
            </div>
          </div>
        </div>
        
        {/* Platform Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Active Accounts</p>
            <div className="h-16 bg-white rounded-md border border-gray-200 flex items-center justify-center">
              <span className="font-medium text-gray-800">10,000+</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Successful Transfers</p>
            <div className="h-16 bg-white rounded-md border border-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">300,000+</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Satisfaction Rate</p>
            <div className="h-16 bg-white rounded-md border border-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">99.8%</span>
            </div>
          </div>
        </div>
        
        {/* Popular Categories Section */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <Search className="h-5 w-5 text-flippa-blue mr-2" />
              <h3 className="font-medium">Instagram Accounts</h3>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex-shrink-0 mt-1"></div>
                  <div>
                    <p className="text-sm font-medium">@lifestyle{i + 1}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="inline-block w-16">Followers</span>
                      <span>{(i + 1) * 10}K</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="inline-block w-16">Price</span>
                      <span>${(i + 1) * 250}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 text-flippa-blue mr-2" />
              <h3 className="font-medium">Facebook Pages</h3>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex-shrink-0 mt-1"></div>
                  <div>
                    <p className="text-sm font-medium">News Page {i + 1}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="inline-block w-16">Likes</span>
                      <span>{(i + 2) * 25}K</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="inline-block w-16">Price</span>
                      <span>${(i + 1) * 500}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 text-flippa-blue mr-2" />
              <h3 className="font-medium">Twitter Accounts</h3>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex-shrink-0 mt-1"></div>
                  <div>
                    <p className="text-sm font-medium">@tech{i + 1}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="inline-block w-16">Followers</span>
                      <span>{(i + 1) * 15}K</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="inline-block w-16">Price</span>
                      <span>${(i + 1) * 300}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <DollarSign className="h-5 w-5 text-flippa-blue mr-2" />
              <h3 className="font-medium">Account Value Calculator</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Find out what your social media account is worth with our free valuation tool</p>
            <div className="mt-8">
              <Button className="w-full bg-flippa-blue hover:bg-blue-700 text-white">
                Get Free Valuation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
