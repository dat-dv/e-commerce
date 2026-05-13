import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:0.5b';
const CONCURRENCY = 5;
const SAVE_EVERY = 50;

interface BrandDetailed {
  name: string;
  slug: string;
  description_vi: string;
  website_url: string;
  logo_url: string;
  is_verified: boolean;
}

interface OllamaGenerateResponse {
  response: string;
}

interface QueueItem<T = unknown> {
  fn: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

function createLimit(concurrency: number) {
  const queue: QueueItem[] = [];
  let activeCount = 0;

  const next = () => {
    if (queue.length === 0 || activeCount >= concurrency) return;
    activeCount++;
    const item = queue.shift();
    if (!item) return;

    const { fn, resolve, reject } = item;
    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        activeCount--;
        next();
      });
  };

  return <T>(fn: () => Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
  };
}

const limit = createLimit(CONCURRENCY);

const BRAND_PROMPT_TEMPLATE = `
Brand: {{BRAND_NAME}}

Return JSON only:
{
  "description_vi": "",
  "website_url": "",
  "is_verified": true
}

Rules:
- Vietnamese
- Short description
- Realistic website
- No markdown
- No explanation
`;

function cleanJson(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    return text.substring(start, end + 1);
  }
  return text.trim();
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
        options: { temperature: 0.3, num_predict: 120 },
      }),
    });

    if (!response.ok) return null;

    interface OllamaParsedResponse {
      description_vi?: string;
      website_url?: string;
      is_verified?: boolean | string | number;
    }

    const data = (await response.json()) as OllamaGenerateResponse;
    const cleaned = cleanJson(data.response);
    const parsed = JSON.parse(cleaned) as OllamaParsedResponse;

    const website = parsed.website_url || `https://www.${toSlug(brandName)}.com`;

    return {
      name: brandName,
      slug: toSlug(brandName),
      description_vi: parsed.description_vi || `${brandName} là thương hiệu nổi bật trên thị trường.`,
      website_url: website,
      logo_url: `https://www.google.com/s2/favicons?domain=${website}&sz=128`,
      is_verified: Boolean(parsed.is_verified),
    };
  } catch (error) {
    console.error(`❌ ${brandName}`, error);
    return null;
  }
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
