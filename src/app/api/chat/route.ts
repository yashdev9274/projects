import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const maxDuration = 30;

const browseSchema = z.object({
  url: z.string().describe('The URL to browse'),
});

const generateComponentSchema = z.object({
  apiDocs: z.string().describe('The API documentation to use for component generation.'),
});

export async function POST(req: NextRequest) {
  if (!process.env.GOOGLE_API_KEY) {
    return new NextResponse(
      'Missing GOOGLE_API_KEY – make sure to set it in your .env.local file',
      { status: 400 },
    );
  }

  const { messages } = await req.json();

  console.log('Incoming request body:', { messages }); // Added logging
  console.log('Incoming request headers:', req.headers); // Added logging

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Missing or empty messages in request body' }, { status: 400 });
  }

  console.log('Messages before streamText:', messages); // Added for debugging

  const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
  const model = google('models/gemini-1.5-flash-latest') as any;

  // Add a system message to instruct the AI to always provide a textual response after a tool call
  messages.push({ role: 'system', content: 'When you use a tool, always provide a brief textual summary of what the tool did or what you found, in addition to the tool call itself. You can also generate React components with Chakra UI from API documentation. To do this, provide the API documentation to the `generateComponent` tool.' });

  const result = await streamText({
    model,
    messages,
    tools: {
      browse: tool({
        description: 'Fetches content from a URL and summarizes it.',
        parameters: browseSchema,
        execute: async ({ url }: { url: string }) => {
          const parsedInput = browseSchema.parse({ url });
          try {
            const response = await fetch(`${req.nextUrl.origin}/api/browse`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: parsedInput.url }),
            });
            const data = await response.json();
            if (response.ok) {
              return { summary: data.summary };
            } else {
              return { error: data.error || 'Failed to browse URL' };
            }
          } catch (error) {
            if (error instanceof z.ZodError) {
              return { error: 'Invalid input for browse tool', details: error.errors };
            }
            console.error('Error in browseTool:', error);
            return { error: 'Failed to connect to browsing service' };
          }
        },
      }),
      generateComponent: tool({
        description: 'Generates a React component with Chakra UI styling from provided API documentation.',
        parameters: generateComponentSchema,
        execute: async ({ apiDocs }: { apiDocs: string }) => {
          const parsedInput = generateComponentSchema.parse({ apiDocs });
          try {
            const response = await fetch(`${req.nextUrl.origin}/api/generate-component`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ apiDocs: parsedInput.apiDocs }),
            });
            const data = await response.json();
            if (response.ok) {
              return { componentCode: data.componentCode };
            } else {
              return { error: data.error || 'Failed to generate component' };
            }
          } catch (error) {
            if (error instanceof z.ZodError) {
              return { error: 'Invalid input for generateComponent tool', details: error.errors };
            }
            console.error('Error in generateComponentTool:', error);
            return { error: 'Failed to connect to component generation service' };
          }
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}

