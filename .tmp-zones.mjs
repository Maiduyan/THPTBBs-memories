import fs from 'node:fs';
const zones = JSON.parse(fs.readFileSync('src/data/map_thptbb_zones.json','utf8'));
const ids = (zones.zones ?? zones).map(z => z.id);
const content = fs.readFileSync('src/data/zoneContent.ts','utf8');
const missingContent = ids.filter(id => !new RegExp(`(^|['\"\\s])${id.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&')}['\"]?\\s*:`,'m').test(content));
const missingFiles = ids.filter(id => !fs.existsSync(`public/assets/zones/${id}.svg`));
console.log(JSON.stringify({ count: ids.length, ids, missingContent, missingFiles }, null, 2));
