import { transferCoinTool } from "./coin.js";
import { generateAccountTool, importAccountTool, fundAccountTool } from "./account.js";
import { publishPackageTool } from "./package.js";
import {
  simulateTransactionTool,
  signTransactionTool,
  generateTransactionHashTool,
  createEntryFunctionTxTool,
  createScriptTxTool,
} from "./transaction.js";

export const tools = [
  transferCoinTool,
  generateAccountTool,
  importAccountTool,
  fundAccountTool,
  publishPackageTool,
  simulateTransactionTool,
  signTransactionTool,
  generateTransactionHashTool,
  createEntryFunctionTxTool,
  createScriptTxTool,
];
