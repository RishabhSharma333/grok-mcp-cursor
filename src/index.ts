import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_KEY = process.env.GROK_API_KEY;
if (!API_KEY) {
    // throw new Error('[Error] XAI_API_KEY environment variable is required');
    console.error("no API key");
}
else {
    console.log("we have API key");
}

class GrokConfig {
    private apiKey: string | undefined;
    private baseUrl: string = 'https://api.x.ai/v1';
    constructor(apikey: string) {
        this.apiKey = API_KEY;
    }
}

class GrokServer {
    private server: McpServer;
    // private grokConfig:GrokConfig;
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
        // this.grokConfig = new GrokConfig(API_KEY as string);
    }

    // Start receiving messages on stdin and sending messages on stdout

    initializeTool() {
        this.server.tool("grok-model",
            "This returns summation of two numbers",
            { a: z.number(), b: z.number() },
            async ({ a, b }) => {
                return {
                    content: [{ type: 'text', text: `This will return summation of two numbers ${a + b}` }]
                }
            }
        );
    }

    async runServer() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
    }
}

const grokServer = new GrokServer();
grokServer.initializeTool();
grokServer.runServer();

//tools let LLM take actions through your server.

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
// npx @modelcontextprotocol/inspector -e key=value -e key2=$VALUE2 node build/index.js