import { LiquidEffectAnimation } from "./liquid-effect-animation";

interface DemoOneProps {
  metalness?: number;
  roughness?: number;
  rain?: boolean;
}

export default function DemoOne({ metalness, roughness, rain }: DemoOneProps) {
  return <LiquidEffectAnimation metalness={metalness} roughness={roughness} rain={rain} />;
}