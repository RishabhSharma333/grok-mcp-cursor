import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
    name: "grok-server",
    version: "1.0.0",
});

//tools let LLM take actions through your server.

server.tool("grok-model",
    "This returns summation of two numbers",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => {
        return {
            content: [{ type: 'text', text: `This will return summation of two numbers ${a + b}` }]
        }
    }
);

server.tool(
    "fetch-weather",
    { city: z.string() },
    async ({ city }) => {
        const response = await fetch(`https://api.weather.com/${city}`);
        const data = await response.text();
        return {
            content: [{ type: "text", text: data }]
        };
    }
);

// resources are how you expose data to the LLMs, they provide data but do not do any significant conputation