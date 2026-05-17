'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GET_VEHICLES, CREATE_VEHICLE } from '@/lib/graphql/vehicules.queries';

const TYPES = ['VOITURE', 'CAMION', 'MOTO', 'BUS'];

function TypeBadge({ type }: { type: string }) {
  const colors: any = {
    VOITURE: 'bg-blue-500/20 text-blue-400',
    CAMION: 'bg-orange-500/20 text-orange-400',
    MOTO: 'bg-purple-500/20 text-purple-400',
    BUS: 'bg-green-500/20 text-green-400',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${colors[type] || 'bg-slate-500/20 text-slate-400'}`}>
      {type}
    </span>
  );
}

export default function VehiculesPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    immatriculation: '',
    marque: '',
    modele: '',
    type: 'VOITURE',
  });
  const [error, setError] = useState('');

  const { data, loading, refetch } = useQuery<any>(GET_VEHICLES);

  const [createVehicle, { loading: creating }] = useMutation(CREATE_VEHICLE, {
  onCompleted: () => {
    setShowModal(false);
    setForm({ immatriculation: '', marque: '', modele: '', type: 'VOITURE' });
    refetch();
  },
  onError: (error: any) => {
    const message = error?.graphQLErrors?.[0]?.message 
      || error?.networkError?.message 
      || error?.message 
      || 'Erreur lors de la création du véhicule';
    setError(message);
  },
});

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  if (!form.immatriculation || !form.marque || !form.modele) {
    setError('Veuillez remplir tous les champs');
    return;
  }
  try {
    await createVehicle({ variables: { input: form } });
      } catch (err: any) {
    setError(err?.message || 'Erreur lors de la création');
      }
  };

  const filtered = data?.vehicles?.filter((v: any) =>
    v.immatriculation.toLowerCase().includes(search.toLowerCase()) ||
    v.marque.toLowerCase().includes(search.toLowerCase()) ||
    v.modele.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <DashboardLayout title="Véhicules" subtitle="Gestion de la flotte">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un véhicule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-72"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un véhicule
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {TYPES.map((type) => {
          const count = data?.vehicles?.filter((v: any) => v.type === type).length || 0;
          return (
            <div key={type} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs">{type}</p>
              <p className="text-white text-2xl font-bold mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-white font-semibold">
            Liste des véhicules
            <span className="text-slate-400 text-sm font-normal ml-2">({filtered.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400">Aucun véhicule trouvé</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">IMMATRICULATION</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">MARQUE</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">MODELE</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">TYPE</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-3">STATUT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vehicle: any) => (
                <tr key={vehicle.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-white font-mono text-sm">{vehicle.immatriculation}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{vehicle.marque}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{vehicle.modele}</td>
                  <td className="px-6 py-4"><TypeBadge type={vehicle.type} /></td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${vehicle.actif ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {vehicle.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Ajouter */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Ajouter un véhicule</h3>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Immatriculation</label>
                <input
                  type="text"
                  value={form.immatriculation}
                  onChange={(e) => setForm({ ...form, immatriculation: e.target.value })}
                  placeholder="TUN-1234"
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Marque</label>
                <input
                  type="text"
                  value={form.marque}
                  onChange={(e) => setForm({ ...form, marque: e.target.value })}
                  placeholder="Peugeot"
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Modèle</label>
                <input
                  type="text"
                  value={form.modele}
                  onChange={(e) => setForm({ ...form, modele: e.target.value })}
                  placeholder="208"
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-3 text-sm font-medium transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl py-3 text-sm font-medium transition-all"
                >
                  {creating ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}