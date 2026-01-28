const sharp = require('sharp');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Arguments: Title, Subtitle, BgColorLeft, BgColorRight
const args = process.argv.slice(2);
const title = args[0] || "Title Here";
const subtitle = args[1] || "Subtitle Here";
const color1 = args[2] || "#3B82F6"; // Blue-500
const color2 = args[3] || "#1E40AF"; // Blue-800
const outputName = args[4] || `shot_${Date.now()}.png`;

const SCREEN_W = 1290;
const SCREEN_H = 2796;
const DEVICE_SCALE = 0.85; // Scale of device in the image

// Ensure output dir
const outDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

async function generate() {
    console.log(`📸 Capturing Simulator...`);
    try {
        // Capture screenshot from simulator
        const tempRaw = path.join(outDir, 'temp_raw.png');
        execSync(`xcrun simctl io booted screenshot "${tempRaw}"`);

        console.log(`✨ Compositing '${title}'...`);

        // 1. Create Background (SVG gradient)
        const bgSvg = `
        <svg width="${SCREEN_W}" height="${SCREEN_H}">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)" />
            <text x="50%" y="300" font-family="Arial, sans-serif" font-weight="bold" font-size="120" fill="white" text-anchor="middle">${title}</text>
            <text x="50%" y="450" font-family="Arial, sans-serif" font-size="60" fill="rgba(255,255,255,0.8)" text-anchor="middle">${subtitle}</text>
        </svg>
        `;

        // 2. Load Raw Screenshot
        const rawBuffer = await sharp(tempRaw).toBuffer();
        const rawMeta = await sharp(rawBuffer).metadata();

        // 3. Create iPhone Bezel Mask (Rounded Rect)
        // Adjust simulator screenshot to fit into our "mockup"
        // Let's assume we maintain aspect ratio
        const deviceW = SCREEN_W * DEVICE_SCALE;
        const deviceH = rawMeta.height * (deviceW / rawMeta.width);

        // iPhone Frame SVG (Simple Modern Bezel)
        const radius = 60;
        const bezelW = deviceW + 40;
        const bezelH = deviceH + 40;

        const frameSvg = `
        <svg width="${bezelW}" height="${bezelH}">
            <rect x="0" y="0" width="${bezelW}" height="${bezelH}" rx="${radius + 20}" fill="#111" />
            <rect x="20" y="20" width="${deviceW}" height="${deviceH}" rx="${radius}" fill="black" />
        </svg>
        `;

        // 4. Resize Screenshot
        const resizedScreen = await sharp(rawBuffer)
            .resize({ width: Math.round(deviceW) })
            .toBuffer();

        // 5. Composite All
        // Layer order: Background -> Bezel -> Screen
        const finalImage = await sharp(Buffer.from(bgSvg))
            .composite([
                { input: Buffer.from(frameSvg), top: 700, left: Math.round((SCREEN_W - bezelW) / 2) },
                { input: resizedScreen, top: 720, left: Math.round((SCREEN_W - deviceW) / 2) + 20 } // +20 for bezel offset
            ])
            .toFile(path.join(outDir, outputName));

        console.log(`✅ Saved to screenshots/${outputName}`);

        // Cleanup
        fs.unlinkSync(tempRaw);

    } catch (e) {
        console.error("Error:", e.message);
        console.log("Tip: Ensure iOS Simulator is running (npx expo run:ios)");
    }
}

generate();
