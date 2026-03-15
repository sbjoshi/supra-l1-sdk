# Implementation Plan: MCP Server Expansion - Account & Transaction Tools

## Phase 1: Account Management Tools
- [x] Task: Define `generate_account` tool interface and implement using `SupraAccount` (from SDK core). [2f42b08]
- [ ] Task: Define `derive_account` tool interface (mnemonics/private key) and implement using `SupraAccount`.
- [ ] Task: Write tests for account generation and derivation.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Account Management Tools' (Protocol in workflow.md)

## Phase 2: Transaction Building Tools
- [ ] Task: Define `create_entry_function_tx` tool interface and implement using `SupraClient.createSerializedRawTxObject`.
- [ ] Task: Define `create_script_tx` tool interface and implement using `SupraClient.createSerializedScriptTxPayloadRawTxObject`.
- [ ] Task: Write tests for transaction building with various parameters (max gas, expiration, etc.).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Transaction Building Tools' (Protocol in workflow.md)

## Phase 3: Signing and Submission Tools
- [ ] Task: Define `sign_transaction` tool interface and implement using `SupraAccount` and `SupraClient`.
- [ ] Task: Define `submit_transaction` tool interface and implement using `SupraClient.sendTxUsingSerializedRawTransactionAndSignature`.
- [ ] Task: Write tests for the full sign-and-submit workflow.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Signing and Submission Tools' (Protocol in workflow.md)

## Phase 4: Finalization & Documentation
- [ ] Task: Update MCP server `README.md` with descriptions and examples for all new tools.
- [ ] Task: Perform manual verification using an MCP client (e.g., Claude Desktop).
- [ ] Task: Conduct a final code review pass.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Finalization & Documentation' (Protocol in workflow.md)
