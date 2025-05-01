
import { FileText, Image } from 'lucide-react';
import React from 'react';

export const getFileIcon = (filename: string): React.ReactNode => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
    return <Image className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
};

export const isImageUrl = (url: string): boolean => {
  const ext = url.split('.').pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
};
