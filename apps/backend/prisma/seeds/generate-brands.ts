import * as fs from 'fs';
import * as path from 'path';
import { jsonrepair } from 'jsonrepair';
import pLimit from 'p-limit';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:0.5b';
const CONCURRENCY = 5;
const SAVE_EVERY = 50;

interface BrandDetailed {
  name: string;
  slug: string;
  description_vi: string;
  description_en: string;
  website_url: string;
  logo_url: string;
  is_verified: boolean;
}

interface OllamaGenerateResponse {
  response: string;
}

const limit = pLimit(CONCURRENCY);

interface OllamaParsedResponse {
  description_vi?: string;
  description_en?: string;
  website_url?: string;
  is_verified?: boolean | string | number;
}

const BRAND_PROMPT_TEMPLATE = `
Brand: {{BRAND_NAME}}

Return ONLY valid minified JSON:
{
"description_vi":"",
"description_en":"",
"website_url":"",
"is_verified":true
}

Rules:
- description_vi: 40-60 words, professional Vietnamese
- description_en: 30-50 words, professional English
- website: realistic
- valid JSON only
- no markdown
`;

function cleanJson(text: string) {
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .trim();
}

function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

async function callOllama(brandName: string): Promise<BrandDetailed | null> {
  const prompt = BRAND_PROMPT_TEMPLATE.replace(/{{BRAND_NAME}}/g, brandName);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: { temperature: 0.2, num_predict: 250 },
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as OllamaGenerateResponse;
    const cleaned = cleanJson(data.response);

    try {
      const parsed = JSON.parse(cleaned) as OllamaParsedResponse;
      return buildBrandResult(brandName, parsed);
    } catch {
      try {
        const repaired = jsonrepair(cleaned);
        const parsed = JSON.parse(repaired) as OllamaParsedResponse;
        return buildBrandResult(brandName, parsed);
      } catch (e) {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');

        if (start !== -1 && end !== -1) {
          try {
            const sliced = cleaned.slice(start, end + 1);
            const repaired = jsonrepair(sliced);
            const parsed = JSON.parse(repaired) as OllamaParsedResponse;
            return buildBrandResult(brandName, parsed);
          } catch {
            return null;
          }
        }
        return null;
      }
    }
  } catch (error) {
    console.error(`❌ ${brandName}`, error);
    return null;
  }
}

function buildBrandResult(brandName: string, parsed: OllamaParsedResponse): BrandDetailed {
  const website = parsed.website_url || `https://www.${toSlug(brandName)}.com`;
  return {
    name: brandName,
    slug: toSlug(brandName),
    description_vi: parsed.description_vi || `${brandName} là thương hiệu nổi bật trên thị trường.`,
    description_en: parsed.description_en || `${brandName} is a leading brand in the market.`,
    website_url: website,
    logo_url: `https://www.google.com/s2/favicons?domain=${website}&sz=128`,
    is_verified: Boolean(parsed.is_verified),
  };
}

function saveFile(targetPath: string, data: BrandDetailed[]) {
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
}

async function main() {
  const datasetDir = path.join(__dirname, '../dataset/brands');
  const brandsPath = path.join(datasetDir, 'brands.json');
  const targetPath = path.join(datasetDir, 'brands_detailed.json');

  if (!fs.existsSync(brandsPath)) {
    console.error('❌ Không tìm thấy file brands.json');
    return;
  }

  const brandNames = JSON.parse(fs.readFileSync(brandsPath, 'utf-8')) as string[];
  console.log(`🚀 Generating ${brandNames.length} brands...`);

  const detailedBrands: BrandDetailed[] = [];

  if (fs.existsSync(targetPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(targetPath, 'utf-8')) as unknown;
      if (Array.isArray(existing)) {
        detailedBrands.push(...(existing as BrandDetailed[]));
        console.log(`ℹ️ Loaded ${existing.length} existing brands`);
      }
    } catch {
      //
    }
  }

  const existingNames = new Set(detailedBrands.map((b) => b.name));
  let processed = 0;

  const tasks = brandNames.map((name) =>
    limit(async () => {
      if (existingNames.has(name)) return;

      console.log(`🤖 ${name}`);
      const detail = await callOllama(name);
      if (!detail) return;

      detailedBrands.push(detail);
      processed++;

      if (processed % SAVE_EVERY === 0) {
        console.log(`💾 Saving progress (${processed})...`);
        saveFile(targetPath, detailedBrands);
      }
    }),
  );

  await Promise.all(tasks);
  saveFile(targetPath, detailedBrands);
  console.log(`🏁 Done! Saved to ${targetPath}`);
}

main().catch(console.error);
