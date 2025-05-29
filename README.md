# Grok MCP for Cursor

The `grok-mcp-cursor` package provides a local Model Context Protocol (MCP) server, enabling integration with Cursor AI in agent mode. It leverages the Grok AI model from xAI to generate responses, offering a seamless experience for developers using Cursor.

## Features
- Utilizes the Grok AI model to generate response.
- Compatible with Cursor AI via MCP server integration.

## Prerequisites
- Node.js (version 16 or higher recommended)
- A valid Grok API key from xAI

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/RishabhSharma333/grok-mcp-cursor.git
   cd grok-mcp-cursor
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Project**:
   ```bash
   npm run build
   ```

4. **Configure Cursor MCP Settings**:
   - Locate the `mcp.json` file in the `.cursor` directory of your user home folder.
   - Add the following configuration to `mcp.json`. :
     ```json
     {
       "mcpServers": {
         "grok-mcp": {
           "env": {
             "GROK_API_KEY": "<yourGrokAPIKeyHere>"
           },
           "command": "node",
           "args": [
             "<pathtoGrokMcpFolder>/build/index.js"
           ]
         }
       }
     }
     ```
   - If any configuration is already present, make an new object under "mcpServers".
   - Replace `<yourGrokAPIKeyHere>` with your Grok API key and `<pathToGrokMcpFolder>` with the absolute path to the `grok-mcp-cursor` folder.
   - After configuration, the `grok-mcp` server will appear in Cursor’s MCP server settings, and the `grok-model` will be visible under tools.

## Running the Server

To start the MCP server locally, execute the following command, replacing `<yourGrokAPIKey>` with your Grok API key:

```bash
XAI_API_KEY=<yourGrokAPIKey> node <pathToGrokMcpFolder>/build/index.js
```

## Verification

Before integrating with Cursor, to verify that the server runs correctly, we can use [MCP inspector](https://modelcontextprotocol.io/docs/tools/inspector):

```bash
npx @modelcontextprotocol/inspector -e GROK_API_KEY=<yourGrokAPIKey> node <pathToGrokMcpFolder>/build/index.js
```

This command checks the server’s functionality and ensures it is operational.

## Notes
- Ensure the `.env` file is not committed to version control. Add `.env` to your `.gitignore` file to prevent exposing sensitive information like API keys.
- For production environments, consider setting environment variables directly on your server instead of relying on a `.env` file.

## Contributing
Contributions are welcome! Please submit issues or pull requests via the [GitHub repository](https://github.com/RishabhSharma333/grok-mcp-cursor).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Model Context Protocol](https://github.com/modelcontextprotocol/mcp)
- [MCP Sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP inspector](https://modelcontextprotocol.io/docs/tools/inspector)