import React, { useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { Sparkles, Sliders, RotateCcw, Zap, ChevronUp, ChevronDown } from 'lucide-react';

export const DemoControlBar = () => {
  const { simulateShock } = useWatchlist();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState('TCS');
  const [priceChange, setPriceChange] = useState('-5.84');
  const [volumeMult, setVolumeMult] = useState('2.8');

  const handleApplyShock = async () => {
    await simulateShock(selectedStock, parseFloat(priceChange), parseFloat(volumeMult));
  };

  const handleReset = async () => {
    await simulateShock(selectedStock, 0, 1, true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      
      {/* Drawer Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xl shadow-brand-500/25 border border-brand-500 transition"
      >
        <Sparkles className="w-4 h-4 text-white animate-pulse" />
        <span>Market Shock Controls</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Expanded Control Drawer */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 sm:w-96 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-brand-600" /> Market Shock Simulator
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Test real-time meaningful change detection in 1 click.
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-2 text-xs">
            <button
              onClick={() => {
                setSelectedStock('TCS');
                setPriceChange('-5.84');
                setVolumeMult('2.8');
                simulateShock('TCS', -5.84, 2.8);
              }}
              className="w-full p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-left transition flex items-center justify-between shadow-2xs"
            >
              <span>📉 Simulate TCS Shock (-5.84%, Score 91)</span>
              <Zap className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                simulateShock('TCS', 0, 1, true);
              }}
              className="w-full p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-left transition flex items-center justify-between shadow-2xs"
            >
              <span>🔄 Reset Market to Normal State</span>
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Custom Controls */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-[11px] text-slate-700 font-semibold block mb-1">Custom Stock</label>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-brand-500"
              >
                <option value="TCS">TCS (Tata Consultancy)</option>
                <option value="ITC">ITC (ITC Limited)</option>
                <option value="ICICIBANK">ICICIBANK (ICICI Bank)</option>
                <option value="RELIANCE">RELIANCE (Reliance Ind.)</option>
                <option value="PAYTM">PAYTM (Paytm)</option>
                <option value="INFY">INFY (Infosys)</option>
                <option value="HDFCBANK">HDFCBANK (HDFC Bank)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-700 font-semibold block mb-1">Price Change %</label>
                <input
                  type="number"
                  step="0.1"
                  value={priceChange}
                  onChange={(e) => setPriceChange(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-700 font-semibold block mb-1">Volume Multiple</label>
                <input
                  type="number"
                  step="0.1"
                  value={volumeMult}
                  onChange={(e) => setVolumeMult(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleApplyShock}
                className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-md shadow-brand-600/20 transition"
              >
                <Zap className="w-3.5 h-3.5" /> Trigger Shock
              </button>
              <button
                onClick={handleReset}
                title="Reset to normal market state"
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition"
              >
                Reset
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
