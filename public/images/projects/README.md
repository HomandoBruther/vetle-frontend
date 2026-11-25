# Project thumbnails

Drop project images here. Everything in `public/` is copied as-is into the built site, so a file at

```
public/images/projects/unity-car-game.webp
```

is served at `/images/projects/unity-car-game.webp`. That path is what goes in a project's `imageUrl`.

## Guidelines

- **Aspect ratio 16:9.** Cards crop images to 16:9 (`object-fit: cover`), so other ratios lose their edges.
- **Size about 1280 × 720.** That's sharp enough on high-DPI screens without being heavy.
- **Format `.webp`** (or `.jpg` for photos, `.png` for screenshots with sharp text). WebP is usually 25–35% smaller than JPEG.
- **Keep files under ~300 kB.** Large images are the most common reason a portfolio site feels slow.
- **Names in kebab-case** (`data-platform.webp`, not `Data Platform (1).PNG`). URLs are case-sensitive on most hosts, and spaces need escaping.
- **No confidential content.** Screenshots of client work may show data or UI you're not allowed to share. Use diagrams or neutral illustrations for those projects.

Projects without an image get a generated gradient placeholder, so nothing breaks while this folder is empty.
