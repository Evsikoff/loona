// Сборка игры: npm run build. Используется и для хостинга VK (npm run deploy), и для Vercel (см. vercel.json).
// Складывает в папку build/ всё, что нужно игре: index.html, скрипты и картинки.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Видео-интро (intro.mp4). На хостинге VK видео- и аудиофайлы размещать нельзя, поэтому по умолчанию в сборку оно не попадает.
// Чтобы интро было, выложите intro.mp4 на любой HTTPS-хостинг и впишите сюда ссылку
// (или задайте переменную окружения LOONA_INTRO_URL). Пустая строка - игра начинается сразу после загрузки, без интро.
// Имя локального файла (LOONA_INTRO_URL=intro.mp4) кладёт видео прямо в сборку - так делает vercel.json.
const INTRO_VIDEO_URL = process.env.LOONA_INTRO_URL ?? '';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'build');

const SCRIPTS = ['moon_january.js', 'vk.js', 'vk-bridge.min.js'];
// cta.png - старая картинка стартового экрана, игрой больше не используется.
const SKIP_IMAGES = new Set(['cta.png']);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

const html = readFileSync(join(ROOT, 'moon_january.html'), 'utf8');
const config = `<script>window.LOONA_INTRO_URL = ${JSON.stringify(INTRO_VIDEO_URL)};</script>`;
if (!html.includes('</title>')) throw new Error('moon_january.html: не найден <title>, некуда вставить настройки сборки');
writeFileSync(join(OUT, 'index.html'), html.replace('</title>', `</title>\n  ${config}`));

for (const file of SCRIPTS) {
  if (!existsSync(join(ROOT, file))) throw new Error(`Нет файла ${file}`);
  copyFileSync(join(ROOT, file), join(OUT, file));
}

const images = readdirSync(ROOT).filter((f) => f.toLowerCase().endsWith('.png') && !SKIP_IMAGES.has(f));
for (const file of images) copyFileSync(join(ROOT, file), join(OUT, file));

const introIsLocalFile = INTRO_VIDEO_URL !== '' && !/^([a-z]+:)?\/\//i.test(INTRO_VIDEO_URL);
if (introIsLocalFile) {
  if (!existsSync(join(ROOT, INTRO_VIDEO_URL))) throw new Error(`Нет файла ${INTRO_VIDEO_URL}`);
  copyFileSync(join(ROOT, INTRO_VIDEO_URL), join(OUT, INTRO_VIDEO_URL));
}

console.log(`Сборка готова: build/ (index.html, ${SCRIPTS.length} скрипта, ${images.length} картинок).`);
console.log(INTRO_VIDEO_URL ? `Видео-интро: ${INTRO_VIDEO_URL}` : 'Видео-интро отключено (на хостинге VK видео запрещено).');
