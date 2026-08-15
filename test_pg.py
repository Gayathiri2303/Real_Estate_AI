import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        port="5432",
        database="postgres",
        user="postgres",
        password="g50023032#"  # ← YOUR PASSWORD
    )
    print("✅ Connected to PostgreSQL successfully!")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")