from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # For Vercel we cannot save files permanently on disk
    # So we just return a success response for now
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    file_id = str(uuid.uuid4())
    
    return {
        "success": True,
        "message": "File received successfully (demo mode)",
        "filename": file.filename,
        "file_id": file_id,
        "content_type": file.content_type
    }

@router.get("/upload/test")
def upload_test():
    return {
        "status": "ready",
        "message": "Upload endpoint is working"
    }
