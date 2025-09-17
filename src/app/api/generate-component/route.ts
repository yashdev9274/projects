import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  if (!process.env.GOOGLE_API_KEY) {
    return new NextResponse(
      'Missing GOOGLE_API_KEY – make sure to set it in your .env.local file',
      { status: 400 },
    );
  }

  const { apiDocs } = await req.json();

  if (!apiDocs) {
    return NextResponse.json({ error: 'API documentation is required' }, { status: 400 });
  }

  const componentSchema = z.object({
    componentCode: z.string().describe('The React component code with Chakra UI styling.'),
  });

  const prompt = "You are an expert in generating beautiful and functional React components using Chakra UI and TypeScript.\n\nYour task is to create a new component based on the provided API documentation.\n\n**Instructions:**\n1.  **Analyze the API:** Understand the data structure and the props the component will need.\n2.  **Create Props Interface:** Define a clear TypeScript interface for the component's props.\n3.  **Build the Component:** Write clean, well-structured JSX with appropriate Chakra UI components (e.g., Box, Stack, Heading, Text, etc.).\n4.  **Style with Chakra:** Use Chakra's style props for elegant and responsive design.\n5.  **Include a Usage Example:** Provide a clear example of how to import and use the component.\n6.  **Format Output:** Respond with the component code and usage example within a single markdown block (e.g., ```tsx ... ```).\n\n**API Documentation:**\n```\n" + apiDocs + "```\n";

  const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY || '' });
  const model = google('models/gemini-1.5-flash-latest') as any;

  try {
    const { object: { componentCode } } = await generateObject({
      model,
      schema: componentSchema,
      prompt,
    });

    return NextResponse.json({ componentCode });

  } catch (error: any) {
    console.error('Error generating component:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to generate component', details: errorMessage }, { status: 500 });
  }
}
