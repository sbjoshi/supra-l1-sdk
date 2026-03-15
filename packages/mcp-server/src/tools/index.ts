import { transferCoinTool } from "./coin.js";
import { generateAccountTool, importAccountTool } from "./account.js";
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
  publishPackageTool,
  simulateTransactionTool,
  signTransactionTool,
  generateTransactionHashTool,
  createEntryFunctionTxTool,
  createScriptTxTool,
];
