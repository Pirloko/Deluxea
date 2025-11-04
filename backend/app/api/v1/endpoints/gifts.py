from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.gift import Gift, GiftCreate, GiftUpdate, GiftTransaction, GiftTransactionCreate
from app.core.supabase import supabase

router = APIRouter()

@router.get("/", response_model=List[Gift])
async def get_gifts():
    """Obtener todos los regalos disponibles"""
    try:
        response = supabase.table("gifts").select("*").eq("is_active", True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=Gift, status_code=status.HTTP_201_CREATED)
async def create_gift(gift: GiftCreate):
    """Crear un nuevo regalo (solo admin)"""
    try:
        response = supabase.table("gifts").insert(gift.model_dump()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.patch("/{gift_id}", response_model=Gift)
async def update_gift(gift_id: str, gift: GiftUpdate):
    """Actualizar un regalo (solo admin)"""
    try:
        update_data = gift.model_dump(exclude_unset=True)
        response = supabase.table("gifts").update(update_data).eq("id", gift_id).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Regalo no encontrado"
            )
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/send", response_model=GiftTransaction, status_code=status.HTTP_201_CREATED)
async def send_gift(transaction: GiftTransactionCreate):
    """Enviar un regalo a un usuario"""
    try:
        # Obtener el regalo para calcular el valor total
        gift_response = supabase.table("gifts").select("*").eq("id", transaction.gift_id).single().execute()
        if not gift_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Regalo no encontrado"
            )
        
        gift = gift_response.data
        total_value = gift["value"] * transaction.quantity
        
        # TODO: Verificar que el usuario tenga suficientes créditos
        # TODO: Descontar créditos del usuario
        
        # Crear la transacción
        transaction_data = transaction.model_dump()
        transaction_data["total_value"] = total_value
        
        response = supabase.table("gift_transactions").insert(transaction_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/received/{user_id}", response_model=List[GiftTransaction])
async def get_received_gifts(user_id: str):
    """Obtener los regalos recibidos por un usuario"""
    try:
        response = supabase.table("gift_transactions").select("*").eq("to_user_id", user_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

