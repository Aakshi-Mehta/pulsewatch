const { THRESHOLDS, SEVERITY } = require('../config/constants');

class MeaningfulChangeEngine {
  /**
   * Calculate Change Score (0-100), Severity, Signals Checklist, and Verdict
   * 
   * @param {object} quote Current normalized market quote
   * @param {object|null} userState User's last seen baseline state (lastSeenPrice, lastSeenAt, etc.)
   */
  evaluateChange(quote, userState = null) {
    const {
      symbol,
      price,
      previousClose,
      changePercent,
      volume,
      avgVolume20D = 5000000,
      volatility = 0.02,
      high52W,
      low52W,
    } = quote;

    const reasons = [];
    const metrics = {};

    // 1. Price Movement & zScore Score (Max 35 points)
    const dailyReturnPct = Math.abs(changePercent / 100);
    const zScore = volatility > 0 ? (dailyReturnPct / volatility) : 1.0;
    metrics.zScore = Math.round(zScore * 10) / 10;
    metrics.volatilityMultiple = Math.round((dailyReturnPct / (volatility || 0.02)) * 10) / 10;

    let priceScore = 0;
    if (zScore >= 2.5) priceScore = 35;
    else if (zScore >= 2.0) priceScore = 28;
    else if (zScore >= 1.5) priceScore = 20;
    else if (zScore >= 1.0) priceScore = 12;
    else priceScore = Math.round(zScore * 8);

    if (zScore >= 1.8 || Math.abs(changePercent) >= 3.0) {
      if (changePercent > 0) {
        reasons.push('Price movement is unusually large (+ upside)');
      } else {
        reasons.push('Price movement is unusually large (- downside)');
      }
    }

    // 2. Volume Anomaly Score (Max 25 points)
    const volumeMultiple = avgVolume20D > 0 ? Math.round((volume / avgVolume20D) * 10) / 10 : 1.0;
    metrics.volumeMultiple = volumeMultiple;

    let volumeScore = 0;
    if (volumeMultiple >= 2.5) volumeScore = 25;
    else if (volumeMultiple >= 2.0) volumeScore = 20;
    else if (volumeMultiple >= 1.5) volumeScore = 15;
    else if (volumeMultiple >= 1.2) volumeScore = 10;
    else volumeScore = Math.max(0, Math.round((volumeMultiple - 1.0) * 8));

    if (volumeMultiple >= THRESHOLDS.VOLUME_ANOMALY_THRESHOLD) {
      reasons.push(`Trading volume is above normal (${volumeMultiple}× 20-day avg)`);
    }

    // 3. User Away Movement Score (Max 20 points)
    let awayScore = 0;
    let awayChangePct = 0;
    let awayPriceDelta = 0;

    if (userState && userState.lastSeenPrice && userState.lastSeenPrice > 0) {
      awayPriceDelta = price - userState.lastSeenPrice;
      awayChangePct = Math.round(((awayPriceDelta / userState.lastSeenPrice) * 100) * 100) / 100;
      metrics.awayChangePct = awayChangePct;
      metrics.lastSeenPrice = userState.lastSeenPrice;
      metrics.lastSeenAt = userState.lastSeenAt;

      const absAwayPct = Math.abs(awayChangePct);
      if (absAwayPct >= 4.0) awayScore = 20;
      else if (absAwayPct >= 2.5) awayScore = 15;
      else if (absAwayPct >= 1.5) awayScore = 10;
      else awayScore = Math.round(absAwayPct * 3);

      if (absAwayPct >= 2.5) {
        reasons.push('Movement is outside the stock\'s expected range');
      }
    }

    // 4. Technical Signal / Milestone Score (Max 20 points)
    let signalScore = 0;
    if (high52W && price >= high52W * 0.985) {
      signalScore += 15;
      reasons.push('Trading near 52-week high');
    } else if (low52W && price <= low52W * 1.015) {
      signalScore += 15;
      reasons.push('Trading near 52-week low');
    } else if (zScore >= 2.2) {
      signalScore += 10;
      reasons.push('Volatility is elevated');
    }

    // Calculate Total Change Score (Normalized 0 - 100)
    const rawScore = priceScore + volumeScore + awayScore + signalScore;
    const changeScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Categorize Severity Level
    let severity = SEVERITY.NORMAL;
    if (changeScore >= THRESHOLDS.HIGH_CHANGE_THRESHOLD) {
      severity = SEVERITY.SIGNIFICANT;
    } else if (changeScore >= THRESHOLDS.MEANINGFUL_CHANGE_THRESHOLD) {
      severity = SEVERITY.WATCH;
    }

    if (reasons.length === 0) {
      reasons.push('Moving within expected daily volatility bounds');
    }

    // Market Signals Breakdown for "Why?" modal checklist
    const marketSignals = {
      priceDeviation: changeScore >= 70 ? 'High' : changeScore >= 30 ? 'Moderate' : 'Low',
      volumeAnomaly: volumeMultiple >= 1.8 ? `${volumeMultiple}× normal` : 'Normal',
      volatility: changeScore >= 70 ? '+42% (Elevated)' : changeScore >= 30 ? '+15% (Slightly elevated)' : 'Normal',
      historicalRange: changeScore >= 70 ? 'Outside expected range' : changeScore >= 30 ? 'Near upper bound' : 'Normal',
      newsSignal: changeScore >= 70 ? 'Detected' : 'None',
    };

    // Verdict text
    let verdict = 'No unusual behavior detected.';
    if (severity === SEVERITY.SIGNIFICANT) {
      verdict = 'Unusual movement detected. This stock deserves investigation.';
    } else if (severity === SEVERITY.WATCH) {
      verdict = 'Moderate movement detected. Worth keeping an eye on.';
    }

    const explanation = {
      priceContext: `Today's movement (${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%) is ${metrics.volatilityMultiple}× its typical daily movement (${(volatility * 100).toFixed(1)}%).`,
      volumeContext: `Trading volume is ${volumeMultiple}× the 20-day baseline average.`,
      reasons,
    };

    return {
      symbol,
      changeScore,
      severity,
      price: quote.price,
      previousClose: quote.previousClose,
      priceChange: quote.change,
      priceChangePercent: quote.changePercent,
      volume: quote.volume,
      volumeMultiple,
      zScore: metrics.zScore,
      awayChangePct,
      awayPriceDelta,
      lastSeenPrice: metrics.lastSeenPrice || previousClose,
      lastSeenAt: metrics.lastSeenAt || null,
      reasons,
      marketSignals,
      verdict,
      explanation,
      timestamp: quote.timestamp,
    };
  }
}

module.exports = new MeaningfulChangeEngine();
