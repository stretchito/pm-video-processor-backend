import { useState } from "react";
import { VideoSettings, ProcessedVideo } from "@/types/video";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG } from "@/config/api";

interface VideoProcessorProps {
  videoFiles: File[];
  videoSettings: Record<string, VideoSettings>;
  selectedVideoFrame?: string;
  onProcessingComplete: (videos: ProcessedVideo[]) => void;
}

export const useVideoProcessor = ({
  videoFiles,
  videoSettings,
  selectedVideoFrame,
  onProcessingComplete,
}: VideoProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processVideos = async () => {
    try {
      setIsProcessing(true);

      if (videoFiles.length === 0) {
        throw new Error('Please upload at least one video file');
      }

      const formData = new FormData();
      videoFiles.forEach((file) => {
        formData.append('video', file);
      });
      formData.append('settings', JSON.stringify(videoSettings));

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/videos/process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json() as { message?: string; details?: string };
        throw new Error(errorData.message || errorData.details || 'Failed to process videos');
      }

      const result = await response.json() as {
        data: {
          fileName: string;
          processedVideoPath: string;
        };
      };

      const processed: ProcessedVideo[] = [{
        id: crypto.randomUUID(),
        name: result.data.fileName || 'Processed Video',
        thumbnail: selectedVideoFrame || '',
        url: result.data.processedVideoPath,
        selected: false,
      }];

      onProcessingComplete(processed);

      toast({
        title: "Success",
        description: "Video processed successfully",
      });

    } catch (error) {
      console.error('Error processing videos:', error);
      
      let errorMessage = 'Failed to process videos';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processVideos,
  };
};