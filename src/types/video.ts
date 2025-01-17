export interface VideoSettings {
  id: string;
  brightness?: { enabled: boolean; value: number };
  contrast?: { enabled: boolean; value: number };
  desaturation?: { enabled: boolean; value: number };
  colorWash?: { enabled: boolean; color: string; intensity: number };
  zoom?: { enabled: boolean; value: number };
  stabilization?: boolean;
  fadeEffect?: { enabled: boolean; duration: number };
  logoPosition?: {
    x: number;
    y: number;
    rotation: number;
    size: number;
  };
}

export interface ProcessedVideo {
  id: string;
  name: string;
  thumbnail: string;
  url: string;
  selected?: boolean;
}