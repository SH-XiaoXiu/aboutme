/**
 * 扫描 src/assets/about/** 下的图片，按子目录分组。
 * 文件名数字前缀排序；同目录 meta.json 可覆盖默认布局与 captions。
 */

import type { ImageLayout } from '../data/resume';

export interface AboutImage {
  src: string;
  filename: string;
  key: string;        // filename 去扩展名，用于 bento key 匹配
  caption?: string;
  aspect?: 'portrait' | 'landscape' | 'square';
}

export interface AboutImageSet {
  dir: string;
  images: AboutImage[];
  layoutOverride?: ImageLayout;
}

// Vite glob 扫描 —— eager: true 表示构建时全部打包进来
const imageModules = import.meta.glob(
  '/src/assets/about/**/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default', query: '?url' }
) as Record<string, string>;

const metaModules = import.meta.glob(
  '/src/assets/about/**/meta.json',
  { eager: true }
) as Record<string, { default?: MetaFile } & MetaFile>;

interface MetaFile {
  layout?: ImageLayout;
  captions?: Record<string, string>;
  aspects?: Record<string, AboutImage['aspect']>;
}

function pathParts(p: string) {
  const parts = p.split('/');
  return {
    dir: parts[parts.length - 2],
    filename: parts[parts.length - 1],
  };
}

function extractNumPrefix(name: string): number {
  const m = name.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 9999;
}

const imagesByDir: Record<string, AboutImage[]> = {};
const metaByDir: Record<string, MetaFile> = {};

// 收集 meta.json
Object.entries(metaModules).forEach(([p, mod]) => {
  const { dir } = pathParts(p);
  metaByDir[dir] = (mod.default || mod) as MetaFile;
});

// 收集图片
Object.entries(imageModules).forEach(([p, url]) => {
  const { dir, filename } = pathParts(p);
  if (!imagesByDir[dir]) imagesByDir[dir] = [];
  const key = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  imagesByDir[dir].push({
    src: url,
    filename,
    key,
    caption: metaByDir[dir]?.captions?.[filename],
    aspect: metaByDir[dir]?.aspects?.[filename],
  });
});

// 每个目录按数字前缀 + 字母序排序
Object.values(imagesByDir).forEach((arr) =>
  arr.sort((a, b) => {
    const na = extractNumPrefix(a.filename);
    const nb = extractNumPrefix(b.filename);
    if (na !== nb) return na - nb;
    return a.filename.localeCompare(b.filename);
  })
);

/** 给定 imageDir（如 '02_origin'），返回图片集 */
export function getAboutImages(dir: string): AboutImageSet {
  return {
    dir,
    images: imagesByDir[dir] || [],
    layoutOverride: metaByDir[dir]?.layout,
  };
}

