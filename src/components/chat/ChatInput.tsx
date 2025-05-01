
import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, X } from 'lucide-react';
import { getFileIcon } from '@/utils/fileHelpers';

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onSendFiles: (files: File[]) => Promise<void>;
  isSending: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onSendFiles, isSending }) => {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;
    
    if (selectedFiles.length > 0) {
      await onSendFiles(selectedFiles);
      setSelectedFiles([]);
    }
    
    if (message.trim()) {
      await onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col w-full">
      {selectedFiles.length > 0 && (
        <div className="border-t border-gray-200 pt-2 px-3 mb-2">
          <p className="text-sm text-gray-500 mb-1">Selected files:</p>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm"
              >
                {getFileIcon(file.name)}
                <span className="mx-1 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAttachClick}
          className="flex-shrink-0"
          disabled={isSending}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <Input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          disabled={isSending}
        />
        
        <Button
          type="button"
          onClick={handleSendMessage}
          disabled={isSending || (!message.trim() && selectedFiles.length === 0)}
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>
    </div>
  );
};

export default ChatInput;
