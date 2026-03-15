import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateAccountTool, deriveAccountTool } from './account';
import { SupraAccount } from "@supra-l1/sdk";

vi.mock("@scure/bip39", () => ({
  generateMnemonic: vi.fn().mockReturnValue('test mnemonic'),
  mnemonicToSeedSync: vi.fn(),
}));

vi.mock("@scure/bip39/wordlists/english", () => ({
  wordlist: [],
}));

vi.mock("@supra-l1/sdk", () => {
  const mockAccount = {
    toPrivateKeyObject: vi.fn().mockReturnValue({
      address: "0xaddress",
      publicKeyHex: "0xpublic",
      privateKeyHex: "0xprivate"
    })
  };
  
  const MockSupraAccount = vi.fn().mockImplementation(function() {
    return mockAccount;
  });
  // @ts-ignore
  MockSupraAccount.fromDerivePath = vi.fn().mockReturnValue(mockAccount);
  
  return {
    SupraAccount: MockSupraAccount
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

describe('deriveAccountTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct tool definition', () => {
    expect(deriveAccountTool.name).toBe('derive_account');
    expect(deriveAccountTool.description).toBe('Derive a Supra account from a mnemonic or private key');
    expect(deriveAccountTool.inputSchema).toBeDefined();
  });

  it('should derive from mnemonic', async () => {
    const args = {
      mnemonic: 'test mnemonic',
    };

    const result = await deriveAccountTool.handler(args);

    expect(SupraAccount.fromDerivePath).toHaveBeenCalledWith("m/44'/637'/0'/0'/0'", 'test mnemonic');
    expect(result).toHaveProperty('address', '0xaddress');
  });

  it('should derive from private key', async () => {
    const args = {
      privateKey: '0xprivate',
    };

    const result = await deriveAccountTool.handler(args);

    expect(SupraAccount).toHaveBeenCalled();
    expect(result).toHaveProperty('address', '0xaddress');
  });
});
