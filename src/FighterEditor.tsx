import { useEffect, useRef, useState } from "react";

const FighterEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hairColor, setHairColor] = useState("#603813"); // Brown hair
  const [skinColor, setSkinColor] = useState("#f2a07b"); // Default skin tone

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = `/test-fighter.png?${new Date().getTime()}`;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      applyColor(ctx, canvas, skinColor, hairColor);
    };
  }, [hairColor, skinColor]);

  const applyColor = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    skin: string,
    hair: string
  ) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const skinRgb = hexToRgb(skin);
    const hairRgb = hexToRgb(hair);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Use a tolerance to detect similar colors
      if (isColorMatch(r, g, b, 242, 160, 123, 15)) {
        if (skinRgb) {
          data[i] = skinRgb.r;
          data[i + 1] = skinRgb.g;
          data[i + 2] = skinRgb.b;
        }
      }

      if (isColorMatch(r, g, b, 96, 56, 19, 15)) {
        if (hairRgb) {
          data[i] = hairRgb.r;
          data[i + 1] = hairRgb.g;
          data[i + 2] = hairRgb.b;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Helper function to check if a pixel is within a tolerance range
  const isColorMatch = (
    r: number,
    g: number,
    b: number,
    targetR: number,
    targetG: number,
    targetB: number,
    tolerance: number
  ) => {
    return (
      Math.abs(r - targetR) <= tolerance &&
      Math.abs(g - targetG) <= tolerance &&
      Math.abs(b - targetB) <= tolerance
    );
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  return (
    <div>
      <canvas ref={canvasRef} width={256} height={256} className="border" />
      <div>
        <label>
          Hair Color:
          <input
            type="color"
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Skin Color:
          <input
            type="color"
            value={skinColor}
            onChange={(e) => setSkinColor(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default FighterEditor;
