# Patterns in the Void — 本地复刻版

这是 https://patternsinthevoid.net/ 的完整本地复刻，保留了原站的复古 ASCII art 风格、
Browser Ponies 桌面小马动画、以及全部子页面。

## 内容

- `index.html` — 主页（"singleton / offctrl ai" ASCII logo、导航、对话气泡、小马动画开关）
- `canary.html` / `canary.css` — 监视者宣言（Warrant Canary）页面
- `history.html` — OFFCTRL AI 黑客马拉松旅程时间线（内容取自 offctrl.ai 与 single0.com）
- `hyphae.html` + `hyphae/hyphae.pdf` — "Hyphae: Social Secret Sharing" 研究页 + 论文 PDF
- `𓊨𓏏𓏭𓆗.html` + `asciiart.css` + `lato-regular.woff` — 彩色的巨型 ASCII 画页面
- `cv.pdf` — 原站 CV（原样存档）
- `Browser-Ponies/` — 小马动画的全部 JS 与 GIF/音效素材（9 只小马）

## 与原站的差异

- 所有资源改为本地相对路径，不依赖原域名即可完整运行
- 外链中博客仍指向原站；CODE 导航已改为站主本人的 GitHub（https://github.com/SingletonYe）
- 页面本身未做任何内容修改，ASCII 画、文案、链接结构与原站一致

## 本地预览

```bash
cd patternsinthevoid
python3 -m http.server 8000
```

然后打开 http://localhost:8000/。
