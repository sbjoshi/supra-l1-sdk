import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transferCoinTool } from './coin';
import { SupraClient, SupraAccount, HexString } from "@supra-l1/sdk";

vi.mock("@supra-l1/sdk", () => {
  return {
    SupraClient: {
      init: vi.fn().mockResolvedValue({
        transferCoin: vi.fn().mockResolvedValue({ hash: '0xhash' }),
      }),
    },
    SupraAccount: vi.fn().mockImplementation(function() { return {}; }),
    HexString: vi.fn().mockImplementation(function(val) { return { toString: () => val }; }),
  };
});

describe('transferCoinTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct tool definition', () => {
    expect(transferCoinTool.name).toBe('transfer_coin');
    expect(transferCoinTool.description).toBe('Transfer coins from one account to another');
    expect(transferCoinTool.inputSchema).toBeDefined();
  });

  it('should call transferCoin with correct arguments', async () => {
    const args = {
      senderPrivateKey: '0x123',
      receiverAddress: '0x456',
      amount: '1000',
      coinType: '0x1::supra_coin::SupraCoin',
      rpcUrl: 'https://rpc-testnet.supra.com/',
    };

    const result = await transferCoinTool.handler(args);

    expect(SupraClient.init).toHaveBeenCalledWith('https://rpc-testnet.supra.com/');
    expect(SupraAccount).toHaveBeenCalled();
    expect(HexString).toHaveBeenCalledWith('0x456');
    
    const mockClient = await SupraClient.init('https://rpc-testnet.supra.com/');
    expect(mockClient.transferCoin).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      1000n,
      '0x1::supra_coin::SupraCoin',
      expect.objectContaining({
        enableTransactionWaitAndSimulationArgs: {
          enableWaitForTransaction: true,
          enableTransactionSimulation: true,
        },
      })
    );
    expect(result).toEqual({ hash: '0xhash' });
  });
});
