# AI Chat Interface with Browsing & Component Generation

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

## Example Usage

Once the application is running, you can interact with the AI in the chat interface. Here are some example prompts:

-   "Summarize the content of this page: [https://nextjs.org/docs/getting-started](https://nextjs.org/docs/getting-started)"
-   "Generate a React component for a user profile card based on an API that returns `firstName`, `lastName`, `email`, and `avatarUrl`. Use Chakra UI."

## Chosen UI Library: Chakra UI

Chakra UI was chosen for its comprehensive set of accessible and composable React components. It provides a great developer experience with its style props system and dark mode compatibility out of the box. It integrates well with Tailwind CSS, allowing for a flexible and efficient styling approach.

## Notes on Tools, Workflows, and Trade-offs

-   **AI SDK Integration**: The `@ai-sdk/react` and `@ai-sdk/google` libraries were instrumental in quickly setting up streaming chat responses and integrating custom tools (browsing and component generation).
-   **Tooling**: The browsing tool utilizes `cheerio` for efficient server-side HTML parsing and text extraction, which is crucial for summarizing web content.
-   **Component Generation**: The component generation tool leverages the LLM's capabilities to interpret API documentation and produce structured, typed React components with usage examples. This significantly speeds up front-end development.
-   **Styling**: The combination of Tailwind CSS for utility-first styling and Chakra UI for robust, accessible components offers a powerful and flexible styling solution. Tailwind handles low-level styling, while Chakra provides higher-level UI abstractions.
-   **Trade-offs**: While the component generation tool is powerful, it relies on the quality and clarity of the provided API documentation. Ambiguous or poorly structured documentation may lead to less accurate or incomplete component generation. Client-side prop validation could be further enhanced with libraries like `zod` or `yup` for more robust error handling.
