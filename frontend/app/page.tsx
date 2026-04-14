"use client"
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [results, setResults] = useState([])

  useEffect(() => {
    fetch("/results.json")
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch(err => console.error("Gagal load data:", err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">LLM Benchmarking Tool</h1>
          <p className="text-gray-500 mt-2">Menganalisis performa dan akurasi model bahasa secara real-time.</p>
        </header>

        <div className="grid gap-8">
          {results.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Test Case #{item.id}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">Latensi:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    {item.latency}s
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Pertanyaan</h3>
                  <p className="text-lg text-gray-800 font-medium leading-relaxed">{item.question}</p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Jawaban AI (Gemini 3 Flash)</h3>
                  <div className="prose max-w-none text-gray-800">
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