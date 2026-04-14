import os
import json
import time
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Inisialisasi library baru
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_ID = "gemini-3-flash-preview"

def get_response(prompt):
    start = time.time()
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt
    )
    end = time.time()
    return response.text, end - start

def get_score(question, expected, ai_answer):
    prompt = f"Bandingkan jawaban AI dengan jawaban referensi. Berikan skor 1 sampai 100. Hanya berikan angka saja.\n\nPertanyaan: {question}\nReferensi: {expected}\nJawaban AI: {ai_answer}"
    
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt
    )
    return response.text.strip()

def start_test():
    if not os.path.exists('dataset.json'):
        print("Error: File dataset.json tidak ditemukan.")
        return

    with open('dataset.json', 'r') as f:
        tasks = json.load(f)
    
    final_results = []

    print(f"Memulai benchmarking dengan model {MODEL_ID}...")
    
    for task in tasks:
        print(f"Menguji ID {task['id']}...")
        
        ai_answer, latency = get_response(task['question'])
        score = get_score(task['question'], task['expected_answer'], ai_answer)
        
        final_results.append({
            "id": task['id'],
            "model": MODEL_ID,
            "question": task['question'],
            "ai_answer": ai_answer,
            "score": score,
            "latency": round(latency, 2)
        })

    with open('results.json', 'w') as f:
        json.dump(final_results, f, indent=4)
    
    print("Selesai. Hasil disimpan di results.json")

if __name__ == "__main__":
    start_test()