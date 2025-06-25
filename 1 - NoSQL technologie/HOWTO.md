# Návod ke zprovoznění 1. části semestrální práce

Spusťte cluster
```bash
docker compose up -d
```

Spusťe script na inicializaci config serverů a shardů, routeru a nastavení autentifikace
```bash
bash setup.sh
```

Připojte se k databázi přes CLI:
```bash
docker compose exec router01 mongosh --port 27017 -u "admin" -p "big2025" --authenticationDatabase admin
use eshop;
```

Nebo se připojte skrze UI na adrese: http://127.0.0.1:8081/
- username: admin
- password: big2025

---

Nová data můžete vygenerovat pomocí generate scriptu [generator.py](data/generator.py)

```bash
python3 data/generator.py
```