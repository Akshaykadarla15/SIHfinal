from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import LoginRequest, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=UserResponse)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email).first()
    if not user or user.password != creds.password:
        raise HTTPException(status_code=401, detail="Invalid email or password. Please use one of the demo credentials.")
    return UserResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        name=user.name,
        badge=user.badge
    )

@router.get("/demo-users")
def get_demo_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "role": u.role,
            "name": u.name,
            "badge": u.badge
        }
        for u in users
    ]
