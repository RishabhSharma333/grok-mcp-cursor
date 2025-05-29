# grok-mcp for cursor
This package will create a local MCP server which can be used with Cursor AI for agent mode

## Features
It will use Grok's AI model to generate responses, hence can be used with Cursor using MCP servers

## Requirements
1. Nodejs
2. Grok API key

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/RishabhSharma333/grok-mcp-cursor.git
   cd grok-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Add its details inside mcp.json file found in .cursor folder

It should look similar to this depending upon how many servers are already added. If any configuration is already present, make an new object under "mcpServers" similar to this.

```bash
   {
  "mcpServers": {
    "grok-mcp": {
      "env": {
        "Grok_API_KEY": "<yourGrokAPIKeyHere>"
      },
      "command": "node",
      "args": [
        "<pathTogrok-mcp>/grok-mcp-server/build/index.js"
      ]
    },

    "any-other-mcp-server":{

    }
    ...
  }
}
   ```

After configuration is added, cursor will show 'grok-mcp' under MCP server settings. and 'grok-model' under tool

## Running 
```bash
XAI_API_KEY="your-grok-api-key" node build/index.js
```

## Checks
Before adding to cursor MCP configuration, We can also check if it is running locally using command below
```bash
npx @modelcontextprotocol/inspector -e GROK_API_KEY=<yourGrokApiKey> node <pathtogrok-mcp-server-folder>/build/index.js
```