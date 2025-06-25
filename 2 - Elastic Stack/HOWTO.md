## Základní konfigurace a spuštění

1. **Spuštění Elastic Stack kontejnerů**:
   ```bash
   docker-compose up -d
   ```
   
   Tím se spustí následující kontejnery:
   - Elasticsearch (dostupný na portu 9200)
   - Kibana (dostupná na portu 5601)
   - Logstash (pro zpracování dat)

2. **Nastavení indexů (lze přeskočit)**:
   Připojte se k webovému rozhraní Kibany (http://localhost:5601/), přejděte do sekce Stack Management -> Index Patterns a vytvořte nové index patterny: `*land*`,  `pesticide*`, `sellling*`
   Jako timefield zvolte `@timestamp`
   

3. **Import dashboardu**:
   Přejděte do sekce Stack Management -> Saved Objects a importujte soubor `results/dashboard.ndjson`.


## Import dat pomocí Logstash

Data jsou importována automaticky z CSV souborů pomocí Logstash konfigurací v adresáři `/logstash/pipeline/`. Každý datový soubor má svůj vlastní konfigurační soubor:

- agricultural_land_prices.conf
- agricultural_land_renting_prices.conf
- pesticide_sales.conf
- pesticide_use_in_agriculture.conf
- selling_prices_of_animal_products.conf
- selling_prices_of_crop_products.conf

## Ukončení práce s prostředím

Pro ukončení a zastavení všech kontejnerů:
```bash
docker-compose down
```

Pro úplné odstranění všech dat a kontejnerů:
```bash
docker-compose down -v
```