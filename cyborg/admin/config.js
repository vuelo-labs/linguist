// Cyborg admin Configuration & Diagnostics card — vanilla-JS handlers.
// Companion to /cyborg/admin/index.html (cfg-* DOM); calls the endpoints
// under /cyborg/admin/config/*.

// ── State ──────────────────────────────────────────────────────────────────
let CFG_KNOBS = [];              // KNOBS_METADATA from the API
let CFG_CAMPAIGNS_BY_ID = {};    // id → campaign row (last fetched)
let CFG_CURRENT_CAMPAIGN_ID = null;
let CFG_ORIGINAL_SETTINGS = {};  // snapshot for Reset
let CFG_PRESETS = [];            // last-fetched preset list
let CFG_PRESET_POLL_TIMERS = {}; // preset_slug → poll interval id (only active builds)

// ── Helpers ────────────────────────────────────────────────────────────────
function cfgEscapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

async function cfgApi(path, opts = {}) {
  return fetch(path, {
    ...opts,
    credentials: 'same-origin',
    headers: {
      ...(opts.headers || {}),
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
}

function cfgShowStatus(elId, msg, kind) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = kind ? `status ${kind}` : 'status';
  el.textContent = msg || '';
}

// ── Tab switching ──────────────────────────────────────────────────────────
function switchConfigTab(name) {
  document.querySelectorAll('.cfg-tab').forEach((b) => {
    const isActive = b.dataset.tab === name;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', String(isActive));
  });
  document.getElementById('cfg-panel-policy').style.display = name === 'policy' ? 'block' : 'none';
  document.getElementById('cfg-panel-trace').style.display  = name === 'trace'  ? 'block' : 'none';
}

// ── Policy tab ─────────────────────────────────────────────────────────────
async function loadCampaignList() {
  const r = await cfgApi('/cyborg/admin/config/campaigns', { method: 'GET' });
  if (r.status === 401) { location.reload(); return; }
  let payload = null;
  try { payload = await r.json(); } catch { payload = null; }
  if (!r.ok || !payload) {
    cfgShowStatus('cfg-policy-status', `Failed to load campaigns (${r.status}).`, 'err');
    return;
  }
  CFG_KNOBS = payload.knobs || [];
  const campaigns = payload.campaigns || [];
  CFG_CAMPAIGNS_BY_ID = {};
  for (const c of campaigns) CFG_CAMPAIGNS_BY_ID[c.id] = c;

  const sel = document.getElementById('cfg-campaign-select');
  sel.innerHTML = '';
  if (campaigns.length === 0) {
    document.getElementById('cfg-policy-empty').style.display = 'block';
    document.getElementById('cfg-policy-form').style.display = 'none';
    return;
  }
  document.getElementById('cfg-policy-empty').style.display = 'none';

  const ph = document.createElement('option');
  ph.value = ''; ph.textContent = '— pick a campaign —';
  sel.appendChild(ph);
  for (const c of campaigns) {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.token_count || 0} tokens)`;
    sel.appendChild(opt);
  }
  if (CFG_CURRENT_CAMPAIGN_ID && CFG_CAMPAIGNS_BY_ID[CFG_CURRENT_CAMPAIGN_ID]) {
    sel.value = CFG_CURRENT_CAMPAIGN_ID;
  }
}

async function loadOrgListForCampaignForm() {
  const sel = document.getElementById('cc-org');
  if (!sel) return;
  const r = await cfgApi('/cyborg/admin/orgs/list', { method: 'GET' });
  if (r.status === 401) { location.reload(); return; }
  if (!r.ok) return;
  const d = await r.json().catch(() => null);
  if (!d || !d.orgs) return;
  sel.innerHTML = '';
  for (const o of d.orgs) {
    const opt = document.createElement('option');
    opt.value = o.id;
    opt.textContent = `${o.name}${o.limits === null ? ' (uncapped)' : ''}`;
    sel.appendChild(opt);
  }
}

async function createCampaign() {
  const name = document.getElementById('cc-name').value.trim();
  const orgId = document.getElementById('cc-org').value;
  if (!name) { cfgShowStatus('cfg-policy-status', 'Campaign name is required.', 'err'); return; }
  if (!orgId) { cfgShowStatus('cfg-policy-status', 'Pick an organisation.', 'err'); return; }

  const r = await cfgApi('/cyborg/admin/config/campaigns', {
    method: 'POST',
    body: JSON.stringify({ name, organisation_id: orgId, settings: {} }),
  });
  if (r.status === 401) { location.reload(); return; }
  const d = await r.json().catch(() => null);
  if (!r.ok || !d || !d.campaign) {
    cfgShowStatus('cfg-policy-status', (d && d.error) || `Failed to create (${r.status}).`, 'err');
    return;
  }
  cfgShowStatus('cfg-policy-status', `Campaign "${d.campaign.name}" created.`, 'ok');
  document.getElementById('cc-name').value = '';
  CFG_CURRENT_CAMPAIGN_ID = d.campaign.id;
  await loadCampaignList();
  document.getElementById('cfg-campaign-select').value = d.campaign.id;
  await loadCampaignPolicy(d.campaign.id);
}

async function loadCampaignPolicy(id) {
  CFG_CURRENT_CAMPAIGN_ID = id || null;
  if (!id) {
    document.getElementById('cfg-policy-form').style.display = 'none';
    return;
  }
  const r = await cfgApi(`/cyborg/admin/config/campaign/${encodeURIComponent(id)}`, { method: 'GET' });
  if (r.status === 401) { location.reload(); return; }
  if (!r.ok) {
    cfgShowStatus('cfg-policy-status', `Failed to load campaign (${r.status}).`, 'err');
    return;
  }
  const d = await r.json();
  CFG_KNOBS = d.knobs || CFG_KNOBS;
  const settings = (d.campaign && d.campaign.settings) || {};
  const presetId = (d.campaign && d.campaign.preset_id) || '';
  CFG_ORIGINAL_SETTINGS = JSON.parse(JSON.stringify(settings));
  renderPresetPicker(presetId);
  renderKnobFields(settings);
  document.getElementById('cfg-policy-form').style.display = 'block';
  cfgShowStatus('cfg-policy-status', '');
}

function renderPresetPicker(selectedId) {
  const sel = document.getElementById('cfg-preset-select');
  if (!sel) return;
  sel.innerHTML = '';
  const ph = document.createElement('option');
  ph.value = ''; ph.textContent = '— no preset (use default image) —';
  sel.appendChild(ph);
  for (const p of CFG_PRESETS) {
    const opt = document.createElement('option');
    opt.value = p.id;
    const buildState = p.current_image_tag
      ? ` · built (${p.last_build_status || 'success'})`
      : ' · NOT YET BUILT';
    opt.textContent = `${p.display_name}${buildState}`;
    if (p.id === selectedId) opt.selected = true;
    sel.appendChild(opt);
  }
  updatePresetWarn();
  sel.onchange = updatePresetWarn;
}

function updatePresetWarn() {
  const sel = document.getElementById('cfg-preset-select');
  const warn = document.getElementById('cfg-preset-warn');
  if (!sel || !warn) return;
  const p = CFG_PRESETS.find(x => x.id === sel.value);
  if (p && !p.current_image_tag) {
    warn.style.display = 'block';
    warn.innerHTML = `<strong>Preset not yet built.</strong> Tokens in this campaign will spawn from the default image until the preset is built. Click <strong>Build</strong> on the Presets card.`;
  } else {
    warn.style.display = 'none';
    warn.textContent = '';
  }
}

function renderKnobFields(settings) {
  const host = document.getElementById('cfg-knob-fields');
  host.innerHTML = '';
  for (const knob of CFG_KNOBS) {
    const wrap = document.createElement('div');
    wrap.className = 'cfg-knob';

    const meta = document.createElement('div');
    meta.className = 'cfg-knob-meta';
    meta.innerHTML = `
      <div class="cfg-knob-label">${cfgEscapeHtml(knob.label)}</div>
      <div class="cfg-knob-spine">${cfgEscapeHtml(knob.spine_name)} · default ${cfgEscapeHtml(Array.isArray(knob.default) ? knob.default.join(', ') : String(knob.default))}</div>
    `;
    wrap.appendChild(meta);

    const input = document.createElement('div');
    input.className = 'cfg-knob-input';
    const cur = settings[knob.key] !== undefined ? settings[knob.key] : knob.default;

    if (knob.type === 'enum') {
      const sel = document.createElement('select');
      sel.dataset.knob = knob.key;
      for (const opt of knob.options) {
        const o = document.createElement('option');
        o.value = opt.value; o.textContent = opt.label;
        if (opt.value === cur) o.selected = true;
        sel.appendChild(o);
      }
      input.appendChild(sel);
    } else if (knob.type === 'int') {
      const i = document.createElement('input');
      i.type = 'number'; i.value = String(cur);
      if (knob.min !== undefined) i.min = String(knob.min);
      if (knob.max !== undefined) i.max = String(knob.max);
      if (knob.step !== undefined) i.step = String(knob.step);
      i.dataset.knob = knob.key;
      input.appendChild(i);
    } else if (knob.type === 'bool') {
      input.classList.add('bool');
      const i = document.createElement('input');
      i.type = 'checkbox'; i.checked = !!cur;
      i.dataset.knob = knob.key;
      i.style.width = 'auto'; i.style.margin = '0';
      input.appendChild(i);
    } else if (knob.type === 'string_array') {
      const tags = document.createElement('div');
      tags.className = 'cfg-tool-tags'; tags.dataset.knob = knob.key;
      const selected = new Set(Array.isArray(cur) ? cur : []);
      for (const opt of knob.options) {
        const t = document.createElement('span');
        t.className = 'cfg-tool-tag' + (selected.has(opt) ? ' selected' : '');
        t.textContent = opt; t.dataset.value = opt;
        t.addEventListener('click', () => t.classList.toggle('selected'));
        tags.appendChild(t);
      }
      input.appendChild(tags);
    }
    wrap.appendChild(input);
    host.appendChild(wrap);
  }
}

function collectPolicyFromForm() {
  const out = {};
  for (const knob of CFG_KNOBS) {
    if (knob.type === 'enum') {
      const sel = document.querySelector(`#cfg-knob-fields select[data-knob="${knob.key}"]`);
      if (sel) out[knob.key] = sel.value;
    } else if (knob.type === 'int') {
      const i = document.querySelector(`#cfg-knob-fields input[data-knob="${knob.key}"]`);
      if (i) out[knob.key] = parseInt(i.value, 10);
    } else if (knob.type === 'bool') {
      const i = document.querySelector(`#cfg-knob-fields input[data-knob="${knob.key}"]`);
      if (i) out[knob.key] = !!i.checked;
    } else if (knob.type === 'string_array') {
      const container = document.querySelector(`#cfg-knob-fields [data-knob="${knob.key}"]`);
      if (container) {
        out[knob.key] = Array.from(container.querySelectorAll('.cfg-tool-tag.selected')).map((t) => t.dataset.value);
      }
    }
  }
  return out;
}

async function saveCampaignPolicy() {
  if (!CFG_CURRENT_CAMPAIGN_ID) return;
  const policy = collectPolicyFromForm();
  const presetSel = document.getElementById('cfg-preset-select');
  const presetId = presetSel ? presetSel.value : '';
  cfgShowStatus('cfg-policy-status', 'Saving…');
  const r = await cfgApi(`/cyborg/admin/config/campaign/${encodeURIComponent(CFG_CURRENT_CAMPAIGN_ID)}`, {
    method: 'PATCH',
    body: JSON.stringify({ settings: policy, preset_id: presetId || null }),
  });
  if (r.status === 401) { location.reload(); return; }
  const d = await r.json().catch(() => null);
  if (!r.ok || !d || !d.campaign) {
    const detail = d && d.details ? ` (${d.details.join('; ')})` : '';
    cfgShowStatus('cfg-policy-status', ((d && d.error) || `Save failed (${r.status})`) + detail, 'err');
    return;
  }
  CFG_ORIGINAL_SETTINGS = JSON.parse(JSON.stringify(d.campaign.settings || {}));
  cfgShowStatus('cfg-policy-status', 'Saved. New machines will pick up the change.', 'ok');
}

function resetPolicyForm() {
  renderKnobFields(CFG_ORIGINAL_SETTINGS);
  cfgShowStatus('cfg-policy-status', 'Reverted to last-saved values.');
}

// ── Trace tab ─────────────────────────────────────────────────────────────
async function traceTokenLookup() {
  const token = document.getElementById('cfg-trace-token').value.trim();
  if (!token) {
    cfgShowStatus('cfg-trace-status', 'Paste a candidate token first.', 'err');
    return;
  }
  cfgShowStatus('cfg-trace-status', 'Loading…');
  document.getElementById('cfg-trace-empty').style.display = 'none';
  document.getElementById('cfg-trace-result').innerHTML = '';

  const r = await cfgApi(`/cyborg/admin/config/trace?token=${encodeURIComponent(token)}`, { method: 'GET' });
  if (r.status === 401) { location.reload(); return; }
  const d = await r.json().catch(() => null);

  if (r.status === 404) {
    cfgShowStatus('cfg-trace-status', `No token matching ${token.slice(0, 12)}… in the database.`, 'err');
    document.getElementById('cfg-trace-empty').style.display = 'block';
    return;
  }
  if (!r.ok || !d || !d.found) {
    cfgShowStatus('cfg-trace-status', (d && d.error) || `Lookup failed (${r.status}).`, 'err');
    return;
  }

  cfgShowStatus('cfg-trace-status', '');
  document.getElementById('cfg-trace-result').innerHTML = renderTrace(d);
}

function classifyEvent(row) {
  const action = String(row.action || '');
  const success = row.success !== false;
  if (action === 'rate_limit_hit') return 'cfg-evt-ratelimit';
  if (!success) return 'cfg-evt-fail';
  return '';
}

function renderTrace(d) {
  const t = d.token_row || {};
  const issued = t.issued_at ? new Date(t.issued_at).toLocaleString('en-GB') : '—';
  const expires = t.expires_at ? new Date(t.expires_at).toLocaleString('en-GB') : '—';
  const machine = t.fly_machine_id || '—';
  const launched = t.launched_at ? new Date(t.launched_at).toLocaleString('en-GB') : '—';
  const used = t.active_time_used_seconds || 0;
  const cap = t.active_time_cap_seconds || 28800;
  const status = t.revoked_at ? 'revoked'
              : t.used_at ? 'used'
              : !t.approved_at ? 'pending'
              : (t.expires_at && new Date(t.expires_at) < new Date()) ? 'expired'
              : 'active';

  const headerHtml = `
    <div class="cfg-trace-section">
      <h3>Token</h3>
      <table>
        <tr><th>Token</th><td class="mono">${cfgEscapeHtml(d.token)}</td></tr>
        <tr><th>Candidate</th><td>${cfgEscapeHtml(t.candidate_label || '—')} ${t.candidate_email ? `<span class="mono" style="color:var(--w-muted);">(${cfgEscapeHtml(t.candidate_email)})</span>` : ''}</td></tr>
        <tr><th>Status</th><td><span class="pill ${cfgEscapeHtml(status)}">${cfgEscapeHtml(status)}</span></td></tr>
        <tr><th>Issued</th><td>${cfgEscapeHtml(issued)}</td></tr>
        <tr><th>Expires</th><td>${cfgEscapeHtml(expires)}</td></tr>
        <tr><th>Campaign</th><td class="mono">${t.campaign_id ? cfgEscapeHtml(t.campaign_id) : '(none)'}</td></tr>
        <tr><th>Fly machine</th><td class="mono">${cfgEscapeHtml(machine)}</td></tr>
        <tr><th>Launched at</th><td>${cfgEscapeHtml(launched)}</td></tr>
        <tr><th>Active time</th><td>${Math.floor(used/60)} min used / ${Math.floor(cap/60)} min cap</td></tr>
      </table>
    </div>
  `;

  const rows = d.audit_rows || [];
  const timelineHtml = `
    <div class="cfg-trace-section">
      <h3>Audit trail · last ${rows.length} of ${d.audit_row_limit || 50}</h3>
      ${rows.length === 0 ? '<div class="empty" style="padding:14px;">No audit events for this token yet.</div>' : `
        <div class="cfg-trace-timeline">
          ${rows.map((r) => {
            const cls = classifyEvent(r);
            const detail = r.detail ? cfgEscapeHtml(JSON.stringify(r.detail)) : '';
            const ts = r.created_at ? new Date(r.created_at).toLocaleString('en-GB') : '';
            return `
              <div class="cfg-trace-event ${cls}">
                <time>${cfgEscapeHtml(ts)}</time>
                <span class="cfg-evt-action">· ${cfgEscapeHtml(r.action || '')}</span>
                ${r.success === false ? '<span style="color:#bf2600;"> · FAILED</span>' : ''}
                ${r.actor_email ? `<span style="color:var(--w-muted);"> · ${cfgEscapeHtml(r.actor_email)}</span>` : ''}
                ${detail ? `<div class="cfg-trace-meta">${detail}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;

  const sub = d.submission;
  const submissionHtml = sub ? `
    <div class="cfg-trace-section">
      <h3>Submission</h3>
      <table>
        <tr><th>Submission ID</th><td class="mono">${cfgEscapeHtml(sub.id)}</td></tr>
        <tr><th>Submitted at</th><td>${cfgEscapeHtml(sub.submitted_at ? new Date(sub.submitted_at).toLocaleString('en-GB') : '—')}</td></tr>
        <tr><th>Received at</th><td>${cfgEscapeHtml(sub.received_at ? new Date(sub.received_at).toLocaleString('en-GB') : '—')}</td></tr>
        <tr><th>Trigger</th><td>${cfgEscapeHtml(sub.trigger || '—')}</td></tr>
        <tr><th>Dev mode</th><td>${sub.dev_mode ? 'yes' : 'no'}</td></tr>
      </table>
    </div>
  ` : '<div class="cfg-trace-section"><h3>Submission</h3><div class="empty" style="padding:10px;">No submission yet.</div></div>';

  const rep = d.report;
  const reportHtml = rep ? `
    <div class="cfg-trace-section">
      <h3>Report</h3>
      <table>
        <tr><th>Status</th><td>${cfgEscapeHtml(rep.status || '—')}</td></tr>
        <tr><th>Error</th><td>${cfgEscapeHtml(rep.error || '—')}</td></tr>
        <tr><th>Cost (USD)</th><td>${cfgEscapeHtml(rep.cost_usd != null ? String(rep.cost_usd) : '—')}</td></tr>
        <tr><th>Scored at</th><td>${cfgEscapeHtml(rep.scored_at ? new Date(rep.scored_at).toLocaleString('en-GB') : '—')}</td></tr>
      </table>
    </div>
  ` : '<div class="cfg-trace-section"><h3>Report</h3><div class="empty" style="padding:10px;">No report yet.</div></div>';

  return headerHtml + timelineHtml + submissionHtml + reportHtml;
}

// ── Presets card (v1.1) ───────────────────────────────────────────────────
async function loadPresets() {
  const r = await cfgApi('/cyborg/admin/presets', { method: 'GET' });
  if (r.status === 401) { location.reload(); return; }
  let d = null;
  try { d = await r.json(); } catch { d = null; }
  if (!r.ok || !d) {
    cfgShowStatus('presets-status', `Failed to load presets (${r.status}).`, 'err');
    return;
  }
  CFG_PRESETS = d.presets || [];
  renderPresetsList();
}

function renderPresetsList() {
  const body = document.getElementById('presets-body');
  if (!body) return;
  if (CFG_PRESETS.length === 0) {
    body.innerHTML = '<div class="empty">No presets defined. Edit <code>workspace-content/presets/v6.yaml</code> and run the migration to seed.</div>';
    return;
  }
  const rows = CFG_PRESETS.map((p) => {
    const status = p.last_build_status || (p.current_image_tag ? 'success' : '—');
    const statusClass = status === 'success' ? 'active' : (status === 'running' ? 'pending' : (status === 'failed' ? 'revoked' : 'expired'));
    const built = p.current_image_tag ? cfgEscapeHtml(p.current_image_tag) : '—';
    const lastAt = p.last_build_at ? new Date(p.last_build_at).toLocaleString('en-GB') : '—';
    const buildDisabled = status === 'running' ? 'disabled' : '';
    const buildLabel = status === 'running' ? 'Building…' : 'Build';
    return `
      <tr data-slug="${cfgEscapeHtml(p.slug)}">
        <td>
          <div style="font-weight:500;">${cfgEscapeHtml(p.display_name)}</div>
          <div style="font-size:0.78rem; color:var(--w-muted);">${cfgEscapeHtml(p.slug)} · ${cfgEscapeHtml(p.key_source || '—')}</div>
        </td>
        <td><span class="pill ${statusClass}">${cfgEscapeHtml(status)}</span></td>
        <td class="mono" style="font-size:0.78rem;">${built}</td>
        <td>${cfgEscapeHtml(lastAt)}</td>
        <td><button class="btn small" onclick="buildPreset('${cfgEscapeHtml(p.slug)}')" ${buildDisabled}>${buildLabel}</button></td>
      </tr>
    `;
  }).join('');
  body.innerHTML = `
    <table>
      <thead><tr><th>Preset</th><th>Build</th><th>Image tag</th><th>Last build</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
  // Resume polls for any preset stuck in 'running' (e.g. page reload during a build).
  for (const p of CFG_PRESETS) {
    if (p.last_build_status === 'running' && !CFG_PRESET_POLL_TIMERS[p.slug]) {
      pollPresetBuildStatus(p.slug);
    }
  }
}

async function buildPreset(slug) {
  cfgShowStatus('presets-status', `Dispatching build for ${slug}…`);
  const r = await cfgApi('/cyborg/admin/presets/build', {
    method: 'POST',
    body: JSON.stringify({ preset_slug: slug }),
  });
  if (r.status === 401) { location.reload(); return; }
  const d = await r.json().catch(() => null);
  if (!r.ok || !d || !d.ok) {
    cfgShowStatus('presets-status', (d && d.error) || `Dispatch failed (${r.status}).`, 'err');
    return;
  }
  cfgShowStatus('presets-status', `Build dispatched for ${slug}. Polling…`, 'ok');
  await loadPresets();   // immediate refresh shows running pill
  pollPresetBuildStatus(slug);
}

function pollPresetBuildStatus(slug) {
  if (CFG_PRESET_POLL_TIMERS[slug]) clearInterval(CFG_PRESET_POLL_TIMERS[slug]);
  const intervalId = setInterval(async () => {
    const r = await cfgApi(`/cyborg/admin/presets/build-status?preset_slug=${encodeURIComponent(slug)}`, { method: 'GET' });
    if (!r.ok) return;
    const d = await r.json().catch(() => null);
    if (!d || !d.preset) return;
    const status = d.preset.last_build_status;
    if (status !== 'running') {
      clearInterval(intervalId);
      delete CFG_PRESET_POLL_TIMERS[slug];
      const msg = status === 'success'
        ? `Build complete: ${d.preset.current_image_tag}`
        : `Build ${status || 'ended'} for ${slug}.`;
      cfgShowStatus('presets-status', msg, status === 'success' ? 'ok' : 'err');
      await loadPresets();
    }
  }, 5000);
  CFG_PRESET_POLL_TIMERS[slug] = intervalId;
}

// ── Org → preset assignment ───────────────────────────────────────────────
async function loadOrgListForPresetAssign() {
  const sel = document.getElementById('op-org');
  if (!sel) return;
  const r = await cfgApi('/cyborg/admin/orgs/list', { method: 'GET' });
  if (!r.ok) return;
  const d = await r.json().catch(() => null);
  if (!d || !d.orgs) return;
  sel.innerHTML = '';
  const ph = document.createElement('option');
  ph.value = ''; ph.textContent = '— pick an organisation —';
  sel.appendChild(ph);
  for (const o of d.orgs) {
    const opt = document.createElement('option');
    opt.value = o.id; opt.textContent = o.name;
    sel.appendChild(opt);
  }
}

async function loadOrgPresetAssignment(orgId) {
  const body = document.getElementById('op-assignment-body');
  if (!body) return;
  if (!orgId) { body.innerHTML = ''; return; }
  const r = await cfgApi(`/cyborg/admin/orgs/${encodeURIComponent(orgId)}/presets`, { method: 'GET' });
  if (!r.ok) {
    body.innerHTML = `<div class="status err">Lookup failed (${r.status}).</div>`;
    return;
  }
  const d = await r.json();
  const rows = (d.presets || []).map((p) => `
    <label style="display:flex; align-items:center; gap:8px; padding:6px 0; font-size:0.88rem;">
      <input type="checkbox" data-preset-id="${cfgEscapeHtml(p.id)}" ${p.assigned ? 'checked' : ''} />
      <span>${cfgEscapeHtml(p.display_name)} <span style="color:var(--w-muted); font-family:var(--c-mono); font-size:0.78rem;">${cfgEscapeHtml(p.slug)}</span></span>
    </label>
  `).join('');
  body.innerHTML = `
    <div style="margin-top:8px;">${rows}</div>
    <button class="btn small" onclick="saveOrgPresetAssignment('${cfgEscapeHtml(orgId)}')" style="margin-top:10px;">Save assignment</button>
    <div id="op-status" class="status" style="margin-top:8px;"></div>
  `;
}

async function saveOrgPresetAssignment(orgId) {
  const body = document.getElementById('op-assignment-body');
  if (!body) return;
  const checked = Array.from(body.querySelectorAll('input[type="checkbox"]'))
    .filter((i) => i.checked)
    .map((i) => i.dataset.presetId);
  const r = await cfgApi(`/cyborg/admin/orgs/${encodeURIComponent(orgId)}/presets`, {
    method: 'PUT',
    body: JSON.stringify({ preset_ids: checked }),
  });
  const d = await r.json().catch(() => null);
  const status = document.getElementById('op-status');
  if (!r.ok || !d || !d.ok) {
    if (status) { status.className = 'status err'; status.textContent = (d && d.error) || `Save failed (${r.status}).`; }
    return;
  }
  if (status) { status.className = 'status ok'; status.textContent = `Assigned ${checked.length} preset(s).`; }
}
