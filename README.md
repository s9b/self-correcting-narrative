# Self-Correcting Narrative Engine (Writer's Room)

Turn a short user prompt into a staged, improved story by simulating a writer's room: Draft → Critique (2 agents) → Revised Draft → Illustration + Voiceover.

This project was built in 24 hours for the [ACTA Global Hackathon](https://www.acta.so/hackathon).

**Live Demo:** [Link to your Vercel deployment]

**Demo Video:** [Link to your 60s Loom/YouTube video]

---

## Features

*   **Iterative Story Generation:** Watch a story evolve from a simple idea to a polished narrative.
*   **AI Agent Collaboration:** A team of AI agents (Storyteller, Character Coach, World Builder) work together to improve the story.
*   **AI-Generated Illustration:** Each story is accompanied by a unique, AI-generated image.
*   **Text-to-Speech Narration:** Listen to the final story with a "Play Narration" button.
*   **Polished UI:** A clean, dark-mode interface with smooth animations to visualize the creative process.

## Tech Stack

*   **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion
*   **Backend:** Next.js API Routes
*   **AI:** Google Gemini API
*   **Deployment:** Vercel

## Getting Started

To run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/s9b/self-correcting-narrative.git
    cd self-correcting-narrative
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Hackathon Compliance

This project adheres to the hackathon rules. The initial commit includes a `.hackathon-start` file with a timestamp to verify that the project was created within the 24-hour timeframe.