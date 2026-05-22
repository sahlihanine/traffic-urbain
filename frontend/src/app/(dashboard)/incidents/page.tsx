'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GET_INCIDENTS, DECLARER_INCIDENT, MODIFIER_STATUT } from '@/lib/graphql/incidents.queries';

type Incident = {
  id: string;
  type: string;
  statut: string;
  description: string;
  latitude: number;
  longitude: number;
  declarePar: string;
  createdAt: string;
  updatedAt?: string;
};

const TYPES_INCIDENT = ['ACCIDENT', 'TRAVAUX', 'ROUTE_FERMEE', 'EMBOUTEILLAGE'];

type FiltreStatut = 'TOUS' | 'SIGNALE' | 'EN_COURS' | 'RESOLU';
const FILTRES: FiltreStatut[] = ['TOUS', 'SIGNALE', 'EN_COURS', 'RESOLU'];

const STAT_CARDS = [
  { statut: 'SIGNALE',  bg: 'bg-red-600/20',   text: 'text-red-400',    dot: 'bg-red-400'    },
  { statut: 'EN_COURS', bg: 'bg-orange-600/20', text: 'text-orange-400', dot: 'bg-orange-400' },
  { statut: 'RESOLU',   bg: 'bg-green-600/20',  text: 'text-green-400',  dot: 'bg-green-400'  },
];

const FILTRE_ACTIVE: Record<FiltreStatut, string> = {
  TOUS:     'bg-blue-600 text-white shadow-lg shadow-blue-500/20',
  SIGNALE:  'bg-red-500/20 text-red-400 border border-red-500/30',
  EN_COURS: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  RESOLU:   'bg-green-500/20 text-green-400 border border-green-500/30',
};

function StatutBadge({ statut }: { statut: string }) {
  const colors: Record<string, string> = {
    SIGNALE:  'bg-red-500/20 text-red-400',
    EN_COURS: 'bg-orange-500/20 text-orange-400',
    RESOLU:   'bg-green-500/20 text-green-400',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${colors[statut] ?? 'bg-slate-500/20 text-slate-400'}`}>
      {statut.replace('_', ' ')}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    ACCIDENT:      'bg-red-500/20 text-red-400',
    TRAVAUX:       'bg-yellow-500/20 text-yellow-400',
    ROUTE_FERMEE:  'bg-purple-500/20 text-purple-400',
    EMBOUTEILLAGE: 'bg-orange-500/20 text-orange-400',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${colors[type] ?? 'bg-slate-500/20 text-slate-400'}`}>
      {type.replace('_', ' ')}
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

function nextStatut(current: string): string | null {
  if (current === 'SIGNALE')  return 'EN_COURS';
  if (current === 'EN_COURS') return 'RESOLU';
  return null;
}

function nextStatutLabel(current: string): string | null {
  if (current === 'SIGNALE')  return '→ EN COURS';
  if (current === 'EN_COURS') return '→ RÉSOLU';
  return null;
}

export default function IncidentsPage() {
  const [filtre, setFiltre]       = useState<FiltreStatut>('TOUS');
  const [showModal, setShowModal] = useState(false);
  const [error, setError]         = useState('');
  const [isAdmin, setIsAdmin]     = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);
  const [form, setForm] = useState({
    type: 'ACCIDENT',
    description: '',
    latitude: '',
    longitude: '',
    declarePar: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setIsAdmin(parsed?.role === 'ADMIN');
      setCurrentUser(parsed);
      setForm(prev => ({
        ...prev,
        declarePar: parsed?.email || parsed?.id || 'Utilisateur'
      }));
    }
  }, []);

  const { data, loading, refetch } = useQuery<{ incidents: Incident[] }>(GET_INCIDENTS);

  const [declarerIncident, { loading: declaring }] = useMutation(DECLARER_INCIDENT, {
    onCompleted: () => {
      setShowModal(false);
      setForm({ 
        type: 'ACCIDENT', 
        description: '', 
        latitude: '', 
        longitude: '', 
        declarePar: currentUser?.email || currentUser?.id || 'Utilisateur' 
      });
      refetch();
    },
    onError: (err: any) => {
      setError(err?.graphQLErrors?.[0]?.message ?? err?.message ?? 'Erreur lors de la déclaration');
    },
  });

  const [modifierStatut] = useMutation(MODIFIER_STATUT, {
    onCompleted: () => refetch(),
    onError: (err: any) => console.error(err),
  });

  const incidents: Incident[] = data?.incidents ?? [];
  const byStatut = (s: string) => incidents.filter((i) => i.statut === s).length;
  const filtered = filtre === 'TOUS' ? incidents : incidents.filter((i) => i.statut === filtre);

  const handleDeclarer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { type, description, latitude, longitude, declarePar } = form;
    if (!description || !latitude || !longitude || !declarePar) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    await declarerIncident({
      variables: {
        input: {
          type,
          description,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          declarePar,
        },
      },
    });
  };

  const handleModifierStatut = async (incident: Incident) => {
    const next = nextStatut(incident.statut);
    if (!next) return;
    await modifierStatut({
      variables: { input: { id: incident.id, statut: next } },
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <DashboardLayout title="Incidents" subtitle="Gestion des incidents routiers">

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {FILTRES.map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`text-xs px-3 py-2 rounded-xl font-medium transition-all ${
                filtre === f
                  ? FILTRE_ACTIVE[f]
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button
          onClick={() => { 
            setError(''); 
            setShowModal(true); 
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Déclarer un incident
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {STAT_CARDS.map(({ statut, bg, text, dot }) => (
          <div key={statut} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <div className={`w-3 h-3 rounded-full ${dot}`} />
            </div>
            <div>
              <p className="text-slate-400 text-xs">{statut.replace('_', ' ')}</p>
              <p className={`text-2xl font-bold mt-0.5 ${text}`}>{byStatut(statut)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h3 className="text-white font-semibold">
            Liste des incidents
            <span className="text-slate-400 text-sm font-normal ml-2">({filtered.length})</span>
          </h3>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400">Aucun incident trouvé</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">TYPE</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">STATUT</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">DESCRIPTION</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">GPS</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">DÉCLARÉ PAR</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">DATE</th>
                {isAdmin && (
                  <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">ACTIONS</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((incident) => {
                const next = nextStatut(incident.statut);
                const nextLabel = nextStatutLabel(incident.statut);
                return (
                  <tr key={incident.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4"><TypeBadge type={incident.type} /></td>
                    <td className="px-6 py-4"><StatutBadge statut={incident.statut} /></td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 text-sm">
                        {incident.description.length > 45
                          ? incident.description.slice(0, 45) + '...'
                          : incident.description}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-400 text-xs font-mono space-y-0.5">
                        <div>Lat {incident.latitude}</div>
                        <div>Lon {incident.longitude}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{incident.declarePar}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{formatDate(incident.createdAt)}</td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        {next && nextLabel ? (
                          <button
                            onClick={() => handleModifierStatut(incident)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                              next === 'EN_COURS'
                                ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {nextLabel}
                          </button>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Déclarer un incident</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleDeclarer} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Type d'incident</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {TYPES_INCIDENT.map((t) => (
                    <option key={t} value={t}>{t.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez l'incident..."
                  rows={3}
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Coordonnées GPS</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-xs mb-1">Latitude</label>
                    <input
                      type="number" step="0.0001"
                      value={form.latitude}
                      onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                      placeholder="36.8065"
                      className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-xs mb-1">Longitude</label>
                    <input
                      type="number" step="0.0001"
                      value={form.longitude}
                      onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                      placeholder="10.1815"
                      className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Déclaré par</label>
                <input
                  type="text"
                  value={form.declarePar}
                  onChange={(e) => setForm({ ...form, declarePar: e.target.value })}
                  placeholder="Nom ou ID de l'opérateur"
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <p className="text-slate-500 text-xs mt-1">
                  {currentUser?.role === 'ADMIN' ? 'Admin' : 'Opérateur'} connecté
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-3 text-sm font-medium transition-all">
                  Annuler
                </button>
                <button type="submit" disabled={declaring}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl py-3 text-sm font-medium transition-all">
                  {declaring ? 'Déclaration...' : 'Déclarer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}