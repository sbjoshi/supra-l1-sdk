# Implementation Plan: MCP Server Expansion - Secure Account & Transaction Tools

## Phase 0: Security Utilities
- [x] Task: Implement OS detection and GUI passphrase prompt utility (Linux/macOS/Windows). [cb80417]
- [x] Task: Implement Encryption/Decryption utility (AES-256) for securing PEM files. [cb80417]
- [x] Task: Write unit tests for security utilities. [cb80417]
- [x] Task: Conductor - User Manual Verification 'Phase 0: Security Utilities' (Protocol in workflow.md) [c277359]

## Phase 1: Secure Account Management
- [ ] Task: Refactor `generate_account` to prompt for passphrase, save mnemonic to file, and save encrypted private key to PEM.
- [ ] Task: Implement `import_account` to convert existing mnemonics/keys into secured PEM files.
- [ ] Task: Update unit tests to verify zero-knowledge (no secrets in return objects).
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Secure Account Management' (Protocol in workflow.md)

## Phase 2: Secure Transaction Building
- [ ] Task: Define `create_entry_function_tx` tool interface using `keyFilePath`.
- [ ] Task: Define `create_script_tx` tool interface using `keyFilePath`.
- [ ] Task: Implement signing logic that decrypts the PEM file via GUI prompt.
- [ ] Task: Write tests for secure transaction building.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Secure Transaction Building' (Protocol in workflow.md)

## Phase 3: Secure Signing and Submission
- [ ] Task: Implement `sign_transaction` (standalone) using GUI prompt decryption.
- [ ] Task: Implement `submit_transaction` for previously signed transactions.
- [ ] Task: Write tests for the full secure workflow.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Secure Signing and Submission' (Protocol in workflow.md)

## Phase 4: Finalization & Documentation
- [ ] Task: Update MCP server `README.md` with security model details and OS dependencies (zenity, etc.).
- [ ] Task: Perform manual verification across different operating systems.
- [ ] Task: Conduct a final code review pass.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Finalization & Documentation' (Protocol in workflow.md)
