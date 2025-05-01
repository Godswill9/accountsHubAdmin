
import React from 'react';
import { Star, ChevronRight, Heart, ShoppingCart, Activity, BarChart, Globe, Twitter, Instagram, Facebook, Linkedin, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AccountCardProps {
  title: string;
  platform: string;
  price: string;
  rating: number;
  reviews: number;
  followers: string;
  engagement: string;
  accountAge: string;
  accountType: string;
  verificationStatus: string;
  age: string;
  tags?: string[];
  verified?: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({
  title,
  platform,
  price,
  rating,
  reviews,
  followers,
  engagement,
  accountAge,
  accountType,
  verificationStatus,
  age,
  tags,
  verified
}) => {
  // Function to determine which icon to show based on platform
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <Twitter className="h-10 w-10 text-accsmarket-blue" />;
      case 'instagram':
        return <Instagram className="h-10 w-10 text-accsmarket-blue" />;
      case 'facebook':
        return <Facebook className="h-10 w-10 text-accsmarket-blue" />;
      case 'linkedin':
        return <Linkedin className="h-10 w-10 text-accsmarket-blue" />;
      case 'gmail':
        return <Mail className="h-10 w-10 text-accsmarket-blue" />;
      default:
        return <Globe className="h-10 w-10 text-accsmarket-blue" />;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Left thumbnail */}
        <div className="w-full md:w-40 h-32 md:h-full bg-gray-100 flex items-center justify-center p-4 relative">
          <div className="w-24 h-24 bg-blue-50 flex items-center justify-center rounded">
            {getPlatformIcon(platform)}
          </div>
          {verified && (
            <div className="absolute top-2 left-2 bg-accsmarket-blue text-white text-xs px-2 py-1 rounded-full">
              Verified
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-accsmarket-navy hover:text-accsmarket-blue">
                {title}
              </h3>
              <div className="flex items-center mt-1">
                <span className="text-sm font-medium text-gray-600 mr-2">{platform}</span>
                {rating > 0 && (
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({reviews} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-accsmarket-navy">{price}</div>
              <div className="text-xs text-gray-500">Current Price</div>
            </div>
          </div>
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <div className="text-xs text-gray-500">Followers</div>
              <div className="font-medium">{followers}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Engagement</div>
              <div className="font-medium">{engagement}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Verification</div>
              <div className="font-medium">{verificationStatus}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Account Age</div>
              <div className="font-medium">{accountAge}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Account Type</div>
              <div className="font-medium">{accountType}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Age</div>
              <div className="font-medium">{age}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
        <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
          <Heart className="h-4 w-4 mr-1" />
          Watch
        </Button>
        <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
          View Account
        </Button>
      </div>
    </div>
  );
};

const BusinessList = () => {
  const accounts = [
    {
      title: "Established Instagram Fashion Account",
      platform: "Instagram",
      price: "USD $3,500",
      rating: 4,
      reviews: 15,
      followers: "56K",
      engagement: "3.2%",
      accountAge: "4 years 2 mos",
      accountType: "Business",
      verificationStatus: "Blue Tick",
      age: "4 years 2 mos",
      tags: ["Verified Seller", "Instant Transfer"],
      verified: true
    },
    {
      title: "Twitter Tech News Account",
      platform: "Twitter",
      price: "USD $1,200",
      rating: 4,
      reviews: 8,
      followers: "12K",
      engagement: "2.7%",
      accountAge: "2 years 6 mos",
      accountType: "Standard",
      verificationStatus: "Not Verified",
      age: "2 years 6 mos",
      verified: false
    },
    {
      title: "LinkedIn Professional Profile",
      platform: "LinkedIn",
      price: "USD $850",
      rating: 3,
      reviews: 6,
      followers: "2.5K",
      engagement: "4.1%",
      accountAge: "5 years 3 mos",
      accountType: "Premium",
      verificationStatus: "Not Verified",
      age: "5 years 3 mos",
      verified: false
    },
    {
      title: "Facebook Community Page",
      platform: "Facebook",
      price: "USD $2,100",
      rating: 5,
      reviews: 22,
      followers: "35K",
      engagement: "5.3%",
      accountAge: "3 years 7 mos",
      accountType: "Page",
      verificationStatus: "Verified",
      age: "3 years 7 mos",
      tags: ["Verified Seller", "High Engagement"],
      verified: true
    },
    {
      title: "Gmail Account with Premium Benefits",
      platform: "Gmail",
      price: "USD $150",
      rating: 4,
      reviews: 12,
      followers: "N/A",
      engagement: "N/A",
      accountAge: "10 years",
      accountType: "Premium",
      verificationStatus: "2FA Enabled",
      age: "10 years",
      verified: true
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl font-bold mb-6">Browse top social media accounts</h2>
        <p className="text-gray-600 mb-8">Find verified accounts with strong engagement and established histories across all major platforms.</p>
        
        {/* Filter tabs */}
        <div className="flex overflow-x-auto space-x-4 mb-8 py-2">
          <button className="px-4 py-2 text-sm font-medium text-accsmarket-blue border-b-2 border-accsmarket-blue">
            All Accounts
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-accsmarket-blue border-b-2 border-transparent hover:border-gray-300">
            Instagram
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-accsmarket-blue border-b-2 border-transparent hover:border-gray-300">
            Twitter
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-accsmarket-blue border-b-2 border-transparent hover:border-gray-300">
            Facebook
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-accsmarket-blue border-b-2 border-transparent hover:border-gray-300">
            LinkedIn
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-accsmarket-blue border-b-2 border-transparent hover:border-gray-300">
            Gmail
          </button>
        </div>
        
        {/* Account listings */}
        <div className="space-y-6">
          {accounts.map((account, index) => (
            <AccountCard key={index} {...account} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessList;
