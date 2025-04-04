# Interactive Visualization for Large Program Comprehension

### Authors
- PeiQing Guo  
- Yoseph Berhanu Alebachew  
- Khaloud Alharthi  
- Amal Alamri  

---

## 📚 Background

Program comprehension is the process of gaining new or regaining lost knowledge about a computer program. It's a critical yet time-consuming aspect of software development, with developers spending **58%–70%** of their time on it [[Xia et al., 2018]].

Although many tools exist for software documentation and visualization, current solutions often fail to support efficient comprehension. This project aims to address the gap by building an **interactive, multi-level visualization tool** powered by **multi-agent LLMs**.

---

## 🚧 Current Status

We’ve built a working prototype with the following features:

- ✅ Extraction of structural information from a codebase  
- ✅ Interactive **JavaScript/TypeScript frontend** with both UI and chat-based diagram interaction  
- ✅ **Multi-agent LLM backend** to answer questions about the code and highlight/update parts of the visualization accordingly  

---

## 🔜 Upcoming Improvements

Based on feedback from our in-class demo, we plan to:

- 🔄 Enable chat-based navigation through the diagram  
- ❓ Answer more than just structural questions (e.g., code history)  
- ⚡ Improve performance and response speed  
- 🧪 Explore "What-if" editing: Users can ask the AI to visualize potential code changes  

---

## 🔗 How to Access

- **GitHub Repo**: [CS6724/interactive-visualization](https://github.com/CS6724/interactive-visualization)  
- **Demo Video**: [assets/video.mov](https://github.com/CS6724/interactive-visualization/assets/video.mp4)  
- **Live App**: [http://52.87.226.95/](http://52.87.226.95/)

---
### 🚀 To Run Locally

#### 1. Start the Server (Python Backend)
- Rename `.env_example` to `.env` and add your API key inside it.
- Then run:

```bash
cd server
python main.py
```

#### 2. Start the Client (TypeScript Frontend)

- In diagram/src/environments/environment.ts, update the server IP address to match your backend host.
- Then run:

```bash
cd diagram
npm install
npm run serve
```

- Open your browser at http://localhost:3000


## 🧰 Libraries and Frameworks

- **JavaScript/TypeScript** – Frontend development  
- **SQLite** – Stores and queries structural information  
- **LangChain** – Multi-agent LLM pipeline  
- **LLMs** –  
  - `Qwen2.5` (for testing)  
  - `deepseek-r1-distill-llama-70b` (main agent)
