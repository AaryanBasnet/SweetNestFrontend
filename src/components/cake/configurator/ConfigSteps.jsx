import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Check, Upload, X, ImageIcon, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { ConfigOptionCard } from "./ConfigOptionCard";
import {
  SHAPE_OPTIONS,
  TIER_OPTIONS,
  SIZE_OPTIONS,
  FLAVOR_OPTIONS,
  FILLING_OPTIONS,
  COLOR_OPTIONS,
  DRIP_OPTIONS,
  TOPPER_OPTIONS,
  FINISH_OPTIONS,
  EXTRA_PRICES,
  MESSAGE_SUGGESTIONS,
  MESSAGE_MAX_LENGTH,
  formatNPR,
} from "./cakeConfigConstants";

const priceTag = (p) => (p > 0 ? `+${formatNPR(p)}` : "Included");

// ============================================
// SMALL SHARED UI
// ============================================

export function Section({ title, hint, children, aside }) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-dark">{title}</h4>
          {hint && <p className="text-xs text-dark/50 mt-0.5">{hint}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}
Section.propTypes = {
  title: PropTypes.string.isRequired,
  hint: PropTypes.string,
  children: PropTypes.node,
  aside: PropTypes.node,
};

export function Tile({ label, sublabel, priceText, selected, onClick, swatch, icon, stacked }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex rounded-xl border transition-all duration-200 ${
        stacked
          ? "flex-col items-center gap-1.5 px-2 py-3 text-center"
          : "items-center gap-3 px-3 py-2.5 text-left"
      } ${
        selected
          ? "border-accent bg-accent/5 shadow-md ring-1 ring-accent/30"
          : "border-dark/10 bg-white hover:border-dark/30 hover:shadow-sm"
      }`}
    >
      {icon && (
        <span className={`shrink-0 ${selected ? "text-accent" : "text-dark/60"}`}>{icon}</span>
      )}
      {swatch !== undefined && (
        <span
          className="h-7 w-7 shrink-0 rounded-full border border-dark/10 shadow-inner"
          style={{
            background: swatch || "repeating-linear-gradient(45deg,#f3f3f3 0 4px,#fff 4px 8px)",
          }}
        />
      )}
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-medium text-dark ${stacked ? "leading-tight" : "truncate"}`}>
          {label}
        </span>
        <span className={`block text-[11px] text-dark/50 ${stacked ? "leading-tight" : "truncate"}`}>
          {sublabel}
          {sublabel && priceText ? " · " : ""}
          {priceText && (
            <span className={selected ? "text-accent font-medium" : "text-dark/70"}>{priceText}</span>
          )}
        </span>
      </span>
      {selected && (
        <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-accent text-white flex items-center justify-center shadow">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
Tile.propTypes = {
  label: PropTypes.string.isRequired,
  sublabel: PropTypes.string,
  priceText: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  swatch: PropTypes.string,
  icon: PropTypes.node,
  stacked: PropTypes.bool,
};

export function Toggle({ label, hint, priceText, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
        checked ? "border-accent bg-accent/5" : "border-dark/10 bg-white hover:border-dark/30"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-dark">
          {label}
          {priceText && <span className="ml-2 text-xs text-dark/50">{priceText}</span>}
        </span>
        {hint && <span className="block text-xs text-dark/50 mt-0.5">{hint}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-dark/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
Toggle.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  priceText: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ShapeIcon = ({ shape }) => {
  if (shape === "Heart") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 21s-7.5-4.8-9.6-9.3C1 8.3 3.3 4.8 6.8 4.8c2 0 3.6 1.1 4.4 2.5.8-1.4 2.4-2.5 4.4-2.5 3.5 0 5.8 3.5 4.4 6.9C19.5 16.2 12 21 12 21z" />
      </svg>
    );
  }
  if (shape === "Square") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="4" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
};
ShapeIcon.propTypes = { shape: PropTypes.string.isRequired };

const TierIcon = ({ count }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    {count >= 3 && <rect x="8" y="3" width="8" height="5" rx="1.2" />}
    {count >= 2 && <rect x="5" y="9" width="14" height="5" rx="1.2" />}
    <rect x="2" y="15" width="20" height="6" rx="1.2" />
  </svg>
);
TierIcon.propTypes = { count: PropTypes.number.isRequired };

// ============================================
// STEP 1 - SHAPE & SIZE
// ============================================

export function BaseStep({ config, update }) {
  return (
    <div className="space-y-6">
      <Section title="Shape" hint="Heart and square cakes use the same tiers and weights">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(SHAPE_OPTIONS).map(([name, opt]) => (
            <Tile
              key={name}
              label={name}
              sublabel={opt.description}
              priceText={opt.price ? `+${formatNPR(opt.price)}` : undefined}
              selected={config.shape === name}
              onClick={() => update("shape", name)}
              icon={<ShapeIcon shape={name} />}
              stacked
            />
          ))}
        </div>
      </Section>

      <Section title="Tiers">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(TIER_OPTIONS).map(([name, opt]) => (
            <Tile
              key={name}
              label={name}
              sublabel={opt.priceMultiplier === 1 ? "Base price" : `×${opt.priceMultiplier} price`}
              selected={config.tiers === name}
              onClick={() => update("tiers", name)}
              icon={<TierIcon count={opt.count} />}
              stacked
            />
          ))}
        </div>
      </Section>

      <Section title="Weight" hint="Prices are for the whole cake before add-ons">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SIZE_OPTIONS).map(([name, opt]) => (
            <Tile
              key={name}
              label={opt.label}
              sublabel={`Serves ${opt.serves}`}
              priceText={formatNPR(opt.price)}
              selected={config.size === name}
              onClick={() => update("size", name)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
BaseStep.propTypes = { config: PropTypes.object.isRequired, update: PropTypes.func.isRequired };

// ============================================
// STEP 2 - FLAVOR & FILLING
// ============================================

export function FlavorStep({ config, update, peek, setPeek }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-amber-50 border border-amber-200/60 px-4 py-3 text-xs text-amber-900">
        The preview cuts a slice while you are on this step so you can see the sponge and filling
        layers inside.
      </div>

      <Section title="Sponge flavor">
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(FLAVOR_OPTIONS).map((flavor) => (
            <ConfigOptionCard
              key={flavor}
              label={flavor}
              image={FLAVOR_OPTIONS[flavor].image}
              colorValue={FLAVOR_OPTIONS[flavor].color}
              isSelected={config.flavor === flavor}
              onClick={() => update("flavor", flavor)}
              variant="flavor"
            />
          ))}
        </div>
      </Section>

      <Section title="Filling" hint="Layered between the sponges">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(FILLING_OPTIONS).map(([name, opt]) => (
            <Tile
              key={name}
              label={name}
              sublabel={opt.description}
              priceText={priceTag(opt.price)}
              selected={config.filling === name}
              onClick={() => update("filling", name)}
              swatch={`linear-gradient(160deg,#fff 0%,${opt.color} 55%)`}
            />
          ))}
        </div>
      </Section>

      <Section title="Dietary">
        <Toggle
          label="Eggless recipe"
          hint="Baked without eggs, same texture and taste"
          priceText={`+${formatNPR(EXTRA_PRICES.eggless)}`}
          checked={Boolean(config.eggless)}
          onChange={(v) => update("eggless", v)}
        />
      </Section>

      <Toggle
        label="Keep the slice view on every step"
        hint="Off by default, the cake closes up again when you move on"
        checked={peek}
        onChange={setPeek}
      />
    </div>
  );
}
FlavorStep.propTypes = {
  config: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  peek: PropTypes.bool.isRequired,
  setPeek: PropTypes.func.isRequired,
};

// ============================================
// STEP 3 - FROSTING
// ============================================

export function FrostingStep({ config, update }) {
  return (
    <div className="space-y-6">
      <Section title="Frosting colour" hint="Buttercream tinted to your pick">
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(COLOR_OPTIONS).map(([name, hex]) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
              <ConfigOptionCard
                label={name}
                colorValue={hex}
                isSelected={config.color === name}
                onClick={() => update("color", name)}
                variant="color"
              />
              <span
                className={`text-[11px] text-center leading-tight ${
                  config.color === name ? "text-accent font-medium" : "text-dark/60"
                }`}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Drip finish" hint="Glossy ganache poured over every tier">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(DRIP_OPTIONS).map(([name, opt]) => (
            <Tile
              key={name}
              label={name}
              sublabel={opt.description}
              priceText={priceTag(opt.price)}
              selected={config.drip === name}
              onClick={() => update("drip", name)}
              swatch={opt.color ? `linear-gradient(160deg,#fff 0%,${opt.color} 45%)` : null}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
FrostingStep.propTypes = { config: PropTypes.object.isRequired, update: PropTypes.func.isRequired };

// ============================================
// STEP 4 - DECORATE
// ============================================

export function DecorateStep({ config, update }) {
  return (
    <div className="space-y-6">
      <Section title="Topper" hint="Placed around the edge so your message stays readable">
        <div className="space-y-2">
          {Object.entries(TOPPER_OPTIONS).map(([name, opt]) => (
            <ConfigOptionCard
              key={name}
              label={opt.label}
              description={opt.description}
              price={opt.price}
              isSelected={config.topper === name}
              onClick={() => update("topper", name)}
            />
          ))}
        </div>
      </Section>

      <Section title="Finishing touches">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(FINISH_OPTIONS).map(([name, opt]) => (
            <Tile
              key={name}
              label={name}
              sublabel={opt.description}
              priceText={priceTag(opt.price)}
              selected={config.finish === name}
              onClick={() => update("finish", name)}
              swatch={opt.swatch}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
DecorateStep.propTypes = { config: PropTypes.object.isRequired, update: PropTypes.func.isRequired };

// ============================================
// STEP 5 - PERSONALIZE
// ============================================

export function PersonalizeStep({ config, update, onError }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onError?.("Please choose an image file (JPG or PNG).");
      return;
    }
    try {
      setUploading(true);
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 720,
        useWebWorker: true,
      });
      const dataUrl = await imageCompression.getDataUrlFromFile(compressed);
      update("photo", dataUrl);
    } catch (err) {
      console.error(err);
      onError?.("Could not read that image. Try another one.");
    } finally {
      setUploading(false);
    }
  };

  const remaining = MESSAGE_MAX_LENGTH - (config.message || "").length;

  return (
    <div className="space-y-6">
      <Section title="Message on the cake" hint="Piped in icing on the top">
        <input
          type="text"
          value={config.message}
          maxLength={MESSAGE_MAX_LENGTH}
          onChange={(e) => update("message", e.target.value)}
          placeholder="e.g. Happy Birthday Maya"
          className="w-full px-4 py-3 border border-dark/20 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {MESSAGE_SUGGESTIONS.map((msg) => (
              <button
                key={msg}
                type="button"
                onClick={() => update("message", msg)}
                className={`px-2.5 py-1 text-[11px] rounded-full border transition-colors ${
                  config.message === msg
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-dark/15 bg-cream text-dark/70 hover:border-accent hover:text-accent"
                }`}
              >
                {msg}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-dark/40 shrink-0 ml-2">{remaining} left</span>
        </div>
      </Section>

      <Section title="Number candles" hint="Gold numerals with real candle flames">
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            value={config.candleNumber}
            maxLength={2}
            onChange={(e) => update("candleNumber", e.target.value.replace(/\D/g, "").slice(0, 2))}
            placeholder="21"
            className="w-24 px-4 py-3 border border-dark/20 rounded-xl text-center text-lg font-medium tracking-widest focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <div className="text-xs text-dark/60">
            <div>Age or anniversary, up to two digits</div>
            <div className="text-dark/40">+{formatNPR(EXTRA_PRICES.candleNumber)} when added</div>
          </div>
          {config.candleNumber && (
            <button
              type="button"
              onClick={() => update("candleNumber", "")}
              className="ml-auto text-dark/40 hover:text-dark"
              aria-label="Remove number candles"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </Section>

      <Section
        title="Edible photo print"
        hint={`Printed on a sugar sheet, +${formatNPR(EXTRA_PRICES.photo)}`}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {config.photo ? (
          <div className="flex items-center gap-4 rounded-xl border border-dark/10 p-3">
            <img
              src={config.photo}
              alt="Photo to print"
              className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow"
            />
            <div className="flex-1 text-xs text-dark/60">
              Placed in the centre of the top tier. Your message moves to the front edge.
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs font-medium text-accent hover:underline"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => update("photo", null)}
              className="text-dark/40 hover:text-dark"
              aria-label="Remove photo"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-dark/15 px-4 py-5 text-sm text-dark/60 hover:border-accent hover:text-accent transition-colors disabled:opacity-60"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {uploading ? "Preparing your photo…" : "Upload a photo"}
            {!uploading && <ImageIcon size={16} className="opacity-50" />}
          </button>
        )}
      </Section>
    </div>
  );
}
PersonalizeStep.propTypes = {
  config: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  onError: PropTypes.func,
};
