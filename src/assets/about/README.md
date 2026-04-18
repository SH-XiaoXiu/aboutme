# About 章节图片目录

每个子目录对应一个 About 编辑块。把图片扔进去，前端自动识别并按数量选择版式。

## 目录

- `01_manifesto/` — 开场，0-1 张（无图也优雅）
- `02_origin/` — 起源，2 张：老电脑/服务器、Minecraft 截图
- `03_contradictions/` — 矛盾，0 张（纯文字最佳），若想加 1 张抽象图也行
- `04_daily/` — 日常 bento：desk.jpg, keyboard.jpg, mouse.jpg, coffee.jpg, sea.jpg, focus.jpg, sleep.jpg（文件名自由，但与 bentoItems.key 同名会自动关联）
- `05_relationship/` — 关于他，0-1 张
- `06_now/` — 在做，0-1 张（抽象最好）
- `07_signature/` — 尾签，0-1 张

## 命名规则

- 普通排序：`01.jpg` / `02.jpg` / `03.jpg` ...
- 对应 bento tile 的：文件名前缀与 `bentoItems[i].key` 相同（如 `desk.jpg`）
- 支持 `.jpg` / `.jpeg` / `.png` / `.webp`

## 可选 meta.json

在子目录内放 `meta.json`：

```json
{
  "layout": "gallery",
  "captions": { "01.jpg": "2019 年的工位" }
}
```

可覆盖 `imageLayout` 自动推断，也可为单张图片添加 caption。

## 自动版式规则

| 图片数 | 版式 |
|--------|------|
| 0 张 | 纯文字版（留白 + 几何装饰） |
| 1 张 | portrait-side：图文左右分栏 |
| 2 张 | split-reveal：大图 + 小图错位 |
| 3 张 | gallery-grid：网格瀑布 |
| 4+ 张 | masonry / marquee |

bento 块内的 tile 会自动关联与 key 同名的图片。
