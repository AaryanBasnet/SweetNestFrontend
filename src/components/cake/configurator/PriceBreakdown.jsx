import React from "react";
import PropTypes from "prop-types";
import { Info } from "lucide-react";
import { SIZE_OPTIONS, formatNPR } from "./cakeConfigConstants";

/**
 * PriceBreakdown - itemised lines and total
 */
export const PriceBreakdown = ({ lines, total }) => {
  return (
    <div className="space-y-1.5">
      {lines.map((line) => (
        <div key={line.key} className="flex justify-between items-center text-sm">
          <span className="text-dark/70">{line.label}</span>
          <span className="font-medium text-dark">
            {line.key === "base" ? formatNPR(line.amount) : `+${formatNPR(line.amount)}`}
          </span>
        </div>
      ))}
      <div className="flex justify-between items-center pt-2 mt-2 border-t border-dark/10">
        <span className="text-sm font-semibold text-dark">Total</span>
        <span className="text-lg font-semibold text-accent">{formatNPR(total)}</span>
      </div>
    </div>
  );
};

PriceBreakdown.propTypes = {
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  total: PropTypes.number.isRequired,
};

/**
 * ConfigSummary - what the bakery will actually make
 */
export const ConfigSummary = ({ config }) => {
  const serves = SIZE_OPTIONS[config.size]?.serves || "";
  const rows = [
    ["Cake", `${config.shape} · ${config.tiers} · ${config.size} (serves ${serves})`],
    ["Sponge", `${config.flavor}${config.eggless ? " · Eggless" : ""}`],
    ["Filling", config.filling],
    ["Frosting", `${config.color}${config.drip !== "None" ? ` · ${config.drip} drip` : ""}`],
    ["Decoration", [config.topper !== "None" && config.topper, config.finish !== "None" && config.finish].filter(Boolean).join(" · ") || "None"],
    config.candleNumber && ["Number candles", config.candleNumber],
    config.message && ["Message", `"${config.message}"`],
    config.photo && ["Photo print", "Included"],
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      <dl className="space-y-1.5 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-dark/50 shrink-0">{k}</dt>
            <dd className="text-dark font-medium text-right">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200/50 rounded-lg p-2">
        <Info size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          Order by <strong>4 PM</strong> for next-day delivery in Kathmandu Valley
        </p>
      </div>
    </div>
  );
};

ConfigSummary.propTypes = {
  config: PropTypes.object.isRequired,
};
