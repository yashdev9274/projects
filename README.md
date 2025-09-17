# AI Chat App

This project creates an AI-powered chat interface using `@ai-sdk/react` that enables real-time interactions, integrates a browsing tool, and generates React component code snippets from API documentation pages.

## Objectives

- Provide an interactive, streaming chat experience.
- Browse API documentation pages and summarize their content.
- Generate React component code snippets styled with Chakra UI.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Chakra UI
- **AI SDK**: `@ai-sdk/react` and `@ai-sdk/google`
- **Web Scraping**: `cheerio`
- **Syntax Highlighting**: `react-syntax-highlighter`

## Features

### 1. Chat Interface

- Streaming AI responses.
- Syntax-highlighted code snippets for generated components.
- Visual indicators for thinking/browsing/component generation states.

### 2. Browsing Tool (Crawler)

- Integrated within the chat flow.
- Fetches and summarizes content from a given URL.

### 3. Component Generation Tool

- Generates React components from provided API documentation.
- Supports typed props.
- Includes usage examples styled with Chakra UI.

## Setup and Installation

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd ai-chat-interface
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add your Google AI Studio API key:

    ```
    GOOGLE_API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
