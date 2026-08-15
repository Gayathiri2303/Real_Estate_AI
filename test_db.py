import sys
import os

# Add the backend folder to path so we can import from it
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.database import create_tables, SessionLocal, User, Prediction

def test_database():
    print("🔍 Testing Database Connection...")
    print("=" * 50)
    
    # Create tables
    create_tables()
    
    # Create session
    db = SessionLocal()
    
    try:
        # Test 1: Add a user
        print("\n📝 Adding a test user...")
        new_user = User(
            name="Test User",
            email="test@example.com",
            password="test123"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"✅ User added with ID: {new_user.id}")
        
        # Test 2: Query users
        print("\n📝 Querying users...")
        users = db.query(User).all()
        for user in users:
            print(f"   - {user.id}: {user.name} ({user.email})")
        
        # Test 3: Add a prediction
        print("\n📝 Adding a test prediction...")
        prediction = Prediction(
            user_id=new_user.id,
            bedrooms=3,
            bathrooms=2,
            sqft_living=1500,
            floors=1,
            view=0,
            condition=3,
            grade=7,
            sqft_above=1500,
            sqft_basement=0,
            predicted_price=326900,
            confidence_score=85.0
        )
        db.add(prediction)
        db.commit()
        print(f"✅ Prediction added with ID: {prediction.id}")
        
        # Test 4: Show all predictions with user info
        print("\n📝 All predictions with user info:")
        predictions = db.query(Prediction).all()
        for pred in predictions:
            user = db.query(User).filter(User.id == pred.user_id).first()
            print(f"   - User: {user.name if user else 'Unknown'}, Price: ${pred.predicted_price:,.2f}, "
                  f"Beds: {pred.bedrooms}, Baths: {pred.bathrooms}")
        
        print("\n" + "=" * 50)
        print("🎉 All tests passed! Database is working perfectly!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_database()