import React from 'react';
import { Button } from '@/widgets/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/widgets/common/Card';
import { ChevronDown, ChevronUp, Upload, Video, X } from 'lucide-react';
import {VideoThumbnail} from "@/widgets/Match/VideoThumbnail";

interface VideoUploadSectionProps {
  files: File[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  onAddFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function VideoUploadSection({
                                             files,
                                             inputRef,
                                             onAddFile,
                                             onRemove,
                                             onMove,
                                           }: VideoUploadSectionProps) {
  return (
    <Card className="shadow-md border-0 bg-white/80 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
          <Video className="w-5 h-5 text-gray-700" />
          Video Upload
          <p className="ml-auto text-sm text-gray-500">{files.length}/5</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {files.map((file, i) => (
          <div key={i} className="group relative">
            <Card className="border border-gray-300 hover:border-gray-500 transition-colors duration-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Video Thumbnail */}
                  <div className="relative">
                    <VideoThumbnail file={file} className="w-20 h-14" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onMove(i, i - 1)}
                      disabled={i === 0}
                      className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onMove(i, i + 1)}
                      disabled={i === files.length - 1}
                      className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemove(i)}
                      className="h-8 w-8 p-0 hover:bg-gray-100 text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {files.length < 5 && (
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              onChange={onAddFile}
              className="hidden"
            />
            <Card
              className="border-2 border-dashed border-gray-400 hover:border-gray-600 transition-colors duration-200 cursor-pointer group bg-white"
              onClick={() => inputRef.current?.click()}
            >
              <CardContent className="p-8 text-center">
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-600 mx-auto mb-3 transition-colors" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                  Add Video File
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Click to select or drag and drop
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}