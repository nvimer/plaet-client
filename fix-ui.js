import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const colorMap = {
  'rose-': 'error-',
  'red-': 'error-',
  'amber-': 'warning-',
  'emerald-': 'success-',
  'green-': 'success-',
  'purple-': 'info-',
  'pink-': 'info-',
  'lime-': 'success-',
  'sage-green-': 'sage-'
};

const typoMap = [
  { regex: /font-black uppercase tracking-widest/g, replace: 'font-semibold tracking-wide' },
  { regex: /font-black uppercase tracking-wider/g, replace: 'font-semibold tracking-wide' },
  { regex: /font-bold uppercase tracking-widest/g, replace: 'font-medium tracking-wide' },
  { regex: /font-bold uppercase tracking-wider/g, replace: 'font-medium tracking-wide' },
  { regex: /font-black uppercase/g, replace: 'font-semibold' },
  { regex: /font-bold uppercase/g, replace: 'font-medium' },
  { regex: /uppercase tracking-widest/g, replace: 'tracking-wide' },
  { regex: /uppercase tracking-wider/g, replace: 'tracking-wide' }
];

walkDir(path.join(__dirname, 'src'), (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace colors
  Object.entries(colorMap).forEach(([oldColor, newColor]) => {
    const regex = new RegExp(`\b${oldColor}(\d{2,3})\b`, 'g');
    content = content.replace(regex, `${newColor}$1`);
  });

  // Replace typography
  typoMap.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});