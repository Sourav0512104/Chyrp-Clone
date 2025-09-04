// components/feathers/registry.ts
import { ComponentType } from "react";
import TextFeather from "./TextFeather";
import AudioFeather from "./AudioFeather";

// A single interface for all feathers
export interface FeatherDefinition {
  key: string;            // unique identifier: "text", "audio", "quote"
  label: string;          // tab label
  description: string;    // admin extend page description
  component: ComponentType<any>; // React component
}

// Central registry
export const FEATHERS: FeatherDefinition[] = [
  {
    key: "text",
    label: "Text",
    description: "Compose a text-based post.",
    component: TextFeather,
  },
  {
    key: "audio",
    label: "Audio",
    description: "Upload an audio file with optional captions.",
    component: AudioFeather,
  },
  // Add more feathers (photo, link, video, etc.)
];
