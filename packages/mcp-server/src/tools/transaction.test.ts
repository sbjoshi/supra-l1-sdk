import { describe, it, expect, vi, beforeEach } from 'vitest';
import { simulateTransactionTool, signTransactionTool, generateTransactionHashTool } from './transaction';
import { SupraClient, SupraAccount, TxnBuilderTypes, BCS } from "@supra-l1/sdk";

vi.mock("@supra-l1/sdk", () => {
  return {
    SupraClient: {
      init: vi.fn().mockResolvedValue({
        simulateTxUsingSerializedRawTransaction: vi.fn().mockResolvedValue({ status: 'Success' }),
      }),
      signSupraTransaction: vi.fn().mockReturnValue({ toString: () => '0xsignature' }),
      createSignedTransaction: vi.fn().mockReturnValue({}),
      deriveTransactionHash: vi.fn().mockReturnValue('0xhash'),
    },
    SupraAccount: vi.fn().mockImplementation(function() { return {}; }),
    HexString: vi.fn().mockImplementation(function(val) { return { toString: () => val }; }),
    TxnBuilderTypes: {
      RawTransaction: {
        deserialize: vi.fn().mockReturnValue({}),
      },
    },
    BCS: {
      Deserializer: vi.fn().mockImplementation(function() { return {}; }),
    },
  };
});

describe('transaction tools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('simulateTransactionTool', () => {
    it('should have correct tool definition', () => {
      expect(simulateTransactionTool.name).toBe('simulate_transaction');
      expect(simulateTransactionTool.description).toBeDefined();
    });

    it('should call simulateTxUsingSerializedRawTransaction with correct arguments', async () => {
      const args = {
        serializedRawTransaction: '0xabcd',
        senderPublicKey: '0x123',
        rpcUrl: 'https://rpc-testnet.supra.com/',
      };

      const result = await simulateTransactionTool.handler(args);

      expect(SupraClient.init).toHaveBeenCalledWith('https://rpc-testnet.supra.com/');
      const mockClient = await SupraClient.init('https://rpc-testnet.supra.com/');
      expect(mockClient.simulateTxUsingSerializedRawTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          Ed25519: expect.objectContaining({
            public_key: '123',
          }),
        }),
        expect.any(Uint8Array)
      );
      expect(result).toEqual({ status: 'Success' });
    });
  });

  describe('signTransactionTool', () => {
    it('should have correct tool definition', () => {
      expect(signTransactionTool.name).toBe('sign_transaction');
    });

    it('should sign a transaction', async () => {
      const args = {
        senderPrivateKey: '0x123',
        serializedRawTransaction: '0xabcd',
      };

      const result = await signTransactionTool.handler(args);

      expect(SupraAccount).toHaveBeenCalled();
      expect(BCS.Deserializer).toHaveBeenCalled();
      expect(TxnBuilderTypes.RawTransaction.deserialize).toHaveBeenCalled();
      expect(SupraClient.signSupraTransaction).toHaveBeenCalled();
      expect(result).toEqual({ signature: '0xsignature' });
    });
  });

  describe('generateTransactionHashTool', () => {
    it('should have correct tool definition', () => {
      expect(generateTransactionHashTool.name).toBe('generate_transaction_hash');
    });

    it('should generate a transaction hash', async () => {
      const args = {
        senderPrivateKey: '0x123',
        serializedRawTransaction: '0xabcd',
      };

      const result = await generateTransactionHashTool.handler(args);

      expect(SupraAccount).toHaveBeenCalled();
      expect(SupraClient.createSignedTransaction).toHaveBeenCalled();
      expect(SupraClient.deriveTransactionHash).toHaveBeenCalled();
      expect(result).toEqual({ hash: '0xhash' });
    });
  });
});
