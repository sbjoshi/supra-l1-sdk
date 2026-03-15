# Supra L1 MCP Server

A Model Context Protocol (MCP) server for the Supra L1 SDK, allowing AI agents to interact with the Supra blockchain.

## Security Model: Zero-Knowledge & Side-Channel GUI

This server implements a **Zero-Knowledge Security Model**. Private keys and mnemonics are never shared with the LLM or stored in the conversation history. 

### How it works:
1. **Side-Channel Input**: When a tool requires a passphrase to decrypt a key, the server triggers a **GUI Popup** on your operating system (bypassing the terminal/stdio).
2. **Encrypted Storage**: Private keys are stored locally in encrypted `.pem` files using AES-256.
3. **OS Dependencies**:
   - **Linux**: Requires `zenity` installed.
   - **macOS**: Uses built-in `osascript`.
   - **Windows**: Uses built-in `PowerShell`.

## Overview

This server provides tools and resources to:
- **Securely manage accounts** without exposing secrets to AI.
- **Fund accounts** via the Supra testnet faucet.
- **Build, sign, and submit** complex Move transactions.
- **Inspect** account information and transaction insights.

## Setup

### Prerequisites
- Node.js (v18 or higher)
- **Linux Users**: `sudo apt install zenity`

### Installation
1. Clone and install:
   ```bash
   git clone https://github.com/your-repo/supra-l1-sdk.git
   cd supra-l1-sdk
   npm install
   ```
2. Build:
   ```bash
   npm run build
   ```

## Usage

### Tools

| Tool | Description | Key Parameters |
|------|-------------|------------|
| `generate_account` | Create new account | `mnemonicPath`, `keyFilePath` |
| `import_account` | Secure existing account | `mnemonic`/`privateKey`, `keyFilePath` |
| `fund_account` | Request testnet tokens | `address`, `rpcUrl` |
| `create_entry_function_tx` | Build entry function tx | `keyFilePath`, `moduleAddr`, `functionArgs` (typed) |
| `create_script_tx` | Build script tx | `keyFilePath`, `scriptCode`, `scriptArgs` (typed) |
| `sign_transaction` | Sign a raw transaction | `keyFilePath`, `serializedRawTransaction` |
| `submit_transaction` | Submit signed tx | `serializedRawTransaction`, `signature`, `rpcUrl` |
| `generate_transaction_hash` | Get tx hash | `keyFilePath`, `serializedRawTransaction` |

> **Note on `functionArgs` / `scriptArgs`**: Arguments must be typed objects, e.g., `[{"type": "address", "value": "0x..."}, {"type": "u64", "value": "1000"}]`.

### Resources

| URI Template | Description |
|--------------|-------------|
| `supra://account/{address}/info` | Basic information about a Supra account |
| `supra://account/{address}/resources` | All resources owned by a Supra account |
| `supra://transaction/{hash}/insights` | Detailed insights about a Supra transaction |

## Development

```bash
npm run build
npm test -w @supra-l1/mcp-server
```
