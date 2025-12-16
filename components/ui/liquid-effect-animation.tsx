"use client"
import { useEffect, useRef } from "react"

interface LiquidEffectProps {
  metalness?: number;
  roughness?: number;
  rain?: boolean;
}

export function LiquidEffectAnimation({ metalness = 0.8, roughness = 0.15, rain = false }: LiquidEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sync props with global app instance
  useEffect(() => {
    const updateMaterial = () => {
      if (window.__liquidApp) {
        if (window.__liquidApp.liquidPlane) {
          window.__liquidApp.liquidPlane.material.metalness = metalness;
          window.__liquidApp.liquidPlane.material.roughness = roughness;
        }
        if (typeof window.__liquidApp.setRain === 'function') {
           window.__liquidApp.setRain(rain);
        }
      }
    };

    // Update immediately
    updateMaterial();

    // Poll briefly to catch initialization if script is still loading
    const interval = setInterval(updateMaterial, 100);
    return () => clearInterval(interval);
  }, [metalness, roughness, rain]);

  useEffect(() => {
    if (!canvasRef.current) return

    // Load the script dynamically
    const script = document.createElement("script")
    script.type = "module"
    
    // Fixed newlines in URL strings that were present in the prompt
    // Reduced displacementScale to 4 for a calmer effect
    script.textContent = `
      import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';

      const canvas = document.getElementById('liquid-canvas');
      if (canvas) {
        const app = LiquidBackground(canvas);
        app.loadImage('https://i.pinimg.com/1200x/38/71/c9/3871c9c7a6066df6763c97dc3285c907.jpg');
        app.liquidPlane.material.metalness = ${metalness};
        app.liquidPlane.material.roughness = ${roughness};
        app.liquidPlane.uniforms.displacementScale.value = 4;
        app.setRain(${rain});
        window.__liquidApp = app;
      }
    `

    document.body.appendChild(script)

    return () => {
      if (window.__liquidApp && window.__liquidApp.dispose) {
        window.__liquidApp.dispose()
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty to only load script once

  return (
    <div
      className="fixed inset-0 m-0 w-full h-full touch-none overflow-hidden"
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