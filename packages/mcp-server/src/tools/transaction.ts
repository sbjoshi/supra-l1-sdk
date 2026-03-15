import { SupraClient, SupraAccount, HexString, TxnBuilderTypes, BCS } from "@supra-l1/sdk";
import { McpTool } from "../server.js";
import * as fs from 'fs';
import { getPassphrase, decrypt } from '../utils/security.js';

function getDecryptedAccount(keyFilePath: string): SupraAccount {
  if (!fs.existsSync(keyFilePath)) {
    throw new Error(`Key file not found at: ${keyFilePath}`);
  }
  const encryptedData = fs.readFileSync(keyFilePath, 'utf8');
  const passphrase = getPassphrase(`Enter passphrase to unlock key: ${keyFilePath}`);
  if (!passphrase) {
    throw new Error("Passphrase is required to unlock the account");
  }
  const privateKeyHex = decrypt(encryptedData, passphrase);
  return new SupraAccount(
    Uint8Array.from(Buffer.from(privateKeyHex.replace("0x", ""), "hex"))
  );
}

export const simulateTransactionTool: McpTool = {
  name: "simulate_transaction",
  description: "Simulate a transaction to estimate gas and effects",
  inputSchema: {
    type: "object",
    properties: {
      serializedRawTransaction: { type: "string", description: "The serialized raw transaction (hex)" },
      senderPublicKey: { type: "string", description: "The public key of the sender (hex)" },
      rpcUrl: { type: "string", description: "Supra RPC URL" },
    },
    required: ["serializedRawTransaction", "senderPublicKey", "rpcUrl"],
  },
  handler: async (args: any) => {
    const { serializedRawTransaction, senderPublicKey, rpcUrl } = args;
    const supraClient = await SupraClient.init(rpcUrl);
    const result = await supraClient.simulateTxUsingSerializedRawTransaction(
      {
        Ed25519: {
          public_key: senderPublicKey,
          signature: "0x" + "0".repeat(128),
        },
      },
      Uint8Array.from(Buffer.from(serializedRawTransaction.replace("0x", ""), "hex"))
    );
    return result;
  },
};

export const createEntryFunctionTxTool: McpTool = {
  name: "create_entry_function_tx",
  description: "Build and serialize an entry function transaction",
  inputSchema: {
    type: "object",
    properties: {
      keyFilePath: { type: "string", description: "Path to the encrypted private key PEM file" },
      moduleAddr: { type: "string", description: "Target module address" },
      moduleName: { type: "string", description: "Target module name" },
      functionName: { type: "string", description: "Target function name" },
      typeArgs: { type: "array", items: { type: "string" }, description: "Type arguments" },
      functionArgs: { type: "array", items: { type: "string" }, description: "Function arguments (as strings)" },
      rpcUrl: { type: "string", description: "Supra RPC URL" },
    },
    required: ["keyFilePath", "moduleAddr", "moduleName", "functionName", "functionArgs", "rpcUrl"],
  },
  handler: async (args: any) => {
    const { keyFilePath, moduleAddr, moduleName, functionName, typeArgs = [], functionArgs, rpcUrl } = args;
    const account = getDecryptedAccount(keyFilePath);
    const supraClient = await SupraClient.init(rpcUrl);
    const accountInfo = await supraClient.getAccountInfo(account.address());
    
    const serializedRawTx = await supraClient.createSerializedRawTxObject(
      account.address(),
      BigInt(accountInfo.sequence_number),
      moduleAddr,
      moduleName,
      functionName,
      typeArgs,
      functionArgs
    );

    return {
      serializedRawTransaction: Buffer.from(serializedRawTx).toString("hex"),
      senderAddress: account.address().toString(),
    };
  },
};

export const createScriptTxTool: McpTool = {
  name: "create_script_tx",
  description: "Build and serialize a script transaction",
  inputSchema: {
    type: "object",
    properties: {
      keyFilePath: { type: "string", description: "Path to the encrypted private key PEM file" },
      scriptCode: { type: "string", description: "Move script bytecode (hex)" },
      typeArgs: { type: "array", items: { type: "string" }, description: "Type arguments" },
      scriptArgs: { type: "array", items: { type: "object" }, description: "Script arguments (JSON objects)" },
      rpcUrl: { type: "string", description: "Supra RPC URL" },
    },
    required: ["keyFilePath", "scriptCode", "rpcUrl"],
  },
  handler: async (args: any) => {
    const { keyFilePath, scriptCode, typeArgs = [], scriptArgs = [], rpcUrl } = args;
    const account = getDecryptedAccount(keyFilePath);
    const supraClient = await SupraClient.init(rpcUrl);
    const accountInfo = await supraClient.getAccountInfo(account.address());

    const serializedRawTx = supraClient.createSerializedScriptTxPayloadRawTxObject(
      account.address(),
      BigInt(accountInfo.sequence_number),
      Uint8Array.from(Buffer.from(scriptCode.replace("0x", ""), "hex")),
      typeArgs,
      scriptArgs
    );

    return {
      serializedRawTransaction: Buffer.from(serializedRawTx).toString("hex"),
      senderAddress: account.address().toString(),
    };
  },
};

export const signTransactionTool: McpTool = {
  name: "sign_transaction",
  description: "Sign a raw transaction using a secured PEM file",
  inputSchema: {
    type: "object",
    properties: {
      keyFilePath: { type: "string", description: "Path to the encrypted private key PEM file" },
      serializedRawTransaction: { type: "string", description: "The serialized raw transaction (hex)" },
    },
    required: ["keyFilePath", "serializedRawTransaction"],
  },
  handler: async (args: any) => {
    const { keyFilePath, serializedRawTransaction } = args;
    const account = getDecryptedAccount(keyFilePath);
    const signature = account.signHexString(serializedRawTransaction);
    return {
      signature: signature.toString(),
      publicKey: account.pubKey().toString(),
    };
  },
};

export const submit_transaction_tool: McpTool = {
  name: "submit_transaction",
  description: "Submit a signed transaction to the Supra RPC node",
  inputSchema: {
    type: "object",
    properties: {
      serializedRawTransaction: { type: "string", description: "The serialized raw transaction (hex)" },
      signature: { type: "string", description: "The transaction signature (hex)" },
      senderPublicKey: { type: "string", description: "The public key of the sender (hex)" },
      rpcUrl: { type: "string", description: "Supra RPC URL" },
    },
    required: ["serializedRawTransaction", "signature", "senderPublicKey", "rpcUrl"],
  },
  handler: async (args: any) => {
    const { serializedRawTransaction, signature, senderPublicKey, rpcUrl } = args;
    const supraClient = await SupraClient.init(rpcUrl);
    const result = await supraClient.sendTxUsingSerializedRawTransactionAndSignature(
      new HexString(senderPublicKey),
      new HexString(signature),
      Uint8Array.from(Buffer.from(serializedRawTransaction.replace("0x", ""), "hex")),
      {
        enableTransactionWaitAndSimulationArgs: {
          enableWaitForTransaction: true,
          enableTransactionSimulation: false,
        },
      }
    );
    return result;
  },
};

export const generateTransactionHashTool: McpTool = {
  name: "generate_transaction_hash",
  description: "Generate transaction hash",
  inputSchema: {
    type: "object",
    properties: {
      keyFilePath: { type: "string", description: "Path to the encrypted private key PEM file" },
      serializedRawTransaction: { type: "string", description: "The serialized raw transaction (hex)" },
    },
    required: ["keyFilePath", "serializedRawTransaction"],
  },
  handler: async (args: any) => {
    const { keyFilePath, serializedRawTransaction } = args;
    const account = getDecryptedAccount(keyFilePath);
    const rawTx = TxnBuilderTypes.RawTransaction.deserialize(
      new BCS.Deserializer(Uint8Array.from(Buffer.from(serializedRawTransaction.replace("0x", ""), "hex")))
    );
    const hash = SupraClient.deriveTransactionHash(
      SupraClient.createSignedTransaction(
        account,
        rawTx
      )
    );
    return { hash };
  },
};
