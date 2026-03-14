import { SupraClient, SupraAccount, HexString, TxnBuilderTypes, BCS } from "@supra-l1/sdk";
import { McpTool } from "../server.js";

export const simulateTransactionTool: McpTool = {
  name: "simulate_transaction",
  description: "Simulate a transaction to see its effects and gas usage without executing it on-chain",
  inputSchema: {
    type: "object",
    properties: {
      serializedRawTransaction: { type: "string", description: "Serialized raw transaction (hex)" },
      senderPublicKey: { type: "string", description: "Sender's public key (hex)" },
      rpcUrl: { type: "string", description: "Supra RPC URL", default: "https://rpc-testnet.supra.com/" },
    },
    required: ["serializedRawTransaction", "senderPublicKey"],
  },
  handler: async (args: any) => {
    const { serializedRawTransaction, senderPublicKey, rpcUrl = "https://rpc-testnet.supra.com/" } = args;
    const supraClient = await SupraClient.init(rpcUrl);
    
    const txAuthenticator = {
      Ed25519: {
        public_key: senderPublicKey.replace("0x", ""),
        signature: "0x" + "0".repeat(128),
      },
    };

    const result = await supraClient.simulateTxUsingSerializedRawTransaction(
      txAuthenticator,
      Uint8Array.from(Buffer.from(serializedRawTransaction.replace("0x", ""), "hex"))
    );
    return result;
  },
};

export const signTransactionTool: McpTool = {
  name: "sign_transaction",
  description: "Sign a raw transaction with a private key",
  inputSchema: {
    type: "object",
    properties: {
      senderPrivateKey: { type: "string", description: "Sender's private key (hex)" },
      serializedRawTransaction: { type: "string", description: "Serialized raw transaction (hex)" },
    },
    required: ["senderPrivateKey", "serializedRawTransaction"],
  },
  handler: async (args: any) => {
    const { senderPrivateKey, serializedRawTransaction } = args;
    const senderAccount = new SupraAccount(
      Uint8Array.from(Buffer.from(senderPrivateKey.replace("0x", ""), "hex"))
    );
    
    const rawTxn = TxnBuilderTypes.RawTransaction.deserialize(
      new BCS.Deserializer(Uint8Array.from(Buffer.from(serializedRawTransaction.replace("0x", ""), "hex")))
    );

    const signature = SupraClient.signSupraTransaction(senderAccount, rawTxn);
    return { signature: signature.toString() };
  },
};

export const generateTransactionHashTool: McpTool = {
  name: "generate_transaction_hash",
  description: "Generate a transaction hash for a signed transaction",
  inputSchema: {
    type: "object",
    properties: {
      senderPrivateKey: { type: "string", description: "Sender's private key (hex)" },
      serializedRawTransaction: { type: "string", description: "Serialized raw transaction (hex)" },
    },
    required: ["senderPrivateKey", "serializedRawTransaction"],
  },
  handler: async (args: any) => {
    const { senderPrivateKey, serializedRawTransaction } = args;
    const senderAccount = new SupraAccount(
      Uint8Array.from(Buffer.from(senderPrivateKey.replace("0x", ""), "hex"))
    );
    
    const rawTxn = TxnBuilderTypes.RawTransaction.deserialize(
      new BCS.Deserializer(Uint8Array.from(Buffer.from(serializedRawTransaction.replace("0x", ""), "hex")))
    );

    const signedTransaction = SupraClient.createSignedTransaction(senderAccount, rawTxn);
    const hash = SupraClient.deriveTransactionHash(signedTransaction);
    
    return { hash };
  },
};
