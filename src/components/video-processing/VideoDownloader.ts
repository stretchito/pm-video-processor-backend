import { ProcessedVideo } from "@/types/video";
import { useToast } from "@/hooks/use-toast";

export const useVideoDownloader = () => {
  const { toast } = useToast();

  const downloadSelectedVideos = (videos: ProcessedVideo[]) => {
    toast({
      title: "Downloading Videos",
      description: `Downloading ${videos.length} videos...`,
    });
    
    videos.forEach(video => {
      if (video.url) {
        const link = document.createElement('a');
        link.href = video.url;
        link.download = video.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  return {
    downloadSelectedVideos,
  };
};