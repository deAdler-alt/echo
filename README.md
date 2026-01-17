# Echo: Local AI Empathy Assistant 🧠💬

**Echo** is a privacy-first web application that helps users refine their communication. It uses a local LLM to instantly transform toxic or rough drafts into professional, empathetic messages. No data ever leaves your device.

## 🚀 Features
- **Zero Privacy Risk:** Runs 100% locally using Ollama.
- **Tone Control:** Choose between *Calm*, *Assertive*, or *Empathetic* rewrites.
- **Instant Feedback:** Explains *why* the new version is better.
- **Modern UI:** Built with React, Tailwind CSS, and Radix UI.

## 🛠️ Setup & Run

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [Ollama](https://ollama.ai/) installed.

### 2. Start the Local AI
Open a terminal and run Ollama with CORS enabled (required for the web app to connect):

```bash
# MacOS / Linux
OLLAMA_ORIGINS="*" ollama serve

# Windows (PowerShell)
$env:OLLAMA_ORIGINS="*"; ollama serve
Ensure you have the model pulled: ollama pull mistral

3. Start the Web App
Open a new terminal window in the project folder:
```

npm install
npm run dev
Open http://localhost:5173 in your browser.

🏗️ Built With
Frontend: React, Vite, Tailwind CSS, Radix UI

AI Backend: Ollama (running Mistral/Llama3)
---
