<div align="center">

# 🔗 Node Mode

**Visual node-based canvas for chaining AI models — zero backend, runs entirely in the browser**

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

</div>

---

Node Mode is a visual pipeline builder for AI models. Drag nodes onto an infinite canvas, connect them together, configure each model in a side panel, and execute the full graph with one click. All API calls go directly from your browser to the provider — no server, no signup.

## ✨ Features

- **Visual node canvas** — infinite scrollable canvas with drag, drop, and connect
- **13+ AI model nodes** — text, image, video, audio, 3D, and speech categories
- **Live output previews** — images, videos, audio, and text show inline on each node
- **Chaining** — pipe the output of one model as the input to the next
- **Topological execution** — resolves dependency order automatically
- **Workflow save/load** — export/import the full canvas as JSON
- **File manager** — browse, download, and delete all generated outputs
- **Scheduler** — cron-based scheduling for automated pipeline runs
- **Undo/Redo** — full action history (Ctrl+Z / Ctrl+Shift+Z)
- **Dark mode** — full light/dark theme toggle
- **Zero backend** — API keys stored in localStorage, calls go directly to providers

## 🤖 Supported Models

OpenAI (GPT-4o, DALL-E 3) · Anthropic (Claude) · Google Gemini · Stable Diffusion · Luma · RunwayML · and more

## 🚀 Quick Start

```bash
git clone https://github.com/RhythrosaLabs/node-mode.git
cd node-mode
npm install
npm run dev
```

Open `http://localhost:5173`, add your API keys in Settings, and start building.

## 🛠️ Tech Stack

- **React + TypeScript** — UI and canvas
- **Vite** — dev server and build
- **Tailwind CSS** — styling

## 🤝 Contributing

PRs welcome. Open an issue first for major changes.

## 📄 License

MIT

## 💛 Support

If Node Mode powers your AI workflows, consider supporting development:

👉 [Donate via PayPal](https://paypal.me/noodlebake) — @noodlebake

---
<div align="center">Made with ❤️ by <a href="https://github.com/RhythrosaLabs">RhythrosaLabs</a></div>
