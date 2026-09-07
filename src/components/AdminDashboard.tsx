import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  FileText,
  AlertCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import { FarmerProfile, AuditLog, ImpactMetrics } from '../types';
import { formatINR } from '../utils/pricing';

interface AdminDashboardProps {
  analytics: any;
  farmers: FarmerProfile[];
  auditLogs: AuditLog[];
  impact: ImpactMetrics;
  onVerifyFarmer: (farmerId: string, verified: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  analytics,
  farmers,
  auditLogs,
  impact,
  onVerifyFarmer
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FARMERS' | 'AUDIT'>('OVERVIEW');
  const [filterFarmerQuery, setFilterFarmerQuery] = useState('');

  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(filterFarmerQuery.toLowerCase()) ||
    f.farmName.toLowerCase().includes(filterFarmerQuery.toLowerCase()) ||
    f.address.district.toLowerCase().includes(filterFarmerQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Admin Title */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Platform Governance & Compliance
            </span>
            <span className="text-xs text-stone-500">Fair Trade & Audit Oversight</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">FarmDirect Operations Command Center</h2>
          <p className="text-xs text-stone-500">
            Monitor platform health, verify farmer credentials, and inspect immutable audit transactions.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'OVERVIEW' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            System Metrics
          </button>
          <button
            onClick={() => setActiveTab('FARMERS')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'FARMERS' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            Farmer Verifications ({farmers.length})
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'AUDIT' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'OVERVIEW' && (
        <>
          {/* Key Financial KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Platform GMV</span>
              <div className="text-2xl font-bold text-stone-900 mt-1">{formatINR(analytics.totalGmv || 428000)}</div>
              <span className="text-[11px] text-emerald-700 font-medium">100% Escrow protected</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Farmer Direct Payouts</span>
              <div className="text-2xl font-bold text-emerald-900 mt-1">{formatINR(analytics.farmerEarnings || 395000)}</div>
              <span className="text-[11px] text-emerald-700 font-semibold">+66% above middlemen rate</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Platform Revenue (3% Fee)</span>
              <div className="text-2xl font-bold text-stone-900 mt-1">{formatINR(analytics.platformFees || 12840)}</div>
              <span className="text-[11px] text-stone-500">Transparent flat fee</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Customer Savings Generated</span>
              <div className="text-2xl font-bold text-teal-800 mt-1">{formatINR(impact.totalBuyerSavingsRupees || 98000)}</div>
              <span className="text-[11px] text-teal-700 font-medium">Saved vs supermarket markup</span>
            </div>
          </div>

          {/* Verification & Compliance Status */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Direct Trade Governance & Standards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="font-bold text-emerald-950 block">AGMARKNET Mandi Synced</span>
                <span className="text-emerald-800 text-[11px]">Official market prices updated automatically every 4 hours from Agmarknet Kolar, Azadpur & Lasalgaon.</span>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <span className="font-bold text-blue-950 block">Payment Escrow Guarantee</span>
                <span className="text-blue-800 text-[11px]">Consumer funds held in escrow and released to farmer instantly upon verified delivery OTP.</span>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                <span className="font-bold text-purple-950 block">Zero Commission Agents</span>
                <span className="text-purple-800 text-[11px]">4 intermediary markup layers bypassed entirely. Verified food miles: -42% average carbon reduction.</span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'FARMERS' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-stone-900">
              Registered Farmer Verification Management ({farmers.length})
            </h3>
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter farmers..."
                value={filterFarmerQuery}
                onChange={e => setFilterFarmerQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {filteredFarmers.map(farmer => (
              <div key={farmer.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {farmer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{farmer.farmName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        farmer.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {farmer.verified ? 'Verified Active' : 'Pending Review'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Farmer: {farmer.name} &bull; {farmer.address.district}, {farmer.address.state} &bull; {farmer.farmSizeAcres} Acres
                    </p>
                    <div className="flex gap-1.5 mt-1">
                      {farmer.badges.map((b, i) => (
                        <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {farmer.verified ? (
                    <button
                      onClick={() => onVerifyFarmer(farmer.id, false)}
                      className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Suspend Verification
                    </button>
                  ) : (
                    <button
                      onClick={() => onVerifyFarmer(farmer.id, true)}
                      className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Approve & Verify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'AUDIT' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              Immutable Transaction & System Audit Trail
            </h3>
            <span className="text-xs text-stone-400">Cryptographically logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Target Entity</th>
                  <th className="py-2.5 px-3">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50/70">
                    <td className="py-2.5 px-3 text-stone-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-800">{log.actorName}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-sans font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-700">{log.targetEntity}</td>
                    <td className="py-2.5 px-3 text-stone-500 truncate max-w-xs">{JSON.stringify(log.details)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
