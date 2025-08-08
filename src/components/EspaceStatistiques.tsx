'use client';

import { useState } from 'react';
import { CalendarDays, BarChart3, LineChart } from 'lucide-react';

export default function EspaceStatistiques() {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  return (
    <div className="bg-white p-6 mt-6 rounded-md shadow-sm">
      <h2 className="text-2xl text-gray-600 font-semibold mb-6 text-center">
        Espace Statistiques
      </h2>

      <form className="space-y-6">
        {/* Module */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Module : <span className="text-red-600">*</span>
          </label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-500">
            <option>Commande</option>
            {/* More modules can be added here */}
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner durée :</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring focus:border-blue-500"
              />
              <CalendarDays className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <label className="block text-sm font-medium text-gray-700 mb-1 invisible">.</label>
            <div className="relative">
              <input
                type="date"
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
            className="bg-[#1da1f2] hover:bg-[#0d8ddb] text-white px-6 py-2 rounded-md text-sm transition"
          >
            Exécuter
          </button>
        </div>
      </form>
    </div>
  );
}
