// Central configuration for build-time AI image generation.
// Change model names, quality tiers or sizes here without touching the generator.
export const IMAGE_MODELS = {
  flare: process.env.OPENAI_IMAGE_MODEL_FLARE || 'gpt-image-2.5-flare',
  sunburst: process.env.OPENAI_IMAGE_MODEL_SUNBURST || 'gpt-image-2.5-sunburst',
};

export const IMAGE_QUALITY = {
  default: process.env.OPENAI_IMAGE_QUALITY_DEFAULT || 'medium',
  premium: process.env.OPENAI_IMAGE_QUALITY_PREMIUM || 'high',
};

export const IMAGE_SIZES = {
  square: '1024x1024',
  landscape: '1536x1024',
  portrait: '1024x1536',
};

export const GENERATION = {
  endpoint: 'https://api.openai.com/v1/images/generations',
  rawDir: 'tmp/generated',
  outputDir: 'public/images/generated',
  webpQuality: 82,
  // Responsive widths produced for every generated asset (original width is always kept).
  variantWidths: [640, 960, 1280],
  requestTimeoutMs: 240_000,
};

// Shared art direction, appended to every prompt so the set reads as one brand ecosystem.
export const ART_DIRECTION =
  'Photorealistic editorial architectural photography for a luxury architectural-hardware brand. ' +
  'Palette of deep midnight navy, warm champagne gold and soft ivory stone. Refined, quiet luxury, ' +
  'natural materials, precise reflections, shallow depth of field where appropriate. ' +
  'No text, no logos, no lettering, no watermarks, no people facing the camera.';

/**
 * Model routing: Flare is the default; Sunburst is reserved for the hero and other
 * premium, detail-sensitive architectural compositions.
 */
export function selectModel({ tier = 'standard', complexity = 'low' }) {
  return tier === 'hero' || complexity === 'high' ? IMAGE_MODELS.sunburst : IMAGE_MODELS.flare;
}

export function selectQuality({ tier = 'standard' }) {
  return tier === 'hero' || tier === 'key' ? IMAGE_QUALITY.premium : IMAGE_QUALITY.default;
}
