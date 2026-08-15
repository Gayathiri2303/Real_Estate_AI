from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# Database connection - UPDATE PASSWORD HERE
DATABASE_URL = "postgresql://postgres:g50023032#@localhost:5432/real_estate_db"

# Create engine
engine = create_engine(DATABASE_URL)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class
Base = declarative_base()

# ==================== Models ====================

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Input features
    bedrooms = Column(Float)
    bathrooms = Column(Float)
    sqft_living = Column(Float)
    floors = Column(Float)
    view = Column(Float)
    condition = Column(Float)
    grade = Column(Float)
    sqft_above = Column(Float)
    sqft_basement = Column(Float)
    
    # Results
    predicted_price = Column(Float)
    confidence_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="predictions")

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

# Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    create_tables()