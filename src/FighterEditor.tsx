import { useEffect, useRef, useState } from "react";

const createCanvas = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  return { canvas, ctx };
};

const scale = 8; // makes it larger and clearer on a 256x256 canvas

const drawPixel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * scale, y * scale, scale, scale);
};

const drawHair = (
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  color: string
) => {
  drawPixel(ctx, baseX, baseY, color);
  drawPixel(ctx, baseX + 1, baseY, color);
  drawPixel(ctx, baseX + 2, baseY, color);
  drawPixel(ctx, baseX + 3, baseY, color);
  drawPixel(ctx, baseX + 4, baseY, color);
  drawPixel(ctx, baseX, baseY + 1, color);
  drawPixel(ctx, baseX + 1, baseY + 1, color);
  drawPixel(ctx, baseX + 2, baseY + 1, color);
  drawPixel(ctx, baseX + 3, baseY + 1, color);
  drawPixel(ctx, baseX + 4, baseY + 1, color);
};

const drawFace = (
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  color: string
) => {
  for (let y = 0; y <= 3; y++) {
    for (let x = 0; x <= 4; x++) {
      drawPixel(ctx, baseX + x, baseY + y, color);
    }
  }
};

const drawEyes = (
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  color: string
) => {
  drawPixel(ctx, baseX + 1, baseY, color);
  drawPixel(ctx, baseX + 3, baseY, color);
};

const drawBody = ({
  position,
  ctx,
  color,
}: {
  position: { x: number; y: number };
  ctx: CanvasRenderingContext2D;
  color: string;
}) => {
  for (let y = 0; y <= 5; y++) {
    for (let x = 0; x <= 4; x++) {
      drawPixel(ctx, position.x + x, position.y + y, color);
    }
  }
};

const drawArms = (
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  color: string
) => {
  for (let y = 0; y <= 4; y++) {
    drawPixel(ctx, baseX, baseY + y, color); // Left arm
    drawPixel(ctx, baseX + 8, baseY + y, color); // Right arm
  }
};

const drawGloves = (
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  color: string
) => {
  drawPixel(ctx, baseX, baseY, color);
  drawPixel(ctx, baseX + 8, baseY, color);
};

const drawShorts = (
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  color: string
) => {
  for (let y = 0; y <= 2; y++) {
    for (let x = 0; x <= 4; x++) {
      if (y == 2 && x == 2) continue; // Skip the middle pixel for shorts
      drawPixel(ctx, baseX + x, baseY + y, color);
    }
  }
};

const drawLegs = (
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  color: string
) => {
  // Left leg
  drawPixel(ctx, baseX, baseY, color);
  drawPixel(ctx, baseX + 1, baseY, color);
  drawPixel(ctx, baseX, baseY + 1, color);
  drawPixel(ctx, baseX + 1, baseY + 1, color);

  // Right leg
  drawPixel(ctx, baseX + 3, baseY, color);
  drawPixel(ctx, baseX + 4, baseY, color);
  drawPixel(ctx, baseX + 3, baseY + 1, color);
  drawPixel(ctx, baseX + 4, baseY + 1, color);
};

const drawHead = (
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  hairColor: string,
  skinColor: string,
  eyeColor: string
) => {
  drawHair(ctx, baseX, baseY, hairColor);
  drawFace(ctx, baseX, baseY + 2, skinColor);
  drawEyes(ctx, baseX, baseY + 3, eyeColor);
};

const drawFighter = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  hairColor: string,
  skinColor: string,
  shortsColor: string,
  glovesColor: string,
  eyeColor: string
) => {
  const fighterWidth = 5;
  const fighterHeight = 10;

  const centerX = Math.floor(canvas.width / scale / 2 - fighterWidth / 2);
  const centerY = Math.floor(canvas.height / scale / 2 - fighterHeight / 2);

  // You can do the same for all body parts now
  drawHead(ctx, centerX, centerY - 4, hairColor, skinColor, eyeColor);
  drawBody({
    position: { x: centerX, y: centerY + 3 }, // Slightly adjust for where the body starts
    ctx,
    color: skinColor,
  });
  drawArms(ctx, centerX - 2, centerY + 3, skinColor);
  drawGloves(ctx, centerX - 2, centerY + 8, glovesColor);
  drawShorts(ctx, centerX, centerY + 9, shortsColor);
  drawLegs(ctx, centerX, centerY + 12, skinColor);
};

const drawFighterPortrait = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  hairColor: string,
  skinColor: string,
  eyeColor: string
) => {
  const fighterWidth = 4;
  const fighterHeight = 6;

  const centerX = Math.floor(canvas.width / scale / 2 - fighterWidth / 2);
  const centerY = Math.floor(canvas.height / scale / 2 - fighterHeight / 2);

  // Draw head
  drawHead(ctx, centerX, centerY, hairColor, skinColor, eyeColor);
};

// MAIN COMPONENT
const FighterEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasHeadRef = useRef<HTMLCanvasElement>(null);

  const [hairColor, setHairColor] = useState("#603813"); // Brown hair
  const [skinColor, setSkinColor] = useState("#f2a07b"); // Default skin tone
  const [shortsColor, setShortsColor] = useState("#000000");
  const [glovesColor, setGlovesColor] = useState("#b60000");
  const [eyeColor, setEyeColor] = useState("#153990");

  // TODO: hair style
  // TODO: beard style
  // TODO: body type

  useEffect(() => {
    const ref = createCanvas(canvasHeadRef);
    if (!ref) return;
    const { canvas, ctx } = ref;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFighterPortrait(canvas, ctx, hairColor, skinColor, eyeColor);
  }, [hairColor, skinColor, shortsColor, glovesColor, eyeColor]);

  useEffect(() => {
    const ref = createCanvas(canvasRef);
    if (!ref) return;
    const { canvas, ctx } = ref;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFighter(
      canvas,
      ctx,
      hairColor,
      skinColor,
      shortsColor,
      glovesColor,
      eyeColor
    );
  }, [hairColor, skinColor, shortsColor, glovesColor, eyeColor]);

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-col">
        <label>
          Hair Color:
          <select
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
            className="ml-2"
          >
            <option value="#000000">Black</option>
            <option value="#4B3621">Dark Brown</option>
            <option value="#603813">Medium Brown</option>
            <option value="#A0522D">Chestnut</option>
            <option value="#D2B48C">Blonde</option>
            <option value="#FFF5E1">Platinum Blonde</option>
            <option value="#A52A2A">Auburn</option>
            <option value="#FF4500">Red</option>
            <option value="#FFFFFF">White</option>
            <option value="#808080">Gray</option>
            <option value="#FF69B4">Pink</option>
            <option value="#00BFFF">Blue</option>
            <option value="#800080">Purple</option>
            <option value="#00FF00">Green</option>
          </select>
        </label>
        <label>
          Skin Color:
          <select
            value={skinColor}
            onChange={(e) => setSkinColor(e.target.value)}
            className="ml-2"
          >
            <option value="#f2d6cb">Light</option>
            <option value="#f2a07b">Fair</option>
            <option value="#c68642">Medium</option>
            <option value="#8d5524">Tan</option>
            <option value="#5c3d2e">Dark</option>
            <option value="#3d2b1f">Very Dark</option>
          </select>
        </label>
        <label>
          Shorts Color:
          <input
            type="color"
            value={shortsColor}
            onChange={(e) => setShortsColor(e.target.value)}
            className="ml-2"
          />
        </label>
        <label>
          Gloves Color:
          <input
            type="color"
            value={glovesColor}
            onChange={(e) => setGlovesColor(e.target.value)}
            className="ml-2"
          />
        </label>
        <label>
          Eye Color:
          <select
            value={eyeColor}
            onChange={(e) => setEyeColor(e.target.value)}
            className="ml-2"
          >
            <option value="#0000ff">Blue</option>
            <option value="#00a86b">Green</option>
            <option value="#a52a2a">Hazel</option>
            <option value="#ffbf00">Amber</option>
            <option value="#5c4033">Brown</option>
            <option value="#708090">Gray</option>
          </select>
        </label>
      </div>
      <div className="ml-36">
        <canvas ref={canvasRef} width={88} height={200} className="border" />
      </div>

      <canvas ref={canvasHeadRef} width={40} height={48} />
    </div>
  );
};

export default FighterEditor;
