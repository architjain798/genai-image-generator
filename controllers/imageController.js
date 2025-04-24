/**
 * Image Controller
 * Handles business logic for image generation, editing, and history.
 */

const path = require("path");
const fs = require("fs");
const axios = require("axios");
const {
  generateImageFromPrompt,
  editImageWithPrompt,
  generateVariationsFromImage,
} = require("../services/openaiService");

// In-memory operation log for demo purposes (replace with DB in prod!)
const history = [];

// Directory to store downloaded/generated images
const SAVED_DIR = path.join(__dirname, "..", "saved");
if (!fs.existsSync(SAVED_DIR)) {
  fs.mkdirSync(SAVED_DIR, { recursive: true });
}

/**
 * Health check endpoint for the server
 */
exports.getHealth = (req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
};

/**
 * Generate image from a text prompt, with options for size, n, model, quality, etc.
 */
exports.generateImage = async (req, res) => {
  const {
    prompt,
    n = 1,
    size = "1024x1024",
    model = "dall-e-3",
    quality = "standard"
  } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    console.log(`[generate-image] Generating image. Prompt: "${prompt}", n: ${n}, size: ${size}, model: ${model}, quality: ${quality}`);

    // --- Pass options to the OpenAI service ---
    const url = await generateImageFromPrompt(prompt, { n, size, model, quality });

    // Download/save as before
    const imgResp = await axios.get(url, { responseType: "arraybuffer" });
    const timestamp = Date.now();
    const safePrompt = prompt.replace(/[^a-z0-9]/gi, "_").substring(0, 32);
    const filename = `image_${safePrompt}_${timestamp}.png`;
    const filepath = path.join(SAVED_DIR, filename);
    fs.writeFileSync(filepath, imgResp.data);
    const savedUrl = `/saved/${filename}`;

    const record = {
      id: history.length + 1,
      type: "generate",
      prompt,
      openai_url: url,
      saved_url: savedUrl,
      saved_path: filepath,
      params: { n, size, model, quality },
      createdAt: new Date().toISOString(),
    };
    history.push(record);

    res.status(201).json(record);
  } catch (err) {
    console.error("[generate-image] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Edit an uploaded image using OpenAI, return OpenAI URL only
 */
exports.editImage = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "Image file is required" });
  if (!req.body.prompt)
    return res.status(400).json({ error: "Prompt is required" });
  const filePath = req.file.path;

  try {
    console.log(
      `[edit-image] Editing image: ${req.file.originalname} with prompt: "${req.body.prompt}"`
    );
    const url = await editImageWithPrompt(filePath, req.body.prompt);

    // You *could* also download and save edited image here similarly, if you want permanent access

    const record = {
      id: history.length + 1,
      type: "edit",
      prompt: req.body.prompt,
      url,
      createdAt: new Date().toISOString(),
    };
    history.push(record);
    fs.unlinkSync(filePath); // Clean up uploaded file
    res.status(201).json(record);
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("[edit-image] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Generate variations of an uploaded image, return OpenAI URLs only
 */
exports.generateVariations = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "Image file is required" });
  const filePath = req.file.path;
  try {
    console.log(
      `[generate-variations] Variating image: ${req.file.originalname}`
    );
    const urls = await generateVariationsFromImage(filePath);

    // You *could* also download and save each variation here if you want permanent access

    const record = {
      id: history.length + 1,
      type: "variation",
      urls,
      createdAt: new Date().toISOString(),
    };
    history.push(record);
    fs.unlinkSync(filePath);
    res.status(201).json(record);
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("[generate-variations] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get (up to 20) most recent generation/edit/variation operations.
 */
exports.getHistory = (req, res) => {
  res.status(200).json(history.slice(-20).reverse());
};

/**
 * Get operation details by operation id.
 */
exports.getImageById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const record = history.find((item) => item.id === id);
  if (!record) return res.status(404).json({ error: "Not found" });
  res.status(200).json(record);
};
