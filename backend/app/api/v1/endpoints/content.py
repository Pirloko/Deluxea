from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime, timedelta
from app.models.content import Story, StoryCreate, Reel, ReelCreate, Photo, PhotoCreate
from app.core.supabase import supabase

router = APIRouter()

# STORIES
@router.get("/stories", response_model=List[Story])
async def get_stories():
    """Obtener todas las historias activas (últimas 24h)"""
    try:
        twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
        response = supabase.table("stories").select("*").gte("created_at", twenty_four_hours_ago.isoformat()).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/stories", response_model=Story, status_code=status.HTTP_201_CREATED)
async def create_story(story: StoryCreate):
    """Crear una nueva historia"""
    try:
        story_data = story.model_dump()
        story_data["expires_at"] = (datetime.utcnow() + timedelta(hours=24)).isoformat()
        
        response = supabase.table("stories").insert(story_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# REELS
@router.get("/reels", response_model=List[Reel])
async def get_reels():
    """Obtener todos los reels"""
    try:
        response = supabase.table("reels").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/reels", response_model=Reel, status_code=status.HTTP_201_CREATED)
async def create_reel(reel: ReelCreate):
    """Crear un nuevo reel"""
    try:
        response = supabase.table("reels").insert(reel.model_dump()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# PHOTOS
@router.get("/photos/{user_id}", response_model=List[Photo])
async def get_user_photos(user_id: str):
    """Obtener fotos de un usuario"""
    try:
        response = supabase.table("photos").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/photos", response_model=Photo, status_code=status.HTTP_201_CREATED)
async def create_photo(photo: PhotoCreate):
    """Subir una nueva foto"""
    try:
        response = supabase.table("photos").insert(photo.model_dump()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

