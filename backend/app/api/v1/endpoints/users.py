from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.user import User, UserCreate, UserUpdate
from app.core.supabase import supabase

router = APIRouter()

@router.get("/", response_model=List[User])
async def get_users():
    """Obtener todos los usuarios (solo admin)"""
    try:
        response = supabase.table("users").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Obtener un usuario por ID"""
    try:
        response = supabase.table("users").select("*").eq("id", user_id).single().execute()
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    """Crear un nuevo usuario (solo admin)"""
    try:
        # Crear usuario en Supabase Auth
        auth_response = supabase.auth.admin.create_user({
            "email": user.email,
            "password": user.password,
            "email_confirm": True
        })
        
        # Crear registro en tabla users
        user_data = {
            "id": auth_response.user.id,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "must_change_password": user.must_change_password
        }
        
        response = supabase.table("users").insert(user_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.patch("/{user_id}", response_model=User)
async def update_user(user_id: str, user: UserUpdate):
    """Actualizar un usuario (solo admin)"""
    try:
        update_data = user.model_dump(exclude_unset=True)
        response = supabase.table("users").update(update_data).eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str):
    """Eliminar un usuario (solo admin)"""
    try:
        # Eliminar usuario de Supabase Auth
        supabase.auth.admin.delete_user(user_id)
        
        # Eliminar de tabla users
        supabase.table("users").delete().eq("id", user_id).execute()
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

