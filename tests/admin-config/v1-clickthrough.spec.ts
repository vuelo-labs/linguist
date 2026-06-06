import { test, expect, Page } from '@playwright/test';

const ADMIN_URL = '/cyborg/admin/';

const MOCK_ORGS = [
  { id: 'org-vuelo', name: 'Vuelo Labs', slug: 'vuelo-labs', limits: null, counts: { members: 1, campaigns: 0, candidates: 0 } },
  { id: 'org-acme',  name: 'Acme Inc',   slug: 'acme',        limits: { members: 5, campaigns: 100, candidates: 100 }, counts: { members: 2, campaigns: 1, candidates: 4 } },
];

const MOCK_KNOBS = [
  { key: 'pin_model', spine_name: 'CYBORG_PIN_MODEL', label: 'Claude model', type: 'enum',
    options: [{ value: 'claude-haiku-4-5', label: 'Haiku 4.5' }, { value: 'claude-sonnet-4-6', label: 'Sonnet 4.6' }],
    default: 'claude-haiku-4-5', env_var: 'CYBORG_PIN_MODEL' },
  { key: 'token_budget', spine_name: 'CYBORG_TOKEN_BUDGET', label: 'Token budget',
    type: 'int', min: 1000, max: 5000000, step: 1000, default: 500000, env_var: 'CYBORG_TOKEN_BUDGET' },
  { key: 'block_external_https', spine_name: 'CYBORG_BLOCK_EXTERNAL_HTTPS', label: 'Block external HTTPS',
    type: 'bool', default: false, env_var: 'CYBORG_BLOCK_EXTERNAL_HTTPS' },
  { key: 'disallowed_tools', spine_name: 'CYBORG_DISALLOWED_TOOLS', label: 'Disallowed tools',
    type: 'string_array', options: ['WebFetch', 'WebSearch', 'BashOutput'],
    default: ['WebFetch', 'WebSearch'], env_var: 'CYBORG_DISALLOWED_TOOLS' },
];

const MOCK_CAMPAIGNS = [
  { id: 'cmp-1', organisation_id: 'org-acme', name: 'Acme eng hiring 2026', slug: 'acme-eng-2026', status: 'active',
    settings: { pin_model: 'claude-haiku-4-5', token_budget: 500000 }, created_at: '2026-06-01T12:00:00Z', token_count: 4 },
  { id: 'cmp-2', organisation_id: 'org-vuelo', name: 'Internal dogfood', slug: 'internal-dogfood', status: 'active',
    settings: {}, created_at: '2026-05-10T09:00:00Z', token_count: 1 },
];

const MOCK_TOKEN_TRACE = {
  token: 'cyb_abc123def456789012ab',
  found: true,
  audit_row_limit: 50,
  token_row: {
    token: 'cyb_abc123def456789012ab',
    candidate_label: 'Test Candidate (test@example.com)',
    candidate_email: 'test@example.com',
    organisation_id: 'org-acme',
    campaign_id: 'cmp-1',
    issued_at: '2026-06-05T14:22:08Z',
    expires_at: '2026-06-06T14:22:08Z',
    used_at: null,
    revoked_at: null,
    approved_at: '2026-06-05T14:22:08Z',
    fly_machine_id: 'd896d75c739218',
    machine_url: 'https://test-machine.fly.dev',
    launched_at: '2026-06-05T14:23:08Z',
    active_time_used_seconds: 1450,
    active_time_cap_seconds: 28800,
  },
  audit_rows: [
    { id: 'a1', created_at: '2026-06-05T14:23:08Z', action: 'launch', target: 'cyb_abc123def456',
      success: true, detail: { machine_id: 'd896d75c739218' }, actor_email: 'liam@vuelolabs.com', ip: '203.0.113.1' },
    { id: 'a2', created_at: '2026-06-05T14:25:33Z', action: 'rate_limit_hit', target: 'cyb_abc123def456',
      success: true, detail: { count: 11, limit: 10 }, actor_email: '(public)', ip: '203.0.113.1' },
    { id: 'a3', created_at: '2026-06-05T14:30:01Z', action: 'submit', target: 'cyb_abc123def456',
      success: false, detail: { error: 'transient_supabase_error' }, actor_email: '(public)', ip: '203.0.113.1' },
  ],
  submission: null,
  report: null,
};

async function mockApi(page: Page) {
  await page.route('**/cyborg/list', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ tokens: [] }) }));
  await page.route('**/cyborg/reports/list', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ reports: [] }) }));
  await page.route('**/cyborg/admin/orgs/list', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ orgs: MOCK_ORGS }) }));

  await page.route('**/cyborg/admin/config/campaigns', (route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      const newCampaign = {
        id: 'cmp-new',
        organisation_id: body.organisation_id,
        name: body.name,
        slug: (body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: 'active',
        settings: body.settings || {},
        created_at: new Date().toISOString(),
      };
      MOCK_CAMPAIGNS.push({ ...newCampaign, token_count: 0 });
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ campaign: newCampaign }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ campaigns: MOCK_CAMPAIGNS, knobs: MOCK_KNOBS }) });
  });

  await page.route('**/cyborg/admin/config/campaign/**', (route) => {
    const url = new URL(route.request().url());
    const id = url.pathname.split('/').pop()!;
    const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id);
    if (!campaign) {
      return route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'Campaign not found' }) });
    }
    if (route.request().method() === 'PATCH') {
      const body = JSON.parse(route.request().postData() || '{}');
      campaign.settings = { ...(campaign.settings || {}), ...(body.settings || {}) };
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ campaign }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ campaign, knobs: MOCK_KNOBS }) });
  });

  await page.route('**/cyborg/admin/config/trace**', (route) => {
    const url = new URL(route.request().url());
    const token = url.searchParams.get('token') || '';
    if (!token.startsWith('cyb_')) {
      return route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ token, found: false }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOKEN_TRACE) });
  });
}

test.describe('Admin config pane — v1 click-through', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test('1. Configuration card renders on admin landing', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await expect(page.locator('#config-card')).toBeVisible();
    await expect(page.locator('#config-card h2')).toContainText('Configuration & Diagnostics');
    await expect(page.locator('.cfg-tab[data-tab="policy"]')).toHaveClass(/active/);
  });

  test('2. Policy tab loads campaign list (or empty state)', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    const sel = page.locator('#cfg-campaign-select');
    await expect(sel).toBeVisible();
    const options = await sel.locator('option').allTextContents();
    expect(options.join(' ')).toContain('Acme eng hiring 2026');
    expect(options.join(' ')).toContain('Internal dogfood');
  });

  test('3. Creating a campaign adds it to the list', async ({ page }) => {
    page.on('console', (msg) => console.log('PAGE LOG:', msg.type(), msg.text()));
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    // Ensure the org dropdown got populated by loadOrgListForCampaignForm.
    await expect(page.locator('#cc-org option')).toHaveCount(MOCK_ORGS.length);
    await page.locator('#cfg-create-campaign summary').click();
    await page.locator('#cc-name').fill('Sales pilot Q4');
    await page.locator('#cc-org').selectOption('org-acme');
    // Watch the POST so we can assert the create request fired.
    const createPromise = page.waitForResponse((resp) =>
      resp.url().endsWith('/cyborg/admin/config/campaigns') && resp.request().method() === 'POST'
    );
    await page.locator('#cfg-create-campaign').getByRole('button', { name: 'Create' }).click();
    await createPromise;
    await expect(page.locator('#cfg-policy-status')).toContainText(/created/i);
    await expect(page.locator('#cfg-campaign-select')).toContainText('Sales pilot Q4');
  });

  test('4. Editing campaign policy renders the knob form', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#cfg-campaign-select').selectOption('cmp-1');
    await expect(page.locator('#cfg-policy-form')).toBeVisible();
    await expect(page.locator('.cfg-knob-label').first()).toContainText('Claude model');
    await expect(page.locator('.cfg-knob')).toHaveCount(4);

    // Toggle the boolean
    const blockHttpsCheckbox = page.locator('input[data-knob="block_external_https"]');
    await blockHttpsCheckbox.check();
    // Change the model
    await page.locator('select[data-knob="pin_model"]').selectOption('claude-sonnet-4-6');
    // Save
    await page.getByRole('button', { name: 'Save policy' }).click();
    await expect(page.locator('#cfg-policy-status')).toContainText(/saved/i);
  });

  test('5. Trace tab accepts a token paste; empty state for unknown', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.locator('.cfg-tab[data-tab="trace"]').click();
    await expect(page.locator('#cfg-panel-trace')).toBeVisible();
    await page.locator('#cfg-trace-token').fill('bogus-token');
    await page.getByRole('button', { name: 'Trace' }).click();
    await expect(page.locator('#cfg-trace-status')).toContainText(/No token/i);
  });

  test('6. Known token renders the timeline with severity badges', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.locator('.cfg-tab[data-tab="trace"]').click();
    await page.locator('#cfg-trace-token').fill('cyb_abc123def456789012ab');
    await page.getByRole('button', { name: 'Trace' }).click();
    await expect(page.locator('#cfg-trace-result')).toContainText('Test Candidate');
    await expect(page.locator('.cfg-trace-event')).toHaveCount(3);
    await expect(page.locator('.cfg-evt-fail')).toHaveCount(1);
    await expect(page.locator('.cfg-evt-ratelimit')).toHaveCount(1);
  });
});

test.describe('Admin config pane — screenshots for review', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test('screenshot-policy-tab', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#cfg-campaign-select').selectOption('cmp-1');
    await page.locator('#cfg-policy-form').waitFor({ state: 'visible' });
    await page.locator('#config-card').screenshot({ path: 'tests/admin-config/screenshots/01-policy-tab.png' });
  });

  test('screenshot-policy-saved', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#cfg-campaign-select').selectOption('cmp-1');
    await page.locator('#cfg-policy-form').waitFor({ state: 'visible' });
    await page.locator('input[data-knob="block_external_https"]').check();
    await page.getByRole('button', { name: 'Save policy' }).click();
    await page.locator('#cfg-policy-status.ok').waitFor();
    await page.locator('#config-card').screenshot({ path: 'tests/admin-config/screenshots/02-policy-saved.png' });
  });

  test('screenshot-trace-tab', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.locator('.cfg-tab[data-tab="trace"]').click();
    await page.locator('#cfg-trace-token').fill('cyb_abc123def456789012ab');
    await page.getByRole('button', { name: 'Trace' }).click();
    await page.locator('.cfg-trace-event').first().waitFor();
    await page.locator('#config-card').screenshot({ path: 'tests/admin-config/screenshots/03-trace-tab.png' });
  });

  test('screenshot-empty-state', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.locator('.cfg-tab[data-tab="trace"]').click();
    await page.locator('#config-card').screenshot({ path: 'tests/admin-config/screenshots/04-trace-empty.png' });
  });
});
