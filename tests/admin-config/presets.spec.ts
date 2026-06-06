import { test, expect, Page } from '@playwright/test';

const ADMIN_URL = '/cyborg/admin/';

const MOCK_ORGS = [
  { id: 'org-vuelo', name: 'Vuelo Labs', slug: 'vuelo-labs', limits: null, counts: { members: 1, campaigns: 0, candidates: 0 } },
  { id: 'org-acme',  name: 'Acme Inc',   slug: 'acme',        limits: { members: 5, campaigns: 100, candidates: 100 }, counts: { members: 2, campaigns: 1, candidates: 4 } },
];

const MOCK_KNOBS = [
  { key: 'pin_model', spine_name: 'CYBORG_PIN_MODEL', label: 'Claude model', type: 'enum',
    options: [{ value: 'claude-haiku-4-5', label: 'Haiku 4.5' }], default: 'claude-haiku-4-5', env_var: 'CYBORG_PIN_MODEL' },
  { key: 'token_budget', spine_name: 'CYBORG_TOKEN_BUDGET', label: 'Token budget',
    type: 'int', min: 1000, max: 5000000, step: 1000, default: 500000, env_var: 'CYBORG_TOKEN_BUDGET' },
];

const MOCK_PRESETS = [
  { id: 'preset-haiku',  slug: 'haiku-byo',       display_name: 'Haiku BYO (starter)',  description: 'Haiku, BYO, small.',  key_source: 'byo', current_image_tag: 'v6-haiku-byo-abc123',  current_git_sha: 'abc123', last_build_at: '2026-06-06T08:00:00Z', last_build_status: 'success' },
  { id: 'preset-sonnet', slug: 'sonnet-balanced', display_name: 'Sonnet balanced',       description: 'Sonnet, BYO, med.',   key_source: 'byo', current_image_tag: null, current_git_sha: null, last_build_at: null, last_build_status: null },
  { id: 'preset-opus',   slug: 'opus-byo-loose',  display_name: 'Opus BYO (loose)',     description: 'Opus, BYO, large.',   key_source: 'byo', current_image_tag: null, current_git_sha: null, last_build_at: null, last_build_status: null },
];

const MOCK_CAMPAIGNS = [
  { id: 'cmp-1', organisation_id: 'org-acme', name: 'Acme eng hiring 2026', slug: 'acme-eng-2026', status: 'active',
    settings: {}, preset_id: 'preset-haiku', created_at: '2026-06-01T12:00:00Z', token_count: 4 },
];

let buildDispatched: { slug: string; callback_run_id: string } | null = null;
let buildStatusByPreset: Record<string, string> = {};

async function mockApi(page: Page) {
  buildDispatched = null;
  buildStatusByPreset = {};
  // Reset preset mutations between tests (test 2 builds sonnet, etc.).
  MOCK_PRESETS[1].current_image_tag = null;
  MOCK_PRESETS[1].current_git_sha = null;
  MOCK_PRESETS[1].last_build_status = null;
  MOCK_PRESETS[1].last_build_at = null;
  MOCK_PRESETS[2].current_image_tag = null;
  MOCK_PRESETS[2].current_git_sha = null;
  MOCK_PRESETS[2].last_build_status = null;
  MOCK_PRESETS[2].last_build_at = null;

  await page.route('**/cyborg/list', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ tokens: [] }) }));
  await page.route('**/cyborg/reports/list', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ reports: [] }) }));
  await page.route('**/cyborg/admin/orgs/list', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ orgs: MOCK_ORGS }) }));

  await page.route('**/cyborg/admin/presets', (route) => {
    const enriched = MOCK_PRESETS.map((p) => ({
      ...p,
      last_build_status: buildStatusByPreset[p.slug] ?? p.last_build_status,
    }));
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ presets: enriched }) });
  });

  await page.route('**/cyborg/admin/presets/build', (route) => {
    const body = JSON.parse(route.request().postData() || '{}');
    const slug = body.preset_slug;
    const callback_run_id = `cb_test_${Date.now()}`;
    buildDispatched = { slug, callback_run_id };
    buildStatusByPreset[slug] = 'running';
    return route.fulfill({ status: 202, contentType: 'application/json', body: JSON.stringify({ ok: true, preset_slug: slug, callback_run_id, started_at: new Date().toISOString() }) });
  });

  await page.route('**/cyborg/admin/presets/build-status*', (route) => {
    const url = new URL(route.request().url());
    const slug = url.searchParams.get('preset_slug') || '';
    const preset = MOCK_PRESETS.find((p) => p.slug === slug);
    if (!preset) return route.fulfill({ status: 404, contentType: 'application/json', body: '{"error":"unknown"}' });
    // Flip running → success on the second status poll.
    const polled = (buildStatusByPreset[`__polls_${slug}`] || 0) + 1;
    buildStatusByPreset[`__polls_${slug}`] = polled as any;
    if (buildStatusByPreset[slug] === 'running' && polled >= 2) {
      buildStatusByPreset[slug] = 'success';
      preset.current_image_tag = `v6-${slug}-faketag`;
      preset.last_build_status = 'success';
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ preset: { ...preset, last_build_status: buildStatusByPreset[slug] || preset.last_build_status, current_image_tag: preset.current_image_tag } }) });
  });

  await page.route('**/cyborg/admin/orgs/*/presets', (route) => {
    if (route.request().method() === 'PUT') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, org_id: 'org-acme', assigned: [] }) });
    }
    const enriched = MOCK_PRESETS.map((p) => ({ ...p, assigned: p.slug === 'haiku-byo' }));
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ org_id: 'org-acme', presets: enriched }) });
  });

  await page.route('**/cyborg/admin/config/campaigns', (route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      const np = { ...body, id: 'cmp-new', status: 'active', settings: body.settings || {}, preset_id: body.preset_id || null, created_at: new Date().toISOString() };
      MOCK_CAMPAIGNS.push({ ...np, slug: 'new', token_count: 0 } as any);
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ campaign: np }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ campaigns: MOCK_CAMPAIGNS, knobs: MOCK_KNOBS }) });
  });

  await page.route('**/cyborg/admin/config/campaign/**', (route) => {
    const url = new URL(route.request().url());
    const id = url.pathname.split('/').pop()!;
    const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id);
    if (!campaign) return route.fulfill({ status: 404, contentType: 'application/json', body: '{"error":"not found"}' });
    if (route.request().method() === 'PATCH') {
      const body = JSON.parse(route.request().postData() || '{}');
      if (body.settings) campaign.settings = { ...(campaign.settings || {}), ...body.settings };
      if (body.preset_id !== undefined) campaign.preset_id = body.preset_id;
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ campaign }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ campaign, knobs: MOCK_KNOBS }) });
  });

  await page.route('**/cyborg/admin/config/trace**', (route) => route.fulfill({ status: 404, contentType: 'application/json', body: '{"found":false}' }));
}

test.describe('Admin presets — v1.1 click-through', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test('1. Presets card renders with three presets', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#presets-card h2')).toContainText('Presets');
    const rows = page.locator('#presets-body tbody tr');
    await expect(rows).toHaveCount(3);
    await expect(rows.first()).toContainText('Haiku BYO');
  });

  test('2. Build button dispatches + polls + flips to success', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    const sonnetRow = page.locator('#presets-body tbody tr[data-slug="sonnet-balanced"]');
    await expect(sonnetRow).toContainText('—');
    await sonnetRow.getByRole('button', { name: 'Build' }).click();
    await expect(page.locator('#presets-status')).toContainText(/Dispatched|Polling/);
    // Poll twice flips to success per the mock.
    await expect(sonnetRow).toContainText('success', { timeout: 15000 });
  });

  test('3. Campaign editor shows preset picker with build status', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#cfg-campaign-select').selectOption('cmp-1');
    await expect(page.locator('#cfg-policy-form')).toBeVisible();
    await expect(page.locator('#cfg-preset-select')).toBeVisible();
    const opts = await page.locator('#cfg-preset-select option').allTextContents();
    expect(opts.some((o) => o.includes('Haiku BYO') && o.includes('built'))).toBeTruthy();
    expect(opts.some((o) => o.includes('Sonnet') && o.includes('NOT YET BUILT'))).toBeTruthy();
  });

  test('4. Picking an unbuilt preset shows the warning banner', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#cfg-campaign-select').selectOption('cmp-1');
    await page.locator('#cfg-preset-select').selectOption('preset-sonnet');
    await expect(page.locator('#cfg-preset-warn')).toBeVisible();
    await expect(page.locator('#cfg-preset-warn')).toContainText(/not yet built/i);
  });

  test('5. Org → preset assignment shows preset list with checkboxes', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#presets-card details').first().locator('summary').click();
    await page.locator('#op-org').selectOption('org-acme');
    await expect(page.locator('#op-assignment-body input[type="checkbox"]')).toHaveCount(3);
    await expect(page.locator('#op-assignment-body input[type="checkbox"][data-preset-id="preset-haiku"]')).toBeChecked();
  });

  test('6. Screenshot — presets card with mixed build states', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#presets-card').screenshot({ path: 'tests/admin-config/screenshots/v11-01-presets-card.png' });
  });

  test('7. Screenshot — campaign editor with preset picker', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#cfg-campaign-select').selectOption('cmp-1');
    await page.locator('#cfg-policy-form').waitFor({ state: 'visible' });
    await page.locator('#config-card').screenshot({ path: 'tests/admin-config/screenshots/v11-02-campaign-preset-picker.png' });
  });

  test('8. Screenshot — unbuilt preset warning', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#cfg-campaign-select').selectOption('cmp-1');
    await page.locator('#cfg-preset-select').selectOption('preset-sonnet');
    await page.locator('#cfg-preset-warn').waitFor({ state: 'visible' });
    await page.locator('#config-card').screenshot({ path: 'tests/admin-config/screenshots/v11-03-unbuilt-warning.png' });
  });
});
