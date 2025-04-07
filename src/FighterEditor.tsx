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

// COMPONENT FUNCTIONS
const drawHair = (ctx: CanvasRenderingContext2D, color: string) => {
  drawPixel(ctx, 12, 1, color);
  drawPixel(ctx, 13, 1, color);
  drawPixel(ctx, 14, 1, color);
  drawPixel(ctx, 15, 1, color);
  drawPixel(ctx, 16, 1, color);
  drawPixel(ctx, 12, 2, color);
  drawPixel(ctx, 13, 2, color);
  drawPixel(ctx, 14, 2, color);
  drawPixel(ctx, 15, 2, color);
  drawPixel(ctx, 16, 2, color);
};

const drawFace = (ctx: CanvasRenderingContext2D, color: string) => {
  for (let y = 3; y <= 6; y++) {
    for (let x = 12; x <= 16; x++) {
      drawPixel(ctx, x, y, color);
    }
  }
};

const drawEyes = (ctx: CanvasRenderingContext2D, color: string) => {
  drawPixel(ctx, 13, 4, color);
  drawPixel(ctx, 15, 4, color);
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
  for (let y = position.y - 8; y <= 12; y++) {
    for (let x = position.x - 4; x <= 16; x++) {
      drawPixel(ctx, x, y, color);
    }
  }
};

const drawArms = (ctx: CanvasRenderingContext2D, color: string) => {
  for (let y = 8; y <= 11; y++) {
    drawPixel(ctx, 10, y, color); // Left arm
    drawPixel(ctx, 18, y, color); // Right arm
  }
};

const drawGloves = (ctx: CanvasRenderingContext2D, color: string) => {
  drawPixel(ctx, 10, 12, color);
  drawPixel(ctx, 18, 12, color);
};

const drawShorts = (ctx: CanvasRenderingContext2D, color: string) => {
  for (let y = 13; y <= 15; y++) {
    for (let x = 12; x <= 16; x++) {
      drawPixel(ctx, x, y, color);
    }
  }
};

const drawLegs = (ctx: CanvasRenderingContext2D, color: string) => {
  // Left leg
  drawPixel(ctx, 12, 16, color);
  drawPixel(ctx, 13, 16, color);
  drawPixel(ctx, 12, 17, color);
  drawPixel(ctx, 13, 17, color);

  // Right leg
  drawPixel(ctx, 15, 16, color);
  drawPixel(ctx, 16, 16, color);
  drawPixel(ctx, 15, 17, color);
  drawPixel(ctx, 16, 17, color);
};

function drawHead(
  ctx: CanvasRenderingContext2D,
  hairColor: string,
  skinColor: string,
  eyeColor: string
) {
  drawHair(ctx, hairColor);
  drawFace(ctx, skinColor);
  drawEyes(ctx, eyeColor);
}

const drawFighter = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  hairColor: string,
  skinColor: string,
  shortsColor: string,
  glovesColor: string,
  eyeColor: string
) => {
  const centerPointX = canvas.width / 2 / scale;
  const centerPointY = canvas.height / 2 / scale;

  drawHead(ctx, hairColor, skinColor, eyeColor);
  drawBody({
    position: { x: centerPointX, y: centerPointY },
    ctx,
    color: skinColor,
  });
  drawArms(ctx, skinColor);
  drawGloves(ctx, glovesColor);
  drawShorts(ctx, shortsColor);
  drawLegs(ctx, skinColor);
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
    drawHead(ctx, hairColor, skinColor, eyeColor);
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
          <input
            type="color"
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
            className="ml-2"
          />
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
      <canvas ref={canvasRef} width={256} height={256} className="border" />
      <canvas ref={canvasHeadRef} width={40} height={48} className="border" />
    </div>
  );
};

export default FighterEditor;
