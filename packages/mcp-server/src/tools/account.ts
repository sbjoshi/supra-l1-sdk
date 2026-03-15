import { SupraAccount } from "@supra-l1/sdk";
import { McpTool } from "../server.js";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

export const generateAccountTool: McpTool = {
  name: "generate_account",
  description: "Generate a new Supra account",
  inputSchema: {
    type: "object",
    properties: {},
  },
  handler: async () => {
    const mnemonic = bip39.generateMnemonic(wordlist);
    const path = "m/44'/637'/0'/0'/0'";
    const account = SupraAccount.fromDerivePath(path, mnemonic);
    const accountObj = account.toPrivateKeyObject();
    
    return {
      address: accountObj.address,
      publicKey: accountObj.publicKeyHex,
      privateKey: accountObj.privateKeyHex,
      mnemonic: mnemonic,
      derivationPath: path,
    };
  },
};

export const deriveAccountTool: McpTool = {
  name: "derive_account",
  description: "Derive a Supra account from a mnemonic or private key",
  inputSchema: {
    type: "object",
    properties: {
      mnemonic: { type: "string", description: "Account mnemonic" },
      privateKey: { type: "string", description: "Account private key (hex)" },
      derivationPath: { type: "string", description: "BIP44 derivation path", default: "m/44'/637'/0'/0'/0'" },
    },
  },
  handler: async (args: any) => {
    const { mnemonic, privateKey, derivationPath = "m/44'/637'/0'/0'/0'" } = args;
    let account: SupraAccount;

    if (mnemonic) {
      account = SupraAccount.fromDerivePath(derivationPath, mnemonic);
    } else if (privateKey) {
      account = new SupraAccount(
        Uint8Array.from(Buffer.from(privateKey.replace("0x", ""), "hex"))
      );
    } else {
      throw new Error("Either mnemonic or privateKey must be provided");
    }

    const accountObj = account.toPrivateKeyObject();
    return {
      address: accountObj.address,
      publicKey: accountObj.publicKeyHex,
      privateKey: accountObj.privateKeyHex,
    };
  },
};
