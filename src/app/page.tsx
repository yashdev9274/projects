'use client';

import { useChat } from '@ai-sdk/react';
import { Heading, VStack, Box, Text, Input, Button, HStack, Spinner } from "@chakra-ui/react";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useState } from 'react';

interface AisdkToolCall {
  id: string;
  toolName: string;
  args: Record<string, any>;
}

interface LocalToolResult {
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  output: any;
}

export default function Home() {
  const [localToolResults, setLocalToolResults] = useState<LocalToolResult[]>([]);

  const { messages, input, handleInputChange, handleSubmit, isLoading, addToolResult } = useChat({
    api: '/api/chat',
    onToolCall: async ({ toolCall }: { toolCall: any }) => {
      const typedToolCall = toolCall as AisdkToolCall;
      let toolOutput: any;
      if (typedToolCall.toolName === 'browseTool') {
        try {
          const response = await fetch('/api/browse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(typedToolCall.args),
          });
          toolOutput = await response.json();
        } catch (error) {
          console.error('Error executing browseTool:', error);
          toolOutput = { error: 'Failed to connect to browsing service' };
        }
      } else if (typedToolCall.toolName === 'generateComponentTool') {
        try {
          const response = await fetch('/api/generate-component', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(typedToolCall.args),
          });
          toolOutput = await response.json();
        } catch (error) {
          console.error('Error executing generateComponentTool:', error);
          toolOutput = { error: 'Failed to connect to component generation service' };
        }
      } else {
        toolOutput = { error: `Unknown tool: ${typedToolCall.toolName}` };
      }

      addToolResult({ toolCallId: typedToolCall.id, result: toolOutput });

      setLocalToolResults(prev => [...prev, {
        toolCallId: typedToolCall.id,
        toolName: typedToolCall.toolName,
        args: typedToolCall.args,
        output: toolOutput,
      }]);
    },
  });

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">AI Chat Interface</Heading>
        <Box border="1px" borderColor="gray.200" p={4} borderRadius="md" minH="400px" overflowY="auto">
          {messages.map((m) => (
            <Box key={m.id}>
              {m.role === 'user' && (
                <Box mt={2} p={2} bg='blue.50' borderRadius="md">
                  <Text color='blue.500'><strong>You: </strong>{m.content}</Text>
                </Box>
              )}

              {m.role === 'assistant' && (
                <Box mt={2} p={2} bg='green.50' borderRadius="md">
                  <Text color='green.500' whiteSpace="pre-wrap">
                    <strong>AI: </strong>{m.content}
                  </Text>
                  {localToolResults
                    .filter(localToolResult => localToolResult.toolCallId === m.id)
                    .map((localToolResult, toolIndex) => (
                      <Box key={toolIndex} mt={2} p={2} bg="gray.100" borderRadius="md">
                        {localToolResult.toolName === 'browseTool' && (
                          <Box>
                            <Text fontSize="sm" color="gray.600">Browsing URL: {localToolResult.args.url}</Text>
                            {localToolResult.output.error && <Text color="red.500">Error: {localToolResult.output.error}</Text>}
                            {localToolResult.output.summary && (
                              <Text mt={2} fontSize="sm" color="gray.700">
                                <strong>Summary:</strong> {localToolResult.output.summary}
                              </Text>
                            )}
                          </Box>
                        )}
                        {localToolResult.toolName === 'generateComponentTool' && (
                          <Box>
                            <Text fontSize="sm" color="gray.600">Generating Component...</Text>
                            {localToolResult.output.error && <Text color="red.500">Error: {localToolResult.output.error}</Text>}
                            {localToolResult.output.componentCode && (
                              <SyntaxHighlighter language="typescript" style={vs2015} customStyle={{ marginTop: '8px' }}>
                                {localToolResult.output.componentCode}
                              </SyntaxHighlighter>
                            )}
                          </Box>
                        )}
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
          ))}
          {isLoading && (
            <HStack justifyContent="center" mt={4}>
              <Spinner size="sm" />
              <Text>AI is thinking...</Text>
            </HStack>
          )}
        </Box>
        <form onSubmit={handleSubmit}>
          <HStack>
            <Input
              value={input}
              placeholder="Ask the AI to browse a URL or generate a component..."
              onChange={handleInputChange}
              isDisabled={isLoading}
            />
            <Button type="submit" colorScheme="blue" isDisabled={isLoading}>Send</Button>
          </HStack>
        </form>
      </VStack>
    </Box>
  );
}


