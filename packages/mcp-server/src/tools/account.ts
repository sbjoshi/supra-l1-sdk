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
