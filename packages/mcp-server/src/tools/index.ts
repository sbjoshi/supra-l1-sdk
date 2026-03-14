import { transferCoinTool } from "./coin.js";
import { publishPackageTool } from "./package.js";
import {
  simulateTransactionTool,
  signTransactionTool,
  generateTransactionHashTool,
} from "./transaction.js";

export const tools = [
  transferCoinTool,
  publishPackageTool,
  simulateTransactionTool,
  signTransactionTool,
  generateTransactionHashTool,
];
