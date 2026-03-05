import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Standardize UI Script (TypeScript Version)
 * 
 * Automation tool to enforce project design tokens and premium typography.
 * Runs in Node.js environment using tsx.
 * 
 * Strictly avoids raw console.log following project standards.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

/**
 * Local Logger Implementation for CLI
 * Mimics the interface of src/utils/logger.ts but for Node.js environment.
 */
const logger = {
  info: (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    process.stdout.write(`[${timestamp}] [INFO] ${message}\n`);
  },
  success: (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    // Green color for success in terminal
    process.stdout.write(`[${timestamp}] [\x1b[32mSUCCESS\x1b[0m] ${message}\n`);
  },
  warn: (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    process.stderr.write(`[${timestamp}] [\x1b[33mWARN\x1b[0m] ${message}\n`);
  },
  error: (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    process.stderr.write(`[${timestamp}] [\x1b[31mERROR\x1b[0m] ${message}\n`);
  }
};

interface TypoRule {
  regex: RegExp;
  replace: string;
}

const colorMap: Record<string, string> = {
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

const typoMap: TypoRule[] = [
  { regex: /font-black uppercase tracking-widest/g, replace: 'font-semibold tracking-wide' },
  { regex: /font-black uppercase tracking-wider/g, replace: 'font-semibold tracking-wide' },
  { regex: /font-bold uppercase tracking-widest/g, replace: 'font-medium tracking-wide' },
  { regex: /font-bold uppercase tracking-wider/g, replace: 'font-medium tracking-wide' },
  { regex: /font-black uppercase/g, replace: 'font-semibold' },
  { regex: /font-bold uppercase/g, replace: 'font-medium' },
  { regex: /uppercase tracking-widest/g, replace: 'tracking-wide' },
  { regex: /uppercase tracking-wider/g, replace: 'tracking-wide' }
];

function walkDir(dir: string, callback: (filePath: string) => void): void {
  if (!fs.existsSync(dir)) return;
  
  fs.readdirSync(dir).forEach((f: string) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

logger.info('Starting UI standardization process...');

let updatedCount = 0;

walkDir(SRC_DIR, (filePath: string) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;
  if (filePath.endsWith('index.ts')) return;

  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  Object.entries(colorMap).forEach(([oldColor, newColor]) => {
    const regex = new RegExp(`\\b${oldColor}(\\d{2,3})\\b`, 'g');
    newContent = newContent.replace(regex, `${newColor}$1`);
  });

  typoMap.forEach(({ regex, replace }) => {
    newContent = newContent.replace(regex, replace);
  });

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    updatedCount++;
    logger.success(`Standardized: ${path.relative(ROOT_DIR, filePath)}`);
  }
});

logger.info(`Standardization complete. ${updatedCount} files were updated.`);
