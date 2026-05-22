'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  GET_NOTIFICATIONS,
  ENVOYER_NOTIFICATION,
  MARQUER_LUE,
  MARQUER_TOUTES_LUES,
} from '@/lib/graphql/notifications.queries';

type Notification = {
  id: string;
  titre: string;
  message: string;
  lue: boolean;
  type: string;
  createdAt: string;
};

type User = {
  id: string;
  email: string;
  role: string;
};

const TYPES_NOTIF = ['INCIDENT', 'TRAFIC', 'SYSTEME'];
type FiltreNotif = 'TOUTES' | 'NON_LUES';
const FILTRES: FiltreNotif[] = ['TOUTES', 'NON_LUES'];

// ── Composants helpers ────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: string }) {
  if (type === 'INCIDENT') return (
    <div className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
  );
  if (type === 'TRAFIC') return (
    <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
  );
  return (
    <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    INCIDENT: 'bg-red-500/20 text-red-400',
    TRAFIC:   'bg-orange-500/20 text-orange-400',
    SYSTEME:  'bg-blue-500/20 text-blue-400',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${colors[type] ?? 'bg-slate-500/20 text-slate-400'}`}>
      {type}
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

// ── Vue ADMIN — envoyer seulement ─────────────────────────────────────────────

function AdminView() {
  const [showModal, setShowModal] = useState(false);
  const [error, setError]         = useState('');
  const [sent, setSent]           = useState(false);
  const [form, setForm] = useState({
    titre: '', message: '', destinataireId: '', type: 'SYSTEME',
  });

  const [envoyerNotification, { loading: sending }] = useMutation(ENVOYER_NOTIFICATION, {
    onCompleted: () => {
      setShowModal(false);
      setForm({ titre: '', message: '', destinataireId: '', type: 'SYSTEME' });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    },
    onError: (err: any) => {
      setError(err?.graphQLErrors?.[0]?.message ?? err?.message ?? "Erreur lors de l'envoi");
    },
  });

  const handleEnvoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.titre || !form.message || !form.destinataireId) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    await envoyerNotification({ variables: { input: form } });
  };

  return (
    <>
      {/* Bannière ADMIN */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 mb-6">
        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold text-lg">Gestion des notifications</h3>
          <p className="text-slate-400 text-sm mt-1">
            En tant qu'ADMIN, vous pouvez envoyer des notifications aux opérateurs.
          </p>
        </div>

        {/* Succès */}
        {sent && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Notification envoyée avec succès !
          </div>
        )}

        <button
          onClick={() => { setError(''); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Envoyer une notification
        </button>
      </div>

      {/* Types disponibles */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { type: 'INCIDENT', desc: 'Alertes sur les incidents routiers', bg: 'bg-red-600/20', text: 'text-red-400', dot: 'bg-red-400' },
          { type: 'TRAFIC',   desc: 'Informations sur les zones de trafic', bg: 'bg-orange-600/20', text: 'text-orange-400', dot: 'bg-orange-400' },
          { type: 'SYSTEME',  desc: 'Notifications système et maintenance', bg: 'bg-blue-600/20', text: 'text-blue-400', dot: 'bg-blue-400' },
        ].map(({ type, desc, bg, text, dot }) => (
          <div key={type} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-start gap-3">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <div className={`w-3 h-3 rounded-full ${dot}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${text}`}>{type}</p>
              <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Envoyer une notification</h3>
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

            <form onSubmit={handleEnvoyer} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {TYPES_NOTIF.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Titre</label>
                <input
                  type="text" value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  placeholder="Titre de la notification"
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Contenu de la notification..."
                  rows={3}
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">ID Destinataire</label>
                <input
                  type="text" value={form.destinataireId}
                  onChange={(e) => setForm({ ...form, destinataireId: e.target.value })}
                  placeholder="UUID de l'opérateur destinataire"
                  className="w-full bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-3 text-sm font-medium transition-all">
                  Annuler
                </button>
                <button type="submit" disabled={sending}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl py-3 text-sm font-medium transition-all">
                  {sending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ── Vue OPERATOR — liste de ses notifications ─────────────────────────────────

function OperatorView({ userId }: { userId: string }) {
  const [filtre, setFiltre] = useState<FiltreNotif>('TOUTES');

  const { data, loading, refetch } = useQuery<{ notificationsByDestinataire: Notification[] }>(
    GET_NOTIFICATIONS,
    { variables: { destinataireId: userId }, skip: !userId }
  );

  const [marquerLue] = useMutation(MARQUER_LUE, {
    onCompleted: () => refetch(),
  });

  const [marquerToutesLues, { loading: markingAll }] = useMutation(MARQUER_TOUTES_LUES, {
    onCompleted: () => refetch(),
  });

  const notifications: Notification[] = data?.notificationsByDestinataire ?? [];
  const nonLuesCount = notifications.filter((n) => !n.lue).length;
  const filtered = filtre === 'NON_LUES' ? notifications.filter((n) => !n.lue) : notifications;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center gap-2 mb-6">
        {FILTRES.map((f) => (
          <button key={f} onClick={() => setFiltre(f)}
            className={`text-xs px-3 py-2 rounded-xl font-medium transition-all ${
              filtre === f
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
            }`}
          >
            {f === 'NON_LUES' ? (
              <span className="flex items-center gap-1.5">
                NON LUES
                {nonLuesCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {nonLuesCount}
                  </span>
                )}
              </span>
            ) : f}
          </button>
        ))}
        {nonLuesCount > 0 && (
          <button onClick={() => marquerToutesLues({ variables: { destinataireId: userId } })}
            disabled={markingAll}
            className="text-xs px-3 py-2 rounded-xl font-medium bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white transition-all disabled:opacity-50"
          >
            {markingAll ? 'En cours...' : 'Tout marquer comme lu'}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total',    value: notifications.length,                 color: 'text-white',       bg: 'bg-blue-600/20',  dot: 'text-blue-400'  },
          { label: 'Non lues', value: nonLuesCount,                         color: 'text-red-400',     bg: 'bg-red-600/20',   dot: 'bg-red-400'     },
          { label: 'Lues',     value: notifications.length - nonLuesCount,  color: 'text-green-400',   bg: 'bg-green-600/20', dot: 'bg-green-400'   },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs">{label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h3 className="text-white font-semibold">
            Mes notifications
            <span className="text-slate-400 text-sm font-normal ml-2">({filtered.length})</span>
          </h3>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-slate-700/50 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {filtered.map((notif) => (
              <div key={notif.id}
                className={`px-6 py-4 flex items-start gap-4 hover:bg-slate-700/20 transition-colors ${
                  !notif.lue ? 'bg-blue-500/5 border-l-2 border-blue-500' : ''
                }`}
              >
                <TypeIcon type={notif.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm font-medium ${notif.lue ? 'text-slate-300' : 'text-white'}`}>
                      {notif.titre}
                    </p>
                    <TypeBadge type={notif.type} />
                    {!notif.lue && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{notif.message}</p>
                  <p className="text-slate-600 text-xs mt-1">{formatDate(notif.createdAt)}</p>
                </div>
                {!notif.lue ? (
                  <button onClick={() => marquerLue({ variables: { id: notif.id } })}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all font-medium">
                    Marquer lu
                  </button>
                ) : (
                  <span className="flex-shrink-0 text-xs text-slate-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lu
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [user, setUser]       = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed: User = JSON.parse(userData);
      setUser(parsed);
      setIsAdmin(parsed.role === 'ADMIN');
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <DashboardLayout
      title="Notifications"
      subtitle={isAdmin ? 'Envoi de notifications aux opérateurs' : 'Vos notifications'}
    >
      {isAdmin
        ? <AdminView />
        : <OperatorView userId={user?.id ?? ''} />
      }
    </DashboardLayout>
  );
}