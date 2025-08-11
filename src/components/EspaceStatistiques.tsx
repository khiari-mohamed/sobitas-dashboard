'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, BarChart3, LineChart } from 'lucide-react';
import StatisticsResults from './StatisticsResults';

const modules = [
  'Commande',
  'Facture TVA',
  'Bon de commande',
  'Produit',
  'Redirection',
  'Review',
  'Seo Page',
  'Ticket',
  'User'
];

export default function EspaceStatistiques() {
  const [module, setModule] = useState('Commande');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  if (showResults) {
    return (
      <StatisticsResults 
        module={module}
        startDate={startDate}
        endDate={endDate}
        chartType={chartType}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="bg-white p-6 mt-6 rounded-md shadow-sm">
      <h2 className="text-2xl text-gray-600 font-semibold mb-6 text-center">
        Espace Statistiques
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Module */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Module : <span className="text-red-600">*</span>
          </label>
          <select 
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-500"
          >
            {modules.map((mod) => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début (optionnel) :</label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring focus:border-blue-500"
              />
              <CalendarDays className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin (optionnel) :</label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring focus:border-blue-500"
              />
              <CalendarDays className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Chart Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Type affichage :</label>
          <div className="flex items-center gap-10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="chartType"
                value="bar"
                checked={chartType === 'bar'}
                onChange={() => setChartType('bar')}
                className="text-blue-500"
              />
              <BarChart3 className="w-6 h-6 text-gray-700" />
              <span className="text-sm text-gray-600">Histogramme</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="chartType"
                value="line"
                checked={chartType === 'line'}
                onChange={() => setChartType('line')}
                className="text-blue-500"
              />
              <LineChart className="w-6 h-6 text-gray-700" />
              <span className="text-sm text-gray-600">Linéaire</span>
            </label>
          </div>
        </div>

        {/* Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1da1f2] hover:bg-[#0d8ddb] disabled:bg-gray-400 text-white px-6 py-2 rounded-md text-sm transition flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {loading ? 'Chargement...' : 'Exécuter'}
          </button>
        </div>
      </form>
    </div>
  );
}
