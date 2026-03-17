from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import time
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# status_api.py
WAHA_URL = "http://waha:3000/"
N8N_URL = "http://n8n:5678/healthz"



async def medir_servico(nome: str, url: str):
    start = time.perf_counter()
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url, timeout=3.0)
        elapsed = round((time.perf_counter() - start) * 1000)
        return nome, {"online": res.status_code == 200, "latency_ms": elapsed}
    except Exception:
        return nome, {"online": False, "latency_ms": None}

@app.get("/status-arquitetura")
async def status_arquitetura():
    # Executa WAHA e n8n em paralelo
    results = await asyncio.gather(
        medir_servico("waha", WAHA_URL),
        medir_servico("n8n", N8N_URL),
    )

    # Mede o próprio backend da IA (simplesmente interno, sem chamada HTTP)
    start = time.perf_counter()
    await asyncio.sleep(0.05)  # simula verificação local
    elapsed = round((time.perf_counter() - start) * 1000)
    results.append(("ia", {"online": True, "latency_ms": elapsed}))

    # Transforma lista em dicionário final
    return {name: data for name, data in results}
