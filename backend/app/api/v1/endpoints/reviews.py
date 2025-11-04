from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime, timedelta
from app.models.review import Review, ReviewCreate, ReviewUpdate
from app.core.supabase import supabase

router = APIRouter()

@router.get("/profile/{profile_id}", response_model=List[Review])
async def get_profile_reviews(profile_id: str):
    """Obtener todas las reseñas de un perfil"""
    try:
        response = supabase.table("reviews").select("*").eq("profile_id", profile_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=Review, status_code=status.HTTP_201_CREATED)
async def create_review(review: ReviewCreate):
    """Crear una nueva reseña (máximo 1 por perfil cada 24h)"""
    try:
        # Verificar si el usuario ya dejó una reseña en las últimas 24h
        twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
        existing_review = supabase.table("reviews").select("*")\
            .eq("profile_id", review.profile_id)\
            .eq("reviewer_id", review.reviewer_id)\
            .gte("created_at", twenty_four_hours_ago.isoformat())\
            .execute()
        
        if existing_review.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Solo puedes dejar una reseña cada 24 horas por perfil"
            )
        
        # Validar rating
        if review.rating < 1 or review.rating > 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La calificación debe estar entre 1 y 5"
            )
        
        response = supabase.table("reviews").insert(review.model_dump()).execute()
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.patch("/{review_id}", response_model=Review)
async def update_review(review_id: str, review: ReviewUpdate):
    """Actualizar una reseña"""
    try:
        update_data = review.model_dump(exclude_unset=True)
        if "rating" in update_data and (update_data["rating"] < 1 or update_data["rating"] > 5):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La calificación debe estar entre 1 y 5"
            )
        
        response = supabase.table("reviews").update(update_data).eq("id", review_id).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reseña no encontrada"
            )
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(review_id: str):
    """Eliminar una reseña"""
    try:
        supabase.table("reviews").delete().eq("id", review_id).execute()
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

