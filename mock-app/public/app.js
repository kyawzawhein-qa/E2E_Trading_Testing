/* Demo trading front-end helpers — portfolio mock only */
(function () {
  const AUTH_KEY = 'demo-auth';

  async function api(method, path, body) {
    const headers = { 'Content-Type': 'application/json', 'x-demo-auth': 'demo-session' };
    const response = await fetch(path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    if (method === 'POST' && path === '/v1/orders' && json && json.id) {
      window.demoApp.lastOrderId = json.id;
    }
    return { ok: response.ok, status: response.status, ...(json || {}) };
  }

  function markAuthed() {
    sessionStorage.setItem(AUTH_KEY, 'demo-session');
    document.cookie = 'demo-auth=demo-session; path=/';
  }

  function hasSession() {
    return (
      sessionStorage.getItem(AUTH_KEY) === 'demo-session' ||
      document.cookie.split(';').some((part) => part.trim() === 'demo-auth=demo-session')
    );
  }

  async function login(username, password) {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      return false;
    }
    markAuthed();
    return true;
  }

  function requireSession() {
    if (!hasSession()) {
      window.location.href = '/login';
    }
  }

  async function loadDashboard() {
    const summary = await api('GET', '/v1/account/summary');
    if (!summary.ok) return;
    document.querySelector('[data-testid="account-value"]').textContent = `$${summary.accountValue.toLocaleString()}`;
    document.querySelector('[data-testid="buying-power"]').textContent = `$${summary.buyingPower.toLocaleString()}`;
    document.querySelector('[data-testid="pl-day"]').textContent = `$${summary.plDay.toLocaleString()}`;

    const watchlist = await api('GET', '/v1/watchlist');
    const body = document.getElementById('watchlist-body');
    body.innerHTML = '';
    (watchlist.symbols || []).forEach((symbol) => {
      const tr = document.createElement('tr');
      tr.dataset.testid = `watchlist-row-${symbol}`;
      tr.dataset.symbol = symbol;
      tr.innerHTML = `<td data-testid="watchlist-symbol" data-field="symbol">${symbol}</td>`;
      body.appendChild(tr);
    });
  }

  async function loadPositions() {
    const data = await api('GET', '/v1/positions');
    const tbody = document.getElementById('positions-body');
    tbody.innerHTML = '';
    (data.positions || []).forEach((position) => {
      const tr = document.createElement('tr');
      tr.dataset.testid = `position-row-${position.symbol}`;
      tr.dataset.symbol = position.symbol;
      const netLiq = position.qty * position.avgCost;
      tr.innerHTML = `
        <td>${position.symbol}</td>
        <td data-testid="position-qty" data-field="qty">${position.qty}</td>
        <td data-testid="position-pl" data-field="pl">$0.00</td>
        <td data-testid="position-cost" data-field="cost">$${position.avgCost.toFixed(2)}</td>
        <td data-testid="position-net-liq" data-field="netLiq">$${netLiq.toFixed(2)}</td>`;
      tbody.appendChild(tr);
    });
  }

  window.demoApp = {
    api,
    login,
    requireSession,
    loadDashboard,
    loadPositions,
    lastOrderId: null,
  };
})();