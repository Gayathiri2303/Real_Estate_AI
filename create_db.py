import psycopg2

def create_database():
    try:
        # Connect to default database
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="postgres",
            user="postgres",
            password="g50023032#"  # ← YOUR PASSWORD
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname='real_estate_db'")
        exists = cursor.fetchone()
        
        if exists:
            print("✅ Database 'real_estate_db' already exists")
        else:
            cursor.execute("CREATE DATABASE real_estate_db")
            print("✅ Database 'real_estate_db' created successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_database()