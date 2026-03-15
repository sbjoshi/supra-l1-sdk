import { transferCoinTool } from "./coin.js";
import { generateAccountTool, deriveAccountTool } from "./account.js";
import { publishPackageTool } from "./package.js";
import {
  simulateTransactionTool,
  signTransactionTool,
  generateTransactionHashTool,
} from "./transaction.js";

export const tools = [
  transferCoinTool,
  generateAccountTool,
  deriveAccountTool,
  publishPackageTool,
  simulateTransactionTool,
  signTransactionTool,
  generateTransactionHashTool,
];
