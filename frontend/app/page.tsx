"use client"
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function Home() {
  const [results, setResults] = useState<any[]>([])
  const [activeId, setActiveId] = useState(0)

  useEffect(() => {
    fetch("/results.json")
      .then((res) => res.json())
      .then((data) => {
        setResults(data)
        if (data.length > 0) setActiveId(0)
      })
  }, [])

  if (results.length === 0) return <div className="p-10 text-center font-bold">Memuat data API</div>

  const activeData = results[activeId]

  const chartData = results.map((item: any) => ({
    name: `Test ${item.id}`,
    Gemini: parseFloat(item.gemini?.latency) || 0,
    Llama: parseFloat(item.llama?.latency) || 0
  }))

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      
      <header className="bg-white border-b border-gray-200 p-4 shrink-0 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-gray-800">LLM Split View Benchmark</h1>
        <div className="flex gap-2 overflow-x-auto">
          {results.map((item: any, index: number) => (
            <button
              key={item.id}
              onClick={() => setActiveId(index)}
              className={`px-4 py-2 rounded font-bold text-sm whitespace-nowrap transition-colors ${
                activeId === index 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Test Case {item.id}
            </button>
          ))}
        </div>
      </header>

      <div className="h-48 bg-white p-4 shrink-0 border-b border-gray-200">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
            <Legend wrapperStyle={{fontSize: '12px', fontWeight: 'bold'}} />
            <Bar dataKey="Gemini" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Llama" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900 text-white p-4 shrink-0 border-b-4 border-blue-500">
        <p className="text-xs text-gray-400 font-bold uppercase mb-1 tracking-widest">Pertanyaan Evaluasi</p>
        <p className="text-base font-medium leading-relaxed">{String(activeData.question)}</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white">
          <div className="p-3 bg-blue-50 border-b border-blue-100 shrink-0 flex justify-between items-center">
            <span className="font-bold text-blue-800">Gemini Flash</span>
            <div className="flex gap-2">
              <span className="text-xs font-bold px-2 py-1 bg-white rounded shadow-sm text-blue-600">
                Latensi {String(activeData.gemini?.latency)} detik
              </span>
              <span className="text-xs font-bold px-2 py-1 bg-blue-600 rounded shadow-sm text-white">
                Skor {String(activeData.gemini?.score)}
              </span>
            </div>
          </div>
          <div className="p-5 overflow-y-auto flex-1 prose prose-sm max-w-none text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{String(activeData.gemini?.answer)}</ReactMarkdown>
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-white">
          <div className="p-3 bg-purple-50 border-b border-purple-100 shrink-0 flex justify-between items-center">
            <span className="font-bold text-purple-800">Llama 3.1</span>
            <div className="flex gap-2">
              <span className="text-xs font-bold px-2 py-1 bg-white rounded shadow-sm text-purple-600">
                Latensi {String(activeData.llama?.latency)} detik
              </span>
              <span className="text-xs font-bold px-2 py-1 bg-purple-600 rounded shadow-sm text-white">
                Skor {String(activeData.llama?.score)}
              </span>
            </div>
          </div>
          <div className="p-5 overflow-y-auto flex-1 prose prose-sm max-w-none text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{String(activeData.llama?.answer)}</ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  )
}