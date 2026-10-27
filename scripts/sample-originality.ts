import fs from 'node:fs';
import path from 'node:path';

const registry = JSON.parse(fs.readFileSync('data/CONTENT_REGISTRY.json', 'utf8'));
const articles = registry.filter((r: any) => r.type === 'article');

// Pick 10 representative articles across 10 categories
const categories = ['records', 'estimate', 'multipliers', 'reset', 'payg', 'high-data', 'occasional', 'video', 'ai', 'mobile'];
const sampledArticles = categories.map(cat => {
  const arts = articles.filter((a: any) => a.category === cat);
  return arts[Math.floor(Math.random() * arts.length)];
});

console.log('Sampled 10 articles:');
for (const art of sampledArticles) {
  const relDir = art.url.replace(/^\//, '').replace(/\/$/, '');
  const filePath = path.resolve('content', relDir, 'index.md');
  const txt = fs.readFileSync(filePath, 'utf8');
  // extract core answer / first paragraph
  const lines = txt.split('\n').filter((l: string) => l.trim().length > 40 && !l.startsWith('#') && !l.startsWith('|') && !l.startsWith('-') && !l.startsWith('```'));
  console.log(`\nURL: ${art.url}`);
  console.log(`Title: ${art.title}`);
  console.log(`Sample paragraph 1: ${lines[0]?.slice(0, 120)}...`);
  console.log(`Sample paragraph 2: ${lines[1]?.slice(0, 120)}...`);
}
