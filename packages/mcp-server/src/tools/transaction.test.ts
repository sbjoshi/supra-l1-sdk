import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEntryFunctionTxTool, createScriptTxTool } from './transaction';
import { SupraClient, HexString, SupraAccount } from "@supra-l1/sdk";
import * as security from '../utils/security';
import * as fs from 'fs';

vi.mock('fs', () => ({
  readFileSync: vi.fn().mockReturnValue('encrypted-data'),
  existsSync: vi.fn().mockReturnValue(true),
}));

vi.mock("../utils/security", () => ({
  getPassphrase: vi.fn().mockReturnValue('test-passphrase'),
  decrypt: vi.fn().mockReturnValue('0xprivate'),
  encrypt: vi.fn(),
}));

vi.mock("@supra-l1/sdk", () => {
  const mockClient = {
    createSerializedRawTxObject: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    createSerializedScriptTxPayloadRawTxObject: vi.fn().mockReturnValue(new Uint8Array([4, 5, 6])),
    getAccountInfo: vi.fn().mockResolvedValue({ sequence_number: 10n }),
    getChainId: vi.fn().mockResolvedValue({ value: 6 }),
  };
  
  const mockAccount = {
    address: vi.fn().mockReturnValue({ toString: () => "0xaddress" }),
    toPrivateKeyObject: vi.fn().mockReturnValue({ address: "0xaddress" }),
  };

  const MockSupraAccount = vi.fn().mockImplementation(function() {
    return mockAccount;
  });
  
  return {
    SupraClient: {
      init: vi.fn().mockResolvedValue(mockClient),
    },
    SupraAccount: MockSupraAccount,
    HexString: {
      fromUint8Array: vi.fn().mockReturnValue({ toString: () => "0x0" }),
    }
  };
});

describe('createEntryFunctionTxTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct tool definition', () => {
    expect(createEntryFunctionTxTool.name).toBe('create_entry_function_tx');
    expect(createEntryFunctionTxTool.inputSchema.properties).toHaveProperty('keyFilePath');
  });

  it('should build entry function tx using key file', async () => {
    const args = {
      keyFilePath: 'key.pem',
      moduleAddr: '0x1',
      moduleName: 'supra_account',
      functionName: 'transfer',
      functionArgs: ['0x2', '1000'],
      rpcUrl: 'http://localhost'
    };

    const result = await createEntryFunctionTxTool.handler(args);

    expect(fs.readFileSync).toHaveBeenCalledWith('key.pem', 'utf8');
    expect(security.getPassphrase).toHaveBeenCalled();
    expect(security.decrypt).toHaveBeenCalledWith('encrypted-data', 'test-passphrase');
    expect(result).toHaveProperty('serializedRawTransaction');
  });
});

describe('createScriptTxTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should build script tx using key file', async () => {
    const args = {
      keyFilePath: 'key.pem',
      scriptCode: '0xabc',
      scriptArgs: [],
      rpcUrl: 'http://localhost'
    };

    const result = await createScriptTxTool.handler(args);

    expect(security.decrypt).toHaveBeenCalled();
    expect(result).toHaveProperty('serializedRawTransaction');
  });
});
