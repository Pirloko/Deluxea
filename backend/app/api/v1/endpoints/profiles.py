from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from app.models.user import Profile, ProfileCreate, ProfileUpdate
from app.core.supabase import supabase

router = APIRouter()

@router.get("/", response_model=List[Profile])
async def get_profiles(category: Optional[str] = None):
    """Obtener todos los perfiles, opcionalmente filtrados por categoría"""
    try:
        query = supabase.table("profiles").select("*")
        
        if category and category != "all":
            query = query.eq("category", category)
        
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{user_id}", response_model=Profile)
async def get_profile(user_id: str):
    """Obtener un perfil por user_id"""
    try:
        response = supabase.table("profiles").select("*").eq("user_id", user_id).single().execute()
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Perfil no encontrado"
            )
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=Profile, status_code=status.HTTP_201_CREATED)
async def create_profile(profile: ProfileCreate):
    """Crear un nuevo perfil"""
    try:
        response = supabase.table("profiles").insert(profile.model_dump()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.patch("/{user_id}", response_model=Profile)
async def update_profile(user_id: str, profile: ProfileUpdate):
    """Actualizar un perfil"""
    try:
        update_data = profile.model_dump(exclude_unset=True)
        response = supabase.table("profiles").update(update_data).eq("user_id", user_id).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Perfil no encontrado"
            )
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

