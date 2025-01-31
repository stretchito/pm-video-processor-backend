import { Request } from 'express';

export interface VideoProcessingRequest extends Request {
  file?: Express.Multer.File;
}

export interface ProcessingOptions {
  logoPath?: string;
  logoPosition?: {
    x: number;
    y: number;
    size: number;
    rotation: number;
  };
  effects?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    zoom?: number;
  };
}