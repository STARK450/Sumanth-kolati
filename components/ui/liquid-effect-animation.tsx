"use client"
import { useEffect, useRef } from "react"

interface LiquidEffectProps {
  metalness?: number;
  roughness?: number;
  rain?: boolean;
}

export function LiquidEffectAnimation({ 
  metalness = 0.8, 
  roughness = 0.15, 
  rain = false 
}: LiquidEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sync props with global app instance
  useEffect(() => {
    const updateMaterial = () => {
      if (window.__liquidApp) {
        if (window.__liquidApp.liquidPlane) {
          window.__liquidApp.liquidPlane.material.metalness = Number(metalness) || 0.8;
          window.__liquidApp.liquidPlane.material.roughness = Number(roughness) || 0.15;
        }
        if (typeof window.__liquidApp.setRain === 'function') {
           window.__liquidApp.setRain(Boolean(rain));
        }
      }
    };

    updateMaterial();
    const interval = setInterval(updateMaterial, 100);
    return () => clearInterval(interval);
  }, [metalness, roughness, rain]);

  useEffect(() => {
    if (!canvasRef.current) return

    const script = document.createElement("script")
    script.type = "module"
    
    // Ensure inputs are sanitized for script injection
    const initialMetalness = Number(metalness) || 0.8;
    const initialRoughness = Number(roughness) || 0.15;
    const initialRain = Boolean(rain);

    script.textContent = `
      import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';

      const canvas = document.getElementById('liquid-canvas');
      if (canvas) {
        try {
          const app = LiquidBackground(canvas);
          app.loadImage('https://i.pinimg.com/1200x/38/71/c9/3871c9c7a6066df6763c97dc3285c907.jpg');
          app.liquidPlane.material.metalness = ${initialMetalness};
          app.liquidPlane.material.roughness = ${initialRoughness};
          app.liquidPlane.uniforms.displacementScale.value = 4;
          app.setRain(${initialRain});
          window.__liquidApp = app;
        } catch (e) {
          console.error("Liquid background failed to initialize", e);
        }
      }
    `

    document.body.appendChild(script)

    return () => {
      if (window.__liquidApp && typeof window.__liquidApp.dispose === 'function') {
        window.__liquidApp.dispose()
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  return (
    <div
      className="fixed inset-0 m-0 w-full h-full touch-none overflow-hidden bg-slate-950"
      style={{ fontFamily: '"Montserrat", serif' }}
    >
      <canvas 
        ref={canvasRef} 
        id="liquid-canvas" 
        className="fixed inset-0 w-full h-full" 
      />
    </div>
  )
}

declare global {
  interface Window {
    __liquidApp?: any
  }
}
