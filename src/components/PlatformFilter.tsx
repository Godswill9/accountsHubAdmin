import React from "react";

interface PlatformFilterProps {
  platforms: string[];
  selectedPlatform: string;
  onChange: (platform: string) => void;
}

const PlatformFilter: React.FC<PlatformFilterProps> = ({
  platforms,
  selectedPlatform,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="platformFilter"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Filter by Platform
      </label>
      <select
        id="platformFilter"
        value={selectedPlatform}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Platforms</option>
        {platforms.map((platform) => (
          <option key={platform} value={platform}>
            {platform}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PlatformFilter;
