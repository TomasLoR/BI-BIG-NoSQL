# Tvorba 15 netriviálních různých navazujících příkladů včetně řešení a podrobného vysvětlení jednotlivých příkazů.
# Každý dotaz musí vracet nějaká data.
# Každý dotaz musí vracet různá data. Nelze, aby stejná data vracelo více dotazů.
# Dle zvoleného typu databáze využijte i možnost práce s clusterem, replikačním faktorem a shardingem.
# Pokuste se například (mimo jiné) nasimulovat výpadek některého z uzlů a popište možnosti řešení.

# MongoDB dotazy

## 1. Najdi uživatele, kteří si objednali více než 3 různé produkty.

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$user_id", uniqueProducts: { $addToSet: "$items.product_id" } } },
  { $project: { _id: 1, productCount: { $size: "$uniqueProducts" } } },
  { $match: { productCount: { $gt: 3 } } }
]);
```

**Vysvětlení:** Tento dotaz nejprve rozdělí každou objednávku na jednotlivé položky pomocí `$unwind`, poté seskupí položky podle ID uživatele a vytvoří množinu unikátních ID produktů. Následně spočítá velikost této množiny a vyfiltruje jen ty uživatele, kteří mají více než 3 různé produkty.

## 2. Najdi produkty s největším počtem atributů.

```javascript
db.products.aggregate([
  { $project: { _id: 1, name: 1, attributeCount: { $size: { $objectToArray: "$attributes" } } } },
  { $sort: { attributeCount: -1 } },
  { $limit: 5 }
]);
```

**Vysvětlení:** Dotaz převádí objekt atributů každého produktu na pole pomocí `$objectToArray` a počítá jeho velikost. Výsledky řadí sestupně podle počtu atributů a vrací 5 produktů s největším počtem atributů.

## 3. Najdi objednávky obsahující produkty z více než 2 různých kategorií.

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $lookup: { from: "products", localField: "items.product_id", foreignField: "_id", as: "product" } },
  { $unwind: "$product" },
  { $group: { _id: "$_id", uniqueCategories: { $addToSet: "$product.category" } } },
  { $project: { _id: 1, categoryCount: { $size: "$uniqueCategories" } } },
  { $match: { categoryCount: { $gt: 2 } } }
]);
```

**Vysvětlení:** Tento dotaz rozdělí objednávky na jednotlivé položky, propojí je s kolekcí produktů pro získání informací o kategorii, vytvoří množinu unikátních kategorií pro každou objednávku a nakonec vybere pouze objednávky obsahující produkty z více než 2 různých kategorií.

## 4. Spočítej podíl uživatelů, kteří mají zapnuté newslettery.

```javascript
db.users.aggregate([
  { $group: { _id: null, totalUsers: { $sum: 1 }, newsletterUsers: { $sum: { $cond: ["$preferences.newsletter", 1, 0] } } } },
  { $project: { _id: 0, newsletterRatio: { $divide: ["$newsletterUsers", "$totalUsers"] } } }
]);
```

**Vysvětlení:** Dotaz počítá celkový počet uživatelů a počet uživatelů, kteří mají zapnutý newsletter. Pomocí podmínky `$cond` přičítá 1 za každého uživatele s aktivním newsletterem. Nakonec vypočte poměr mezi těmito dvěma hodnotami, což reprezentuje podíl uživatelů s aktivním newsletterem.

## 5. Vypiš 3 nejprodávanější značky v kategorii "Electronics".

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $lookup: { from: "products", localField: "items.product_id", foreignField: "_id", as: "product" } },
  { $unwind: "$product" },
  { $match: { "product.category": "Electronics" } },
  { $group: { _id: "$product.attributes.brand", totalSold: { $sum: "$items.quantity" } } },
  { $sort: { totalSold: -1 } },
  { $limit: 3 }
]);
```

**Vysvětlení:** Tento dotaz rozloží objednávky na jednotlivé položky, propojí je s produkty, filtruje pouze elektroniku, seskupí podle značky a počítá celkové prodané množství. Nakonec seřadí značky podle prodejnosti a vrátí 3 nejprodávanější.

## 6. Spočítej měsíční tržby za poslední rok.

```javascript
db.orders.aggregate([
  { $match: { order_date: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString() } } },
  { $group: { _id: { $substr: ["$order_date", 0, 7] }, monthlyRevenue: { $sum: "$total" } } },
  { $sort: { _id: 1 } }
]);
```

**Vysvětlení:** Dotaz nejprve filtruje objednávky z posledního roku, poté seskupuje podle měsíce (extrahuje první 7 znaků z data, což odpovídá formátu YYYY-MM) a pro každý měsíc počítá celkové tržby. Výsledky jsou seřazeny chronologicky.

## 7. Najdi nejlevnější produkty v kategorii "Electronics".

```javascript
db.products.createIndex({ category: 1, price: -1 });
db.products.find({ category: "Electronics" }, { _id: 1, name: 1, price: 1 }).sort({ price: 1 });
db.products.find({ category: "Electronics" }, { _id: 1, name: 1, price: 1 }).sort({ price: 1 }).explain("executionStats");
```

**Vysvětlení:** První příkaz vytváří index na kategorie a ceny pro optimalizaci vyhledávání. Druhý příkaz vyhledá elektronické produkty a seřadí je vzestupně podle ceny. Poslední příkaz poskytuje podrobné informace o provádění dotazu včetně využití indexů a časové náročnosti.

## 8. Zjisti průměrnou cenu produktů v kategorii "Clothing".

```javascript
db.products.aggregate([
  { $match: { category: "Clothing" } },
  { $group: { _id: null, avgPrice: { $avg: "$price" } } }
]);
```

**Vysvětlení:** Tento jednoduchý dotaz filtruje produkty z kategorie "Clothing" a používá agregační funkci `$avg` k výpočtu průměrné ceny všech oblečení v databázi.

## 9. Najdi celkovou hodnotu všech produktů v každé kategorii.

```javascript
db.products.aggregate([
  { $group: { _id: "$category", totalValue: { $sum: "$price" } } }
]);
```

**Vysvětlení:** Dotaz seskupuje produkty podle kategorie a pro každou kategorii počítá součet cen všech produktů, čímž se získá celková hodnota inventáře v jednotlivých kategoriích.

## 10. Najdi všechny uživatele, kteří mají zapnutý newsletter nebo mají věk mezi 20 a 30 lety.

```javascript
db.users.find({
  $or: [
    { "preferences.newsletter": true },
    { "age": { $gte: 20, $lte: 30 } }
  ]
}, {
  name: 1,
  age: 1,
  "preferences": 1
});
```

**Vysvětlení:** Tento dotaz používá operátor `$or` k vyhledání uživatelů, kteří splňují alespoň jednu ze dvou podmínek: buď mají aktivní newsletter, nebo jsou ve věkovém rozmezí 20-30 let. Z výsledků jsou vybrány pouze jméno, věk a preference.

## 11. Najdi všechny uživatele, kteří mají věk větší než 18 let a mají nastavenou preferenci pro temný režim.

```javascript
db.users.find({
  age: { $gt: 18 },
  "preferences.theme": "dark"
}, {
  name: 1,
  age: 1,
  "preferences.theme": 1
});
```

**Vysvětlení:** Dotaz kombinuje dvě podmínky pomocí implicitního operátoru AND - vyhledává uživatele starší 18 let, kteří zároveň preferují tmavý režim rozhraní. Vrací jejich jméno, věk a nastavení tématu.

## 12. Zjisti, jak jsou shadovány konkrétní kolekce v databazi eshop.

```javascript
db.getSiblingDB("config").collections.find({ _id: "eshop.users" });
db.getSiblingDB("config").collections.find({ _id: "eshop.products" });
db.getSiblingDB("config").collections.find({ _id: "eshop.orders" });
db.users.getShardDistribution();
db.products.getShardDistribution();
db.orders.getShardDistribution();
```

**Vysvětlení:** Tyto dotazy dotazují konfigurační databázi MongoDB pro získání informací o tom, jak jsou jednotlivé kolekce (users, products, orders) rozdělovány (shardovány) v clusteru. Zobrazí klíče použité k rozdělení dat a další konfigurační informace.

## 13. Vypni některý z primárních uzlů a pozoruj, jak se chová cluster.

```javascript
db.users.find().readPref("secondary");
db.users.find().readPref("primary");
sh.status(); // najdeme primarni shard, treba rs-shard-01
exit
```
```bash
docker compose exec shard01-a mongosh --host shard01-a:27017 -u "admin" -p "big2025" --authenticationDatabase admin
```
```javascript
rs.status(); // najdeme primarni uzel "stateStr" : "PRIMARY", napr shard01-a:27017
exit
```
```bash
sudo docker kill <container_id> #napr a384222cb373
docker compose exec shard01-b mongosh --host shard01-b:27017 -u "admin" -p "big2025" --authenticationDatabase admin
```javascript
rs.status(); // zjistime, ze se nastavil novy primarni uzel
exit
```
```bash
docker compose exec router01 mongosh --port 27017 -u "admin" -p "big2025" --authenticationDatabase admin
```
```javascript
use eshop;
sh.status();
db.users.find().readPref("secondary");
db.users.find().readPref("primary"); // stale funkcni
```

**Vysvětlení:** První příkaz simuluje výpadek uzlu vypnutím jeho Docker kontejneru. Následující dotazy zjišťují stav clusteru a testují, zda lze číst data ze sekundárních uzlů a zda proběhla automatická volba nového primárního uzlu. Demonstruje se tím odolnost MongoDB clusteru vůči výpadkům.

## 14. Najdi 5 nejlevnějších produktů, zvýš jejich cenu o 10 a pak zkontroluj, že navýšení ceny proběhlo v pořádku.

```javascript
db.products.find({}, { _id: 1, name: 1, price: 1 }).sort({ price: 1 }).limit(5);

let cheapestProductIds = db.products.find({}, { _id: 1 }).sort({ price: 1 }).limit(5).toArray().map(product => product._id);
db.products.updateMany(
  { _id: { $in: cheapestProductIds } },
  { $inc: { price: 10 } }
);

db.products.find({}, { _id: 1, name: 1, price: 1 }).sort({ price: 1 }).limit(5);
```

**Vysvětlení:** První dotaz najde 5 nejlevnějších produktů. Druhý dotaz vytvoří pole ID těchto produktů a použije ho k navýšení jejich ceny o 10 pomocí operátoru `$inc`. Třetí dotaz znovu zobrazí 5 nejlevnějších produktů pro ověření, že navýšení ceny proběhlo úspěšně.

## 15. Najdi produkt s nejmenším počtem objednávek a zjisti kolik to je.

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.product_id", orderCount: { $sum: 1 } } },
  { $sort: { orderCount: 1 } },
  { $limit: 1 },
  { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
  { $unwind: "$product" },
  { $project: { _id: 0, productId: "$_id", productName: "$product.name", orderCount: 1 } }
]);
```

**Vysvětlení:** Tento dotaz nejprve rozloží objednávky na jednotlivé položky, poté seskupí podle ID produktu a spočítá počet objednávek pro každý produkt. Výsledky seřadí vzestupně podle počtu objednávek a vybere produkt s nejmenším počtem. Následně získá informace o tomto produktu z kolekce produktů a zobrazí jeho ID, název a počet objednávek.
