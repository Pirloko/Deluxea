from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime, timedelta
from app.models.membership import Membership, MembershipCreate
from app.core.supabase import supabase

router = APIRouter()

@router.get("/{user_id}", response_model=Membership)
async def get_user_membership(user_id: str):
    """Obtener la membresía activa de un usuario"""
    try:
        response = supabase.table("memberships").select("*").eq("user_id", user_id).eq("is_active", True).single().execute()
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No hay membresía activa"
            )
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=Membership, status_code=status.HTTP_201_CREATED)
async def create_membership(membership: MembershipCreate):
    """Crear una nueva membresía (solo admin)"""
    try:
        # Calcular fechas de inicio y fin
        start_date = datetime.utcnow()
        if membership.type == "weekly":
            end_date = start_date + timedelta(weeks=1)
        else:  # monthly
            end_date = start_date + timedelta(days=30)
        
        membership_data = {
            "user_id": membership.user_id,
            "type": membership.type,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "is_active": True
        }
        
        # Desactivar membresías anteriores del usuario
        supabase.table("memberships").update({"is_active": False}).eq("user_id", membership.user_id).execute()
        
        # Crear nueva membresía
        response = supabase.table("memberships").insert(membership_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=List[Membership])
async def get_all_memberships():
    """Obtener todas las membresías (solo admin)"""
    try:
        response = supabase.table("memberships").select("*").eq("is_active", True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

