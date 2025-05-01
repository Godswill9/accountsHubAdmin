
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: string;
  seen: boolean;
  attachments?: string[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  seen,
  attachments = []
}) => {
  const isUser = sender === 'user';
  
  // Determine if content is a URL (for file messages)
  const isUrl = (str: string) => {
    try {
      return Boolean(new URL(str));
    } catch (e) {
      return false;
    }
  };

  // Get file icon based on file extension
  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  // Check if this is an image URL that should be displayed as an image
  const isImageUrl = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
  };

  return (
    <div
      className={cn(
        "flex flex-col max-w-[80%] rounded-lg p-3 mb-3 relative",
        isUser
          ? "ml-auto bg-blue-600 text-white"
          : "mr-auto bg-gray-100 text-gray-800"
      )}
    >
      {!seen && !isUser && (
        <div
          className="absolute -left-2 top-1 h-2 w-2 rounded-full bg-red-500"
          title="New message"
        ></div>
      )}
      
      {content && !isUrl(content) && <div className="break-words">{content}</div>}
      
      {attachments && attachments.length > 0 && (
        <div className="mt-2 space-y-2">
          {attachments.map((url, idx) => (
            <div key={idx} className="flex flex-col">
              {isImageUrl(url) ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={url} 
                    alt={`Attachment ${idx + 1}`} 
                    className="max-w-full rounded max-h-[200px] object-contain"
                  />
                </a>
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center text-sm underline",
                    isUser ? "text-white" : "text-blue-600"
                  )}
                >
                  {getFileIcon(url)}
                  <span className="ml-1">Attachment {idx + 1}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div
        className={cn(
          "text-xs mt-1",
          isUser ? "text-blue-100" : "text-gray-500"
        )}
      >
        {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
      </div>
    </div>
  );
};

export default ChatMessage;
