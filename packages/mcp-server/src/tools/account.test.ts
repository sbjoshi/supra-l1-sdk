import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateAccountTool } from './account';
import { SupraAccount } from "@supra-l1/sdk";

vi.mock("@scure/bip39", () => ({
  generateMnemonic: vi.fn().mockReturnValue('test mnemonic'),
  mnemonicToSeedSync: vi.fn(),
}));

vi.mock("@scure/bip39/wordlists/english", () => ({
  wordlist: [],
}));

vi.mock("@supra-l1/sdk", () => {
  return {
    SupraAccount: {
      fromDerivePath: vi.fn().mockImplementation(() => ({
        toPrivateKeyObject: vi.fn().mockReturnValue({
          address: "0xaddress",
          publicKeyHex: "0xpublic",
          privateKeyHex: "0xprivate"
        })
      })),
    }
  };
});

describe('generateAccountTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct tool definition', () => {
    expect(generateAccountTool.name).toBe('generate_account');
    expect(generateAccountTool.description).toBe('Generate a new Supra account');
    expect(generateAccountTool.inputSchema).toBeDefined();
  });

  it('should return a new account with address and private key', async () => {
    const result = await generateAccountTool.handler({});

    expect(SupraAccount.fromDerivePath).toHaveBeenCalled();
    expect(result).toHaveProperty('address', '0xaddress');
    expect(result).toHaveProperty('privateKey', '0xprivate');
    expect(result).toHaveProperty('mnemonic');
    expect(result.mnemonic).toBe('test mnemonic');
  });
});
