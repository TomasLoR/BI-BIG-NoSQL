import pandas as pd
import os

filenames = [
    "selling_prices_of_crop_products.csv",
    "selling_prices_of_animal_products.csv",
    "agricultural_land_renting_prices.csv",
    "agricultural_land_prices.csv",
    "pesticide_sales.csv",
    "pesticide_use_in_agriculture.csv"
]

for filename in filenames:
    df = pd.read_csv(filename)
    
    # Remove rows with any missing values
    df_cleaned = df.dropna()
    
    df_cleaned.to_csv(filename, index=False)
