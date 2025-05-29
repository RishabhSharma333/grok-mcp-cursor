import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config();
const config = {
    API_KEY: process.env['GROK_API_KEY'] || undefined
}
if (!config.API_KEY) {
    throw new Error('[Error] XAI_API_KEY environment variable is required');
}

class GrokServer {
    private server: McpServer;
    private apiKey: string | undefined;
    private baseUrl: string = 'https://api.x.ai/v1/';
    private endpoint: string = 'chat/completions'
    constructor() {
        this.server = new McpServer({
            name: "grok-server",
            version: "1.0.0",
        },
            {
                capabilities: {
                },
            }
        );
        this.apiKey = config.API_KEY as string;

    }

    async handleChatCompletion(messages: any[], options: any = {}): Promise<any> {
        try {
            console.log('chat completion');
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`
            };

            const requestBody = {
                messages,
                model: options.model || 'grok-3-latest',
                stream: false,
                temperature: 0,
                ...options
            };

            const response = await fetch(this.baseUrl + this.endpoint,
                {
                    method: "POST",
                    body: JSON.stringify(requestBody),
                    headers: headers
                });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('[Error] Failed to create chat completion:', error);
            throw error;
        }
    }

    private initializeTool() {
        this.server.tool("grok-model",
            "Use code completion capabilities of Grok",
            { message: z.string(), },
            async ({ message }) => {
                const messages = [{
                    "role": "user",
                    "content": message
                }];
                const response = await this.handleChatCompletion(messages);

                return {
                    content: [{ type: 'text', text: response }]
                }
            }
        );
    }

    async runServer() {
        this.initializeTool();
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
    }
}

const grokServer = new GrokServer();
grokServer.runServer();

