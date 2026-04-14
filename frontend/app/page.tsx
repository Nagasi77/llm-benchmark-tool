"use client"
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts'

export default function Home() {
  const [results, setResults] = useState([])

  useEffect(() => {
    fetch("/results.json")
      .then((res) => res.json())
      .then((data) => {
        // Memastikan score dan latency berupa angka untuk grafik
        const formattedData = data.map((item: any) => ({
          ...item,
          latency: parseFloat(item.latency),
          score: parseInt(item.score) || 0
        }))
        setResults(formattedData)
      })
      .catch(err => console.error("Gagal load data:", err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">LLM Benchmarking Tool</h1>
          <p className="text-gray-500 mt-2">Analisis performa model bahasa berdasarkan latensi dan akurasi skor.</p>
        </header>

        {/* SECTION GRAFIK */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Visualisasi Latensi (Detik)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="id" 
                  label={{ value: 'Test Case ID', position: 'insideBottom', offset: -5 }} 
                  tick={{fontSize: 12}}
                />
                <YAxis 
                  label={{ value: 'Detik', angle: -90, position: 'insideLeft' }} 
                  tick={{fontSize: 12}}
                />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="latency" radius={[4, 4, 0, 0]}>
                  {results.map((entry: any, index) => (
                    <Cell key={`cell-${index}`} fill={entry.latency > 5 ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-4 italic">* Warna merah menunjukkan latensi di atas 5 detik.</p>
        </div>

        {/* SECTION CARDS */}
        <div className="grid gap-8">
          {results.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-blue-600 uppercase">Test Case #{item.id}</span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-mono">{item.model}</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Akurasi</span>
                    <span className="text-sm font-black text-green-600">{item.score}/100</span>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-300"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Latensi</span>
                    <span className="text-sm font-black text-blue-600">{item.latency}s</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Pertanyaan</h3>
                  <p className="text-lg text-gray-800 font-medium leading-relaxed">{item.question}</p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Jawaban AI</h3>
                  <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {item.ai_answer}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}