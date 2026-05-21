'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GET_ZONES, CREER_ZONE, UPDATE_DENSITE } from '@/lib/graphql/trafic.queries';

type TrafficZone = {
  id: string;
  nom: string;
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
  nombreVehicules: number;
  niveauTrafic: string;
};

function NiveauBadge({ niveau }: { niveau: string }) {
  const colors: Record<string, string> = {
    FAIBLE: 'bg-green-500/20 text-green-400',
    MOYEN:  'bg-orange-500/20 text-orange-400',
    ELEVE:  'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${colors[niveau] ?? 'bg-slate-500/20 text-slate-400'}`}>
      {niveau}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

type Filtre = 'TOUS' | 'FAIBLE' | 'MOYEN' | 'ELEVE';
const NIVEAUX: Filtre[] = ['TOUS', 'FAIBLE', 'MOYEN', 'ELEVE'];

type CoordKey = 'latMin' | 'latMax' | 'lonMin' | 'lonMax';
const COORD_FIELDS: { key: CoordKey; label: string; placeholder: string }[] = [
  { key: 'latMin', label: 'Lat Min', placeholder: '36.80' },
  { key: 'latMax', label: 'Lat Max', placeholder: '36.82' },
  { key: 'lonMin', label: 'Lon Min', placeholder: '10.17' },
  { key: 'lonMax', label: 'Lon Max', placeholder: '10.19' },
];

export default function TraficPage() {
  const [filtre, setFiltre] = useState<Filtre>('TOUS');
  const [showCreerModal, setShowCreerModal] = useState(false);
  const [showDensiteModal, setShowDensiteModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<TrafficZone | null>(null);
  const [densiteValue, setDensiteValue] = useState(0);
  const [errorCreer, setErrorCreer] = useState('');
  const [errorDensite, setErrorDensite] = useState('');
  const [form, setForm] = useState({ nom: '', latMin: '', latMax: '', lonMin: '', lonMax: '' });

  const { data, loading, refetch } = useQuery<{ zones: TrafficZone[] }>(GET_ZONES);

  const [creerZone, { loading: creating }] = useMutation(CREER_ZONE, {
    onCompleted: () => {
      setShowCreerModal(false);
      setForm({ nom: '', latMin: '', latMax: '', lonMin: '', lonMax: '' });
      refetch();
    },
    onError: (err: any) => {
      setErrorCreer(err?.graphQLErrors?.[0]?.message ?? err?.message ?? 'Erreur lors de la création');
    },
  });

  const [updateDensite, { loading: updating }] = useMutation(UPDATE_DENSITE, {
    onCompleted: () => {
      setShowDensiteModal(false);
      setSelectedZone(null);
      refetch();
    },
    onError: (err: any) => {
      setErrorDensite(err?.graphQLErrors?.[0]?.message ?? err?.message ?? 'Erreur lors de la mise à jour');
    },
  });

  const zones: TrafficZone[] = data?.zones ?? [];
  const byNiveau = (n: string) => zones.filter((z) => z.niveauTrafic === n).length;
  const filtered = filtre === 'TOUS' ? zones : zones.filter((z) => z.niveauTrafic === filtre);

  const handleCreer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCreer('');
    const { nom, latMin, latMax, lonMin, lonMax } = form;
    if (!nom || !latMin || !latMax || !lonMin || !lonMax) {
      setErrorCreer('Veuillez remplir tous les champs');
      return;
    }
    await creerZone({
      variables: {
        input: {
          nom,
          latMin: parseFloat(latMin),
          latMax: parseFloat(latMax),
          lonMin: parseFloat(lonMin),
          lonMax: parseFloat(lonMax),
        },
      },
    });
  };

  const openDensiteModal = (zone: TrafficZone) => {
    setSelectedZone(zone);
    setDensiteValue(zone.nombreVehicules);
    setErrorDensite('');
    setShowDensiteModal(true);
  };

  const handleUpdateDensite = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDensite('');
    if (!selectedZone) return;
    await updateDensite({ variables: { input: { zoneId: selectedZone.id, nombreVehicules: densiteValue } } });
  };

  const getNiveauResultant = (val: number) => val < 10 ? 'FAIBLE' : val < 30 ? 'MOYEN' : 'ELEVE';

  const getNiveauColor = (niveau: string) => {
    if (niveau === 'ELEVE') return 'bg-red-400';
    if (niveau === 'MOYEN') return 'bg-orange-400';
    return 'bg-green-400';
  };

  const statCards = [
    { niveau: 'FAIBLE', bg: 'bg-green-600/20', text: 'text-green-400', dot: 'bg-green-400' },
    { niveau: 'MOYEN',  bg: 'bg-orange-600/20', text: 'text-orange-400', dot: 'bg-orange-400' },
    { niveau: 'ELEVE',  bg: 'bg-red-600/20',    text: 'text-red-400',    dot: 'bg-red-400'    },
  ];

  return (
    <DashboardLayout title="Trafic" subtitle="Gestion des zones de circulation">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {NIVEAUX.map((n) => {
            const activeStyles: Record<Filtre, string> = {
              TOUS:   'bg-blue-600 text-white shadow-lg shadow-blue-500/20',
              FAIBLE: 'bg-green-500/20 text-green-400 border border-green-500/30',
              MOYEN:  'bg-orange-500/20 text-orange-400 border border-orange-500/30',
              ELEVE:  'bg-red-500/20 text-red-400 border border-red-500/30',
            };
            return (
              <button
                key={n}
                onClick={() => setFiltre(n)}
                className={`text-xs px-3 py-2 rounded-xl font-medium transition-all ${
                  filtre === n
                    ? activeStyles[n]
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => { setErrorCreer(''); setShowCreerModal(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter une zone
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statCards.map(({ niveau, bg, text, dot }) => (
          <div key={niveau} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <div className={`w-3 h-3 rounded-full ${dot}`} />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Zones {niveau}</p>
              <p className={`text-2xl font-bold mt-0.5 ${text}`}>{byNiveau(niveau)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h3 className="text-white font-semibold">
            Zones de circulation
            <span className="text-slate-400 text-sm font-normal ml-2">({filtered.length})</span>
          </h3>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400">Aucune zone trouvée</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">NOM</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">NIVEAU</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">VÉHICULES</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">COORDONNÉES GPS</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((zone) => (
                <tr key={zone.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 text-white font-medium text-sm">{zone.nom}</td>
                  <td className="px-6 py-4"><NiveauBadge niveau={zone.niveauTrafic} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getNiveauColor(zone.niveauTrafic)}`} />
                      <span className="text-slate-300 text-sm">{zone.nombreVehicules}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-400 text-xs font-mono space-y-0.5">
                      <div>Lat {zone.latMin} → {zone.latMax}</div>
                      <div>Lon {zone.lonMin} → {zone.lonMax}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openDensiteModal(zone)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all font-medium flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Simuler densité
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Créer zone */}
      {showCreerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Créer une zone</h3>
              <button onClick={() => setShowCreerModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {errorCreer && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-4 text-sm">
                {errorCreer}
              </div>
            )}

            <form onSubmit={handleCreer} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Nom de la zone</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Centre Tunis"
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Coordonnées GPS</label>
                <div className="grid grid-cols-2 gap-3">
                  {COORD_FIELDS.map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-slate-500 text-xs mb-1">{label}</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowCreerModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-3 text-sm font-medium transition-all">
                  Annuler
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl py-3 text-sm font-medium transition-all">
                  {creating ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Simulation densité */}
      {showDensiteModal && selectedZone && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold text-lg">Simuler la densité</h3>
                <p className="text-slate-400 text-xs mt-0.5">{selectedZone.nom}</p>
              </div>
              <button onClick={() => setShowDensiteModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {errorDensite && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-4 text-sm">
                {errorDensite}
              </div>
            )}

            <form onSubmit={handleUpdateDensite} className="space-y-5">
              <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                <p className="text-slate-400 text-xs mb-2">Niveau résultant</p>
                <NiveauBadge niveau={getNiveauResultant(densiteValue)} />
                <p className="text-slate-500 text-xs mt-2">
                  {densiteValue < 10
                    ? '< 10 véhicules → FAIBLE'
                    : densiteValue < 30
                    ? '10–29 véhicules → MOYEN'
                    : '≥ 30 véhicules → ÉLEVÉ'}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 text-sm font-medium">Nombre de véhicules</label>
                  <span className="text-white font-bold text-lg">{densiteValue}</span>
                </div>
                <input
                  type="range" min={0} max={60} value={densiteValue}
                  onChange={(e) => setDensiteValue(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-slate-500 text-xs mt-1">
                  <span>0</span><span>30</span><span>60</span>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Ou saisir manuellement</label>
                <input
                  type="number" min={0} value={densiteValue}
                  onChange={(e) => setDensiteValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowDensiteModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-3 text-sm font-medium transition-all">
                  Annuler
                </button>
                <button type="submit" disabled={updating}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl py-3 text-sm font-medium transition-all">
                  {updating ? 'Mise à jour...' : 'Appliquer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}