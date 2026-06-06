// Hardcoded KNOBS catalogue for v1 admin config pane.
//
// Source of truth = /Users/liam/Projects/vuelo-labs/cyborg/planning/control-spine.md
// (§ KNOBS, filtered to Tier=per-campaign + Billable=yes). This file mirrors
// the relevant subset for runtime form validation.
//
// Drift discipline (manual for v1): when adding/removing knobs to the spine's
// per-campaign tier, update this file in the same edit pass. A future
// lint_control_spine.py extension can auto-sync; deferred to v1.1+.

export const KNOBS_METADATA = [
  {
    key: 'pin_model',
    spine_name: 'CYBORG_PIN_MODEL',
    label: 'Claude model',
    type: 'enum',
    options: [
      { value: 'claude-haiku-4-5',  label: 'Haiku 4.5 (default; cheapest)' },
      { value: 'claude-sonnet-4-6', label: 'Sonnet 4.6 (~3× Haiku cost)' },
      { value: 'claude-opus-4-7',   label: 'Opus 4.7 (~15× Haiku cost)' },
    ],
    default: 'claude-haiku-4-5',
    env_var: 'CYBORG_PIN_MODEL',
  },
  {
    key: 'token_budget',
    spine_name: 'CYBORG_TOKEN_BUDGET',
    label: 'Cumulative token budget',
    type: 'int',
    min: 1000,
    max: 5_000_000,
    step: 1000,
    default: 500_000,
    env_var: 'CYBORG_TOKEN_BUDGET',
  },
  {
    key: 'token_rate_cap_per_minute',
    spine_name: 'CYBORG_TOKEN_RATE_CAP',
    label: 'Per-minute token rate cap',
    type: 'int',
    min: 1000,
    max: 500_000,
    step: 1000,
    default: 50_000,
    env_var: 'CYBORG_TOKEN_RATE_CAP',
  },
  {
    key: 'disallowed_tools',
    spine_name: 'CYBORG_DISALLOWED_TOOLS',
    label: 'Disallowed Claude tools',
    type: 'string_array',
    options: ['WebFetch', 'WebSearch', 'BashOutput', 'KillShell', 'TodoWrite', 'NotebookEdit'],
    default: ['WebFetch', 'WebSearch'],
    env_var: 'CYBORG_DISALLOWED_TOOLS',
    encode: (arr) => Array.isArray(arr) ? arr.join(',') : '',
  },
  {
    key: 'block_external_https',
    spine_name: 'CYBORG_BLOCK_EXTERNAL_HTTPS',
    label: 'Block external HTTPS from candidate',
    type: 'bool',
    default: false,
    env_var: 'CYBORG_BLOCK_EXTERNAL_HTTPS',
    encode: (b) => b ? 'on' : 'off',
  },
];

const KEY_TO_KNOB = Object.fromEntries(KNOBS_METADATA.map((k) => [k.key, k]));

// validatePolicy(policy): returns { ok: true } or { ok: false, errors: [...] }.
// Unknown keys fail (drift signal). Type mismatch fails. Out-of-range fails.
export function validatePolicy(policy) {
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) {
    return { ok: false, errors: ['policy must be a JSON object'] };
  }
  const errors = [];
  for (const [key, value] of Object.entries(policy)) {
    const knob = KEY_TO_KNOB[key];
    if (!knob) {
      errors.push(`unknown knob: ${key} (not in v1 catalogue)`);
      continue;
    }
    if (knob.type === 'enum') {
      if (!knob.options.find((o) => o.value === value)) {
        errors.push(`${key}: ${JSON.stringify(value)} not in enum`);
      }
    } else if (knob.type === 'int') {
      if (typeof value !== 'number' || !Number.isInteger(value)) {
        errors.push(`${key}: expected integer, got ${typeof value}`);
      } else if (value < knob.min || value > knob.max) {
        errors.push(`${key}: ${value} out of range [${knob.min}, ${knob.max}]`);
      }
    } else if (knob.type === 'bool') {
      if (typeof value !== 'boolean') {
        errors.push(`${key}: expected boolean, got ${typeof value}`);
      }
    } else if (knob.type === 'string_array') {
      if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) {
        errors.push(`${key}: expected array of strings`);
      } else if (knob.options) {
        const bad = value.filter((v) => !knob.options.includes(v));
        if (bad.length) errors.push(`${key}: unknown values ${JSON.stringify(bad)}`);
      }
    }
  }
  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

// policyToEnvVars(policy): translate the validated policy into the Fly machine
// env-var dict consumed by the candidate runtime entrypoint. Only keys present
// in `policy` are emitted (image-baked defaults cover the rest).
export function policyToEnvVars(policy) {
  const out = {};
  if (!policy || typeof policy !== 'object') return out;
  for (const [key, value] of Object.entries(policy)) {
    const knob = KEY_TO_KNOB[key];
    if (!knob) continue;  // ignore unknown keys at runtime (lint catches drift)
    const encoded = knob.encode ? knob.encode(value) : String(value);
    out[knob.env_var] = encoded;
  }
  return out;
}
