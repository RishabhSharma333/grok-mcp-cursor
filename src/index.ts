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
            console.log('[API] Creating chat completion...');
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

            console.log("RESPONSE IS " + response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('[Error] Failed to create chat completion:', error);
            throw error;
        }
    }

    // Start receiving messages on stdin and sending messages on stdout


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

//tools let LLM take actions through your server.

// initializeTool() {
//     this.server.tool("grok-model",
//         "This returns summation of two numbers",
//         { a: z.number(), b: z.number() },
//         async ({ a, b }) => {
//             return {
//                 content: [{ type: 'text', text: `This will return summation of two numbers ${a + b}` }]
//             }
//         }
//     );
// }

// server.tool("grok-model",
//     "This returns summation of two numbers",
//     { a: z.number(), b: z.number() },
//     async ({ a, b }) => {
//         return {
//             content: [{ type: 'text', text: `This will return summation of two numbers ${a + b}` }]
//         }
//     }
// );

// server.tool(
//     "fetch-weather",
//     "this will fethch weather details",
//     { city: z.string() },
//     async ({ city }) => {
//         const response = await fetch(`https://api.weather.com/${city}`);
//         const data = await response.text();
//         return {
//             content: [{ type: "text", text: data }]
//         };
//     }
// );


// resources are how you expose data to the LLMs, they provide data but do not do any significant conputation. It can be dynamic or static

// prompts are reusable templates that help LLMs interact with your server 

// # Pass arguments only
//  npx @modelcontextprotocol/inspector node build/index.js arg1 arg2

// # Pass environment variables only
// npx @modelcontextprotocol/inspector -e key=value -e key2=$VALUE2 node build/index.jsc