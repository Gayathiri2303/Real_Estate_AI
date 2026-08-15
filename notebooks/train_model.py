import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import json
import os

print("=" * 60)
print("🏠 Training House Price Prediction Model")
print("=" * 60)

# Create directories if they don't exist
os.makedirs('trained_models', exist_ok=True)

# 1. Load the data
print("\n📊 Loading data...")
df = pd.read_csv('datasets/housing_data.csv')
print(f"✅ Loaded {len(df)} houses")

# 2. Feature engineering
print("\n🔧 Feature engineering...")
df['house_age'] = 2024 - df['yr_built']
df['has_basement'] = (df['sqft_basement'] > 0).astype(int)
df['total_rooms'] = df['bedrooms'] + df['bathrooms']
df['price_per_sqft'] = df['price'] / df['sqft_living']

# 3. Select features
feature_columns = ['bedrooms', 'bathrooms', 'sqft_living', 'floors', 
                   'view', 'condition', 'grade', 'sqft_above', 
                   'sqft_basement', 'house_age', 'has_basement',
                   'total_rooms', 'price_per_sqft']

X = df[feature_columns]
y = df['price']

print(f"✅ Using {len(feature_columns)} features")

# 4. Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"✅ Training: {len(X_train)} houses, Testing: {len(X_test)} houses")

# 5. Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 6. Train model
print("\n🤖 Training Random Forest model...")
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train_scaled, y_train)
print("✅ Model trained!")

# 7. Evaluate
y_pred = model.predict(X_test_scaled)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"\n📊 Model Performance:")
print(f"   Mean Absolute Error: ${mae:,.2f}")
print(f"   R² Score: {r2:.4f}")

# 8. Save everything
print("\n💾 Saving model and files...")

# Save model
joblib.dump(model, 'trained_models/best_model.pkl')
print("✅ Model saved to: trained_models/best_model.pkl")

# Save scaler
joblib.dump(scaler, 'trained_models/scaler.pkl')
print("✅ Scaler saved to: trained_models/scaler.pkl")

# Save feature columns
with open('trained_models/feature_columns.json', 'w') as f:
    json.dump(feature_columns, f)
print("✅ Features saved to: trained_models/feature_columns.json")

print("\n" + "=" * 60)
print("🎉 Model training complete!")
print("=" * 60)

# 9. Test with a sample
print("\n🧪 Testing with a sample house...")
sample = [[3, 2, 1500, 1, 0, 3, 7, 1500, 0, 20, 0, 5, 200]]
sample_scaled = scaler.transform(sample)
prediction = model.predict(sample_scaled)[0]
print(f"🏠 3 bed, 2 bath, 1500 sqft house")
print(f"💰 Predicted Price: ${prediction:,.2f}")