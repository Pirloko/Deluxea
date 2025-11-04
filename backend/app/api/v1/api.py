from fastapi import APIRouter
from app.api.v1.endpoints import users, profiles, gifts, memberships, content, reviews

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(gifts.router, prefix="/gifts", tags=["gifts"])
api_router.include_router(memberships.router, prefix="/memberships", tags=["memberships"])
api_router.include_router(content.router, prefix="/content", tags=["content"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])

