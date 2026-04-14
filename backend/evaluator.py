import os
import json
import time
from google import genai
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Klien API
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

G_MODEL = "gemini-3-flash-preview"
L_MODEL = "llama-3.1-8b-instant"

def get_gemini(prompt):
    start = time.time()
    res = gemini_client.models.generate_content(model=G_MODEL, contents=prompt)
    return res.text, time.time() - start

def get_llama(prompt):
    start = time.time()
    res = groq_client.chat.completions.create(
        model=L_MODEL,
        messages=[{"role": "user", "content": prompt}]
    )
    return res.choices[0].message.content, time.time() - start

def get_score(q, ref, ans):
    prompt = f"Bandingkan jawaban AI dengan referensi. Berikan skor 1-100. Hanya angka skor saja.\nPertanyaan: {q}\nReferensi: {ref}\nJawaban AI: {ans}"
    res = gemini_client.models.generate_content(model=G_MODEL, contents=prompt)
    return res.text.strip()

def run_benchmark():
    with open('dataset.json', 'r') as f:
        tasks = json.load(f)
    
    final_results = []
    for t in tasks:
        print(f"Menguji ID {t['id']}...")
        
        g_ans, g_lat = get_gemini(t['question'])
        l_ans, l_lat = get_llama(t['question'])
        
        g_score = get_score(t['question'], t['expected_answer'], g_ans)
        l_score = get_score(t['question'], t['expected_answer'], l_ans)
        
        final_results.append({
            "id": t['id'],
            "question": t['question'],
            "gemini": {"answer": g_ans, "latency": round(g_lat, 2), "score": g_score},
            "llama": {"answer": l_ans, "latency": round(l_lat, 2), "score": l_score}
        })
        
    with open('results.json', 'w') as f:
        json.dump(final_results, f, indent=4)
    print("Selesai. Hasil disimpan di results.json")

if __name__ == "__main__":
    run_benchmark()