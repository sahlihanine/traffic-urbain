'use client';
import { useQuery } from '@apollo/client/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GET_VEHICLES } from '@/lib/graphql/vehicules.queries';
import { GET_ZONES } from '@/lib/graphql/trafic.queries';
import { GET_INCIDENTS } from '@/lib/graphql/incidents.queries';

function StatCard({ title, value, subtitle, color, icon }: any) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-white text-3xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { data: vehiclesData } = useQuery<any>(GET_VEHICLES);
const { data: zonesData } = useQuery<any>(GET_ZONES);
const { data: incidentsData } = useQuery<any>(GET_INCIDENTS);

const totalVehicules = vehiclesData?.vehicles?.length || 0;
const totalZones = zonesData?.zones?.length || 0;
const zonesElevees = zonesData?.zones?.filter((z: any) => z.niveauTrafic === 'ELEVE').length || 0;
const incidentsSignales = incidentsData?.incidents?.filter((i: any) => i.statut === 'SIGNALE').length || 0;
const totalIncidents = incidentsData?.incidents?.length || 0;

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Vue globale de la plateforme"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Véhicules"
          value={totalVehicules}
          subtitle="Véhicules enregistrés"
          color="bg-blue-600/20"
          icon={
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          }
        />
        <StatCard
          title="Zones de Trafic"
          value={totalZones}
          subtitle="Zones surveillées"
          color="bg-green-600/20"
          icon={
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          }
        />
        <StatCard
          title="Zones Congestionnées"
          value={zonesElevees}
          subtitle="Niveau ÉLEVÉ"
          color="bg-red-600/20"
          icon={
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatCard
          title="Incidents Signalés"
          value={incidentsSignales}
          subtitle={`${totalIncidents} incidents au total`}
          color="bg-orange-600/20"
          icon={
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          }
        />
      </div>

      {/* Incidents récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Derniers incidents */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Incidents récents</h3>
          <div className="space-y-3">
            {incidentsData?.incidents?.slice(0, 5).map((incident: any) => (
              <div key={incident.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    incident.statut === 'SIGNALE' ? 'bg-red-400' :
                    incident.statut === 'EN_COURS' ? 'bg-orange-400' : 'bg-green-400'
                  }`} />
                  <div>
                    <p className="text-white text-sm font-medium">{incident.type}</p>
                    <p className="text-slate-400 text-xs">{incident.description?.slice(0, 40)}...</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                  incident.statut === 'SIGNALE' ? 'bg-red-500/20 text-red-400' :
                  incident.statut === 'EN_COURS' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {incident.statut}
                </span>
              </div>
            ))}
            {(!incidentsData?.incidents || incidentsData.incidents.length === 0) && (
              <p className="text-slate-500 text-sm text-center py-4">Aucun incident</p>
            )}
          </div>
        </div>

        {/* Zones de trafic */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Zones de trafic</h3>
          <div className="space-y-3">
            {zonesData?.zones?.slice(0, 5).map((zone: any) => (
              <div key={zone.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                <div>
                  <p className="text-white text-sm font-medium">{zone.nom}</p>
                  <p className="text-slate-400 text-xs">{zone.nombreVehicules} véhicules</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                  zone.niveauTrafic === 'ELEVE' ? 'bg-red-500/20 text-red-400' :
                  zone.niveauTrafic === 'MOYEN' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {zone.niveauTrafic}
                </span>
              </div>
            ))}
            {(!zonesData?.zones || zonesData.zones.length === 0) && (
              <p className="text-slate-500 text-sm text-center py-4">Aucune zone</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}