# Supra L1 MCP Server

A Model Context Protocol (MCP) server for the Supra L1 SDK, allowing AI agents to interact with the Supra blockchain.

## Overview

This server provides tools and resources to:
- Transfer coins between accounts.
- Publish Move packages and modules.
- Simulate transactions to estimate gas and effects.
- Sign raw transactions and generate transaction hashes.
- Inspect account information and resources.
- Get detailed insights into transactions.

## Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/supra-l1-sdk.git
   cd supra-l1-sdk
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the MCP server:
   ```bash
   npm run build -w @supra-l1/mcp-server
   ```

### Configuration for Claude Desktop
Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "supra-l1": {
      "command": "node",
      "args": ["/path/to/supra-l1-sdk/packages/mcp-server/dist/index.js"]
    }
  }
}
```

## Usage

### Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `transfer_coin` | Transfer coins | `senderPrivateKey`, `receiverAddress`, `amount`, `coinType`, `rpcUrl` |
| `publish_package` | Publish Move packages | `senderPrivateKey`, `packageMetadata`, `modulesCode`, `rpcUrl` |
| `simulate_transaction` | Simulate a transaction | `serializedRawTransaction`, `senderPublicKey`, `rpcUrl` |
| `sign_transaction` | Sign a raw transaction | `senderPrivateKey`, `serializedRawTransaction` |
| `generate_transaction_hash` | Generate transaction hash | `senderPrivateKey`, `serializedRawTransaction` |

### Resources

| URI Template | Description |
|--------------|-------------|
| `supra://account/{address}/info` | Basic information about a Supra account |
| `supra://account/{address}/resources` | All resources owned by a Supra account |
| `supra://transaction/{hash}/insights` | Detailed insights about a Supra transaction |

## Development

Run the server in development mode:
```bash
npm run dev -w @supra-l1/mcp-server
```

Run tests:
```bash
npm test -w @supra-l1/mcp-server
```
