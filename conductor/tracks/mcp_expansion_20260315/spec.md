# Specification: MCP Server Expansion - Account & Transaction Tools

## Overview
This track involves expanding the `mcp-server` to include advanced account management and transaction construction capabilities from the `supra-l1-sdk`. The goal is to provide a more flexible interface for developers and agents to build, sign, and submit complex transactions beyond simple coin transfers.

## Functional Requirements
- **Account Management**:
  - `generate_account`: Generate a new Supra account with mnemonic, private key, and address.
  - `derive_account`: Derive a Supra account from a provided mnemonic or private key string.
- **Transaction Building**:
  - `create_entry_function_tx`: Serialize a raw transaction for an `entry_function_payload`.
  - `create_script_tx`: Serialize a raw transaction for a `script_payload` (bytecode).
  - Expose parameters for `maxGas`, `gasUnitPrice`, and `txExpiration`.
- **Signing & Submission**:
  - `sign_transaction`: Sign a serialized raw transaction using a private key.
  - `submit_transaction`: Submit a signed transaction with its authenticator to the RPC node.

## Non-Functional Requirements
- **Type Safety**: Use strict TypeScript types for all tool inputs and outputs.
- **Error Handling**: Provide clear error messages for invalid inputs or RPC failures.
- **Security**: Private keys should never be logged or stored by the MCP server.

## Acceptance Criteria
- [ ] Users can generate a new account and receive a mnemonic and private key.
- [ ] Users can build a serialized entry function transaction and sign it.
- [ ] Users can submit a signed transaction to the Supra RPC and receive a transaction hash.
- [ ] Comprehensive tests for each new tool.
