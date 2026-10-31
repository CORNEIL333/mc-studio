/* MC Studio — envoi des demandes clients vers le CRM.
   Sur le site déployé (Next.js + Cloudflare D1), chaque formulaire est enregistré via /api/leads
   et apparaît dans le CRM, onglet « Demandes clients ». En local (file://) ou sur un hébergement
   sans CRM, l'envoi échoue silencieusement : le message WhatsApp reste le canal de secours. */
window.MCLeads = (() => {
  const ENDPOINT = '/api/leads';

  async function save(lead) {
    if (!/^https?:$/.test(location.protocol)) return false;
    const body = { ...lead, page: location.pathname.split('/').pop() || 'index.html' };
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true });
      return r.ok;
    } catch (_) { return false; }
  }

  return { save };
})();
