# Node Mode — AI Pipeline Builder

> A visual, node-based canvas for chaining together AI models to build powerful multi-step generation pipelines — directly in your browser, with zero backend required.

![Node Mode Screenshot](docs/screenshot.png)

---

## ✨ Features

- **Visual node canvas** — drag, drop, and connect AI model nodes on an infinite scrollable canvas
- **13+ AI model nodes** across text, image, video, audio, 3D, and speech categories
- **Live output previews** — generated images, videos, audio, and text show inline on each node
- **Connect models together** — pipe the output of one model as the input to the next
- **Prompt configuration panel** — click any node to configure model, prompt, temperature, size, and more in a side panel
- **Execute pipelines** — run the full graph with one click; the engine topologically resolves dependencies
- **Workflow save / load** — export the entire canvas to a JSON file and reload it later
- **File manager** — browse, download, and delete all generated outputs
- **Scheduler** — set cron-based schedules to run pipelines automatically
- **Undo / redo** — full history for all canvas actions (Ctrl/Cmd+Z / Ctrl+Shift+Z)
- **Delete nodes** — select a node and press Delete/Backspace, or click the trash icon
- **Dark mode** — full light/dark theme toggle
- **Keyboard shortcuts** — Ctrl/Cmd+Enter to run, Esc to abort, Delete/Backspace to delete selected node
- **Zero backend** — all API keys are stored locally in your browser (localStorage) and calls go directly to the provider

---

## 🖥️ Screenshots

| Canvas | Node Config Panel | File Manager |
|---|---|---|
| ![Canvas](docs/canvas.png) | ![Config](docs/config.png) | ![Files](docs/files.png) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for the AI providers you want to use (see [API Setup](#-api-setup))

### Install & Run

```bash
git clone https://github.com/RhythrosaLabs/node-mode.git
cd node-mode
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔑 API Setup

Node Mode talks directly to AI provider APIs from your browser. No keys are ever stored on a server.

1. Click the **⚙️ Settings** button in the top-right corner
2. Enter your API key and toggle the provider ON
3. Start adding nodes!

| Provider | Used By | Get Key |
|---|---|---|
| **OpenAI** | GPT-4, DALL·E 3 | [platform.openai.com](https://platform.openai.com) |
| **Anthropic** | Claude 3.5 Sonnet / Opus / Haiku | [console.anthropic.com](https://console.anthropic.com) |
| **Google AI** | Gemini 1.5 Pro / Flash, Imagen | [aistudio.google.com](https://aistudio.google.com) |
| **Stability AI** | Stable Diffusion XL | [platform.stability.ai](https://platform.stability.ai) |
| **Perplexity** | Online-search-augmented LLMs | [www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api) |
| **Luma AI** | Dream Machine video | [lumalabs.ai](https://lumalabs.ai) |
| **Runway ML** | Gen-2 image & video | [runwayml.com](https://runwayml.com) |
| **Replicate** | 3D generation, audio, TTS | [replicate.com](https://replicate.com) |

---

## 🧩 Node Types

### 📝 Text Generation
| Node | Model | Description |
|---|---|---|
| **OpenAI Text** | GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo | Chat completion via OpenAI |
| **Anthropic Text** | Claude 3.5 Sonnet, Opus, Haiku | Chat completion via Anthropic |
| **Google AI Text** | Gemini 1.5 Pro, Flash, Gemini Pro | Text generation via Google Generative AI |
| **Perplexity Text** | Sonar Large/Small (online) | Internet-connected LLM for real-time info |

### 🎨 Image Generation
| Node | Model | Description |
|---|---|---|
| **OpenAI Image** | DALL·E 3 | High-quality image generation |
| **Stability Image** | Stable Diffusion XL 1.0 | Fine-tunable SDXL generation with negative prompts |
| **Google AI Image** | Imagen | Google's image generation model |
| **Runway Image** | Runway Gen-2 | Cinematic image generation |

### 🎬 Video Generation
| Node | Model | Description |
|---|---|---|
| **Luma Video** | Dream Machine | Text-to-video via Luma AI |
| **Runway Video** | Gen-2 | High-quality text-to-video |

### 🔊 Audio & Speech
| Node | Model | Description |
|---|---|---|
| **Audio Generation** | MusicGen (Replicate) | Music and sound generation from text prompts |
| **Text to Speech** | Bark (Replicate) | Natural-sounding speech synthesis |

### 🧊 3D
| Node | Model | Description |
|---|---|---|
| **3D Model Generation** | Shap·E (Replicate) | Text-to-3D mesh generation |
| **Model 3D Viewer** | Three.js | Preview generated 3D models interactively |

---

## 🔗 Building Pipelines

1. **Add nodes** — click **+ Add Node** in the top-left and pick from the categorised list
2. **Configure nodes** — click any node to open the config panel on the right; set the prompt, model, and options
3. **Connect nodes** — click the green output port of one node, then click the blue input port of another
4. **Run the pipeline** — click **▶ Run** (or press **Ctrl/Cmd+Enter**)

> **Tip:** For standalone nodes, just set the prompt in the config panel and click Run — no connections are needed.

### Example Pipeline

```
[OpenAI Text: "write a sci-fi scene"]
          ↓ Generated Text
[Stability Image: use text as prompt]
          ↓ Generated Image
[Model 3D Viewer: preview the scene]
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + Enter` | Execute the pipeline |
| `Esc` | Abort execution / cancel active connection |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Delete` / `Backspace` | Delete selected node |
| `Ctrl/Cmd + Scroll` | Zoom in / out |
| `Scroll` | Pan the canvas |

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Canvas.tsx              # Main infinite canvas with DnD
│   ├── ExecutionControls.tsx   # Run / Stop / Save / Load / Schedule bar
│   ├── NodeSearch.tsx          # Searchable node picker
│   ├── canvas/
│   │   ├── ConnectionLine.tsx  # Bezier SVG connection lines
│   │   └── Grid.tsx            # Dot-grid background
│   ├── files/
│   │   └── FileManagerModal.tsx
│   ├── node/
│   │   ├── Node.tsx            # Node card component
│   │   ├── NodeConfig.tsx      # Side-panel config
│   │   ├── AINodeConfig.tsx    # Per-type config form
│   │   ├── NodePort.tsx        # Input / output port dots
│   │   ├── NodePreview.tsx     # Inline output preview
│   │   ├── NodeStatus.tsx      # Running/done/error badge
│   │   └── Model3DViewer.tsx   # Three.js 3D preview
│   ├── scheduler/
│   │   └── ScheduleModal.tsx
│   └── settings/
│       ├── SettingsButton.tsx
│       └── SettingsPanel.tsx
├── hooks/
│   └── useKeyboardShortcuts.ts
├── services/ai/              # Direct API service wrappers
│   ├── openAIService.ts
│   ├── anthropicService.ts
│   ├── googleAIService.ts
│   ├── stabilityAIService.ts
│   ├── perplexityService.ts
│   ├── lumaService.ts
│   ├── runwayService.ts
│   └── replicateService.ts
├── store/                    # Zustand state
│   ├── nodeStore.ts          # Nodes, connections, undo/redo
│   ├── executionStore.ts     # Pipeline execution engine
│   ├── fileStore.ts          # Generated file management
│   ├── schedulerStore.ts     # Cron scheduling
│   ├── settingsStore.ts      # API keys (persisted)
│   └── themeStore.ts
├── types/
│   ├── ai.ts
│   ├── execution.ts
│   ├── node.ts
│   └── settings.ts
└── utils/
    ├── connectionUtils.ts
    ├── executionUtils.ts     # Per-node execution dispatch
    ├── nodeTemplates.ts      # Node default configs
    ├── nodeUtils.ts
    └── validationUtils.ts
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Zustand](https://zustand-demo.pmnd.rs) | State management |
| [@dnd-kit](https://dndkit.com) | Drag-and-drop canvas |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Three.js / @react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | 3D model viewer |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Lucide React](https://lucide.dev) | Icons |
| [Sonner](https://sonner.emilkowal.ski) | Toast notifications |

---

## 🔒 Privacy & Security

- **No backend, no telemetry.** This is a pure client-side app.
- API keys are encrypted in browser localStorage by your browser — they never leave your machine except as the `Authorization` header sent directly to the AI provider's endpoint.
- Never commit your real API keys. The `.env.example` file shows available environment variable names, but the app reads keys from Settings UI → localStorage at runtime.

---

## 🤝 Contributing

Pull requests are welcome!

```bash
# Fork the repo, then:
git checkout -b feature/my-new-node
npm run dev
# make your changes, then:
npm run build   # must pass with no errors
git push origin feature/my-new-node
# open a PR
```

### Adding a new AI node

1. Add the node type constant to `src/utils/nodeTemplates.ts` (`NODE_TYPES`) and create a template entry in `createNodeTemplate`
2. Add the category to the `categories` object in `src/components/NodeSearch.tsx`
3. Add the execution logic to `src/utils/executionUtils.ts` (`executeNode` switch)
4. Add a config form case to `src/components/node/AINodeConfig.tsx`
5. Add a preview case to `src/components/node/NodePreview.tsx` (if the output type is new)

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.


## Support

If you find this useful, consider supporting via [PayPal](https://paypal.me/noodlebake)

🌐 [Portfolio: rhythrosalabs.github.io](https://rhythrosalabs.github.io) (more apps, music and sound design)
