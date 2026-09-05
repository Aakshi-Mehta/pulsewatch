import { describe, it, expect } from 'vitest';
const meaningfulChangeEngine = require('../src/services/MeaningfulChangeEngine');
const { SEVERITY } = require('../src/config/constants');

describe('MeaningfulChangeEngine Unit Tests', () => {

  it('should evaluate normal price movement as NORMAL severity', () => {
    const normalQuote = {
      symbol: 'RELIANCE',
      price: 2903.12,
      previousClose: 2898.00,
      changePercent: 0.18,
      volume: 6000000,
      avgVolume20D: 6400000,
      volatility: 0.017,
    };

    const result = meaningfulChangeEngine.evaluateChange(normalQuote);
    expect(result.severity).toBe(SEVERITY.NORMAL);
    expect(result.changeScore).toBeLessThan(30);
  });

  it('should evaluate large price movement (+5.2%) with volume anomaly (2.1x) and away delta as SIGNIFICANT severity', () => {
    const shockQuote = {
      symbol: 'TCS',
      price: 3962.00,
      previousClose: 4207.66,
      changePercent: -5.84,
      volume: 8680000,
      avgVolume20D: 3100000,
      volatility: 0.018,
      high52W: 4250.00,
    };

    const userState = {
      lastSeenPrice: 4207.66,
      lastSeenAt: new Date(Date.now() - 2 * 3600 * 1000),
    };

    const result = meaningfulChangeEngine.evaluateChange(shockQuote, userState);
    expect(result.severity).toBe(SEVERITY.SIGNIFICANT);
    expect(result.changeScore).toBeGreaterThanOrEqual(70);
    expect(result.volumeMultiple).toBe(2.8);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons[0]).toContain('Price movement is unusually large');
  });

  it('should calculate user away price delta correctly', () => {
    const quote = {
      symbol: 'TCS',
      price: 3962.00,
      previousClose: 4207.66,
      changePercent: -5.84,
      volume: 8680000,
      avgVolume20D: 3100000,
      volatility: 0.018,
    };

    const userState = {
      lastSeenPrice: 4207.66,
      lastSeenAt: new Date(Date.now() - 2 * 3600 * 1000),
    };

    const result = meaningfulChangeEngine.evaluateChange(quote, userState);
    expect(result.awayChangePct).toBeCloseTo(-5.84, 1);
    expect(result.lastSeenPrice).toBe(4207.66);
  });

  it('should handle edge cases like zero volume or zero volatility without throwing NaN', () => {
    const edgeQuote = {
      symbol: 'TEST',
      price: 100.00,
      previousClose: 100.00,
      changePercent: 0,
      volume: 0,
      avgVolume20D: 0,
      volatility: 0,
    };

    const result = meaningfulChangeEngine.evaluateChange(edgeQuote);
    expect(result.changeScore).toBeDefined();
    expect(isNaN(result.changeScore)).toBe(false);
    expect(result.severity).toBe(SEVERITY.NORMAL);
  });

});
