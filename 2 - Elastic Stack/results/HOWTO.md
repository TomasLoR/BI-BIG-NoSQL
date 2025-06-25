## Vizualizace 1: Průměrné a mediánové ceny půdy

**Data:** agricultural_land_prices.csv

**Index pattern:** "\*land\*"

**Co zobrazuje:** Porovnání průměrných a mediánových cen zemědělské půdy v EU v letech 2011-2020.

**Použité filtry:** Omezení pouze na index agricultural_land_prices.

**Význam hodnot:**
- Osa X: Časové období (roky 2016-2020)
- Osa Y: Ceny půdy v EUR za hektar
- Modrá křivka: Průměrná cena půdy v EU
- Oranžová křivka: Mediánová cena půdy v EU

**Interpretace:** Viz README.md, sekce "Vizualizace 1: Průměrné a mediánové ceny půdy"

## Vizualizace 2: Ceny zemědělských plodin a živočišných produktů

**Data:** selling_prices_of_crop_products.csv, selling_prices_of_animal_products.csv

**Index pattern:** "selling*"

**Co zobrazuje:** Vývoj cen zemědělských plodin a živočišných produktů v průběhu let 2016-2020.

**Použité filtry:** Vyloučena položka "Fresh eggs (whole country) - prices per 100 items", která by zkreslovala porovnání (měří se v jiných jednotkách).

**Význam hodnot:**
- Osa X: Časové období (roky 2016-2020)
- Osa Y: Ceny produktů v EUR za 100kg
- Horní oblast: Ceny živočišných produktů
- Spodní oblast: Ceny rostlinných produktů

**Interpretace:** Viz README.md, sekce "Vizualizace 2: Ceny zemědělských plodin a živočišných produktů"

## Vizualizace 3: Nejvyšší průměrné ceny nájmu půdy

**Data:** agricultural_land_renting_prices.csv

**Index pattern:** "\*land\*"

**Co zobrazuje:** Deset regionů s nejvyššími průměrnými cenami nájmu zemědělské půdy v letech 2016-2020.

**Použité filtry:** 
- Omezení pouze na index agricultural_land_renting_prices
- Seřazeno sestupně podle průměrné ceny nájmu
- Omezeno na 10 nejvyšších hodnot

**Význam hodnot:**
- Osa Y: Regiony/země
- Osa X: Roky (2016-2020)
- Barevná intenzita: Výše nájemného v EUR za hektar (tmavší barva = vyšší nájemné)

**Interpretace:** Viz README.md, sekce "Vizualizace 3: Nejvyšší průměrné ceny nájmu půdy"

## Vizualizace 4: Derivace cen půdy a nájmů

**Data:** agricultural_land_prices.csv, agricultural_land_renting_prices.csv

**Index pattern:** "\*land\*"

**Co zobrazuje:** Rychlost změny (derivace) cen zemědělské půdy a nájmů v letech 2016-2020.

**Použité filtry:** Použití funkce derivace na průměrnou hodnotu OBS_VALUE.

**Význam hodnot:**
- Osa X: Časové období (roky 2016-2020)
- Osa Y: Rychlost změny ceny (EUR/ha/rok)
- Modrá křivka: Rychlost změny cen půdy
- Fialová křivka: Rychlost změny nájemného

**Interpretace:** Viz README.md, sekce "Vizualizace 4: Derivace cen půdy a nájmů"

## Vizualizace 5: Největší uživatelé pesticidů

**Data:** pesticide_use_in_agriculture.csv

**Index pattern:** "pesticide*"

**Co zobrazuje:** Deset zemí, které za období 2016-2020 použily největší množství pesticidů v zemědělství.

**Použité filtry:** 
- Omezení pouze na index pesticide_use_in_agriculture
- Seřazeno sestupně podle sumy OBS_VALUE
- Omezeno na 10 největších hodnot

**Význam hodnot:**
- Velikost textu: Relativní množství použitých pesticidů - čím větší text názvu země, tím větší spotřeba


**Interpretace:** Viz README.md, sekce "Vizualizace 5: Největší uživatelé pesticidů"

## Vizualizace 6: Minimální a maximální ceny půdy

**Data:** agricultural_land_prices.csv

**Index pattern:** "\*land\*"

**Co zobrazuje:** Rozsah cen zemědělské půdy v letech 2016-2020, prezentující minimální a maximální ceny.

**Použité filtry:** 
- Omezení pouze na index agricultural_land_prices

**Význam hodnot:**
- Osa Y: Časové období (roky)
- Osa X: Cena půdy v EUR za hektar
- Béžový sloupec: Maximální cena
- Žlutý sloupec: Minimální cena

**Interpretace:** Viz README.md, sekce "Vizualizace 6: Minimální a maximální ceny půdy"

## Vizualizace 7: Nejprodávanější pesticidy

**Data:** pesticide_sales.csv

**Index pattern:** "pesticide*"

**Co zobrazuje:** Rozložení prodeje různých typů pesticidů podle celkového množství prodaných kilogramů.

**Použité filtry:** 
- Omezení pouze na index pesticide_sales
- Vyloučena kategorie "Total", aby nedocházelo ke zdvojení hodnot
- Omezeno na 6 nejvýznamnějších kategorií

**Význam hodnot:**
- Výseče koláčového grafu: Jednotlivé kategorie pesticidů
- Velikost výseče: Proporcionální k množství prodaných pesticidů dané kategorie
- Barvy: Rozlišují jednotlivé kategorie pesticidů

**Interpretace:** Viz README.md, sekce "Vizualizace 7: Nejprodávanější pesticidy"

## Vizualizace 8: Rozdíl mezi prodejem a využitím pesticidů

**Data:** pesticide_sales.csv, pesticide_use_in_agriculture.csv

**Index pattern:** Přímo v Timelion vyjádření: "pesticide_sales*" a "pesticide_use*"

**Co zobrazuje:** Porovnání celkového prodeje pesticidů s jejich skutečným využitím a rozdíl mezi těmito hodnotami.

**Použité filtry:** 
- Pro prodejní data je vyloučena kategorie "Total" (NOT pesticid:Total), aby nedocházelo ke zdvojení hodnot
- Použitá funkce subtract pro výpočet rozdílu mezi prodejem a spotřebou

**Význam hodnot:**
- Osa X: Časové období
- Osa Y: Množství pesticidů v kilogramech
- Modrá křivka: Celkový prodej pesticidů
- Červená křivka: Celkové využití pesticidů
- Žlutá křivka: Rozdíl mezi prodejem a využitím

**Interpretace:** Viz README.md, sekce "Vizualizace 8: Rozdíl mezi prodejem a využitím pesticidů"