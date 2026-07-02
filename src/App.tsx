import { useEffect, useState, useMemo } from 'react';
import { getCostAndUsage, type ResultByTime } from './api/costs';
import Sidebar from './components/Sidebar';
import KpiCard from './components/KpiCard';
import DailyCostsChart from './components/DailyCostsChart';
import ServiceBreakdownChart from './components/ServiceBreakdownChart';
import ServicesTable from './components/ServicesTable';
import AdminPanel from './components/AdminPanel';

// Taux USD -> EUR (aligné sur estimation_couts_aws.xlsx)
const USD_TO_EUR = 0.93;
// Marge commerciale 42c (aligné sur maquette dashboard_client.html)
const MARGIN_PERCENT = 18;

// Périodes disponibles (le jeu de données de l'API simulée couvre janvier-mars 2022)
const PRESETS: Array<{ label: string; from: string; to: string }> = [
  { label: '7 jours', from: '2022-01-01', to: '2022-01-08' },
  { label: '30 jours', from: '2022-01-01', to: '2022-01-31' },
  { label: 'Février', from: '2022-02-01', to: '2022-03-01' },
  { label: 'T1 complet', from: '2022-01-01', to: '2022-03-31' },
];

type ViewMode = 'client' | 'admin';

export default function App() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[1]);
  const [results, setResults] = useState<ResultByTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('client');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getCostAndUsage(
      { Start: selectedPreset.from, End: selectedPreset.to },
      { Type: 'DIMENSION', Key: 'SERVICE' }
    )
      .then((data) => {
        if (!cancelled) {
          setResults(data.ResultsByTime);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(String(err.message || err));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedPreset]);

  // Calculs agrégés
  const kpis = useMemo(() => {
    const grossUSD = results.reduce(
      (sum, r) => sum + parseFloat(r.Total.UnblendedCost.Amount),
      0
    );
    const grossEUR = grossUSD * USD_TO_EUR;
    const marginEUR = grossEUR * (MARGIN_PERCENT / 100);
    const totalRefactureEUR = grossEUR + marginEUR;

    // Prévision fin de période : projection linéaire simple sur base des jours écoulés
    const daysInPeriod = results.length;
    const forecastEUR = daysInPeriod > 0 ? (totalRefactureEUR / daysInPeriod) * 30 : 0;

    return { grossEUR, marginEUR, totalRefactureEUR, forecastEUR };
  }, [results]);

  // Séries agrégées par service (pour camembert + tableau + catalogue admin)
  const byService = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of results) {
      for (const g of r.Groups) {
        const key = g.Keys[0];
        const usd = parseFloat(g.Metrics.UnblendedCost.Amount);
        map.set(key, (map.get(key) || 0) + usd);
      }
    }
    return Array.from(map.entries())
      .map(([service, usd]) => ({
        service,
        grossEUR: usd * USD_TO_EUR,
        marginEUR: usd * USD_TO_EUR * (MARGIN_PERCENT / 100),
        totalEUR: usd * USD_TO_EUR * (1 + MARGIN_PERCENT / 100),
      }))
      .sort((a, b) => b.grossEUR - a.grossEUR);
  }, [results]);

  // Séries journalières (pour le graphique en aire)
  const daily = useMemo(() => {
    return results.map((r) => ({
      date: r.TimePeriod.Start,
      grossEUR: parseFloat(r.Total.UnblendedCost.Amount) * USD_TO_EUR,
      refactureEUR:
        parseFloat(r.Total.UnblendedCost.Amount) * USD_TO_EUR * (1 + MARGIN_PERCENT / 100),
    }));
  }, [results]);

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <div>
            <div className="crumb">
              Tableau de bord / {view === 'client' ? 'Coûts AWS' : 'Administration'}
            </div>
            <h1>
              {view === 'client'
                ? `Coûts d'infrastructure — ${selectedPreset.label}`
                : 'Gestion des clients'}
            </h1>
          </div>
          <div className="topbar-right">
            <div className="view-toggle" role="tablist" aria-label="Changer de vue">
              <button
                role="tab"
                aria-selected={view === 'client'}
                className={`view-toggle-btn ${view === 'client' ? 'active' : ''}`}
                onClick={() => setView('client')}
              >
                👤 Client
              </button>
              <button
                role="tab"
                aria-selected={view === 'admin'}
                className={`view-toggle-btn ${view === 'admin' ? 'active' : ''}`}
                onClick={() => setView('admin')}
              >
                🛠️ Admin
              </button>
            </div>
            {view === 'client' && (
              <div className="actions">
                <button className="btn">📥 Export Excel</button>
                <button className="btn btn-primary">🧾 Télécharger facture</button>
              </div>
            )}
          </div>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Environnement</label>
            <select>
              <option>Editions Galaxie / prod-photos-presse</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Période</label>
            <input type="text" value={`${selectedPreset.from} → ${selectedPreset.to}`} readOnly />
          </div>
          <div className="presets">
            <label>Presets</label>
            <div className="preset-row">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  className={`preset-btn ${p.label === selectedPreset.label ? 'active' : ''}`}
                  onClick={() => setSelectedPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-card">
            <b>⚠ Erreur de connexion à l'API</b>
            <br />
            {error}
            <br />
            <small>
              Vérifie que l'API simulée est bien lancée : <code>cd backend-api-simulee &amp;&amp; node server.js</code>
            </small>
          </div>
        )}

        {loading && !error && <div className="loading">Chargement des coûts…</div>}

        {!loading && !error && view === 'client' && (
          <>
            <div className="kpis">
              <KpiCard label="Coût brut AWS" value={kpis.grossEUR} trend="up" trendLabel="▲ vs période précédente" />
              <KpiCard label={`Marge 42c (${MARGIN_PERCENT} %)`} value={kpis.marginEUR} trend="neutral" trendLabel="Standard" />
              <KpiCard label="Total refacturé HT" value={kpis.totalRefactureEUR} trend="up" trendLabel="▲ 8,4 %" primary />
              <KpiCard label="Prévision fin de mois" value={kpis.forecastEUR} trend="down" trendLabel="Projection linéaire" />
            </div>

            <div className="charts-row">
              <div className="card">
                <h3>Coûts journaliers refacturés</h3>
                <div className="sub">Évolution sur la période sélectionnée, avec marge appliquée</div>
                <DailyCostsChart data={daily} />
              </div>

              <div className="card">
                <h3>Répartition par service AWS</h3>
                <div className="sub">Sur la période sélectionnée</div>
                <ServiceBreakdownChart data={byService} />
              </div>
            </div>

            <div className="card">
              <h3>Détail par service AWS</h3>
              <div className="sub">
                {results.length} jour(s) — projet prod-photos-presse — taux USD/EUR = {USD_TO_EUR}
              </div>
              <ServicesTable data={byService} totalGross={kpis.grossEUR} totalMargin={kpis.marginEUR} totalRefacture={kpis.totalRefactureEUR} />
            </div>
          </>
        )}

        {!loading && !error && view === 'admin' && <AdminPanel catalog={byService} />}
      </main>
    </div>
  );
}
