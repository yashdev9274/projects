import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (!process.env.GOOGLE_API_KEY) {
    return new NextResponse(
      'Missing GOOGLE_API_KEY – make sure to set it in your .env.local file',
      { status: 400 },
    );
  }

  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: response.status });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $('script, style, noscript, iframe, img, svg, header, footer, nav').remove();

    const textContent = $('body').text().replace(/\s\s+/g, ' ').trim();

    if (!textContent) {
      return NextResponse.json({ error: 'Could not extract text content from the URL.' }, { status: 400 });
    }

    const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
    const model = google('models/gemini-1.5-flash-latest') as any;

    const { text } = await generateText({
      model,
      prompt: `Summarize the following content from ${url} in 3-5 sentences:\n\n${textContent.slice(0, 15000)}`,
    });

    return NextResponse.json({ summary: text });

  } catch (error) {
    console.error('Error browsing URL:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to browse URL', details: errorMessage }, { status: 500 });
  }
}
