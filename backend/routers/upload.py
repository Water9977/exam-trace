from fastapi import APIRouter, UploadFile, File, HTTPException, Query
import shutil
import os
import uuid
from datetime import datetime
from services.gemini_service import analyze_document

router = APIRouter()

UPLOAD_DIR = "temp_uploads"

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    paper_count: int = Query(default=3, description="Number of past papers uploaded")
):
    # Validate PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Generate Unique Filename
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    filename = f"{timestamp}_{unique_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save File
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Analyze with Gemini, passing paper count
    try:
        analysis_result = analyze_document(file_path, paper_count)
    except Exception as e:
        analysis_result = f"Analysis failed: {str(e)}"

    return {
        "filename": filename,
        "status": "uploaded",
        "file_id": unique_id,
        "original_name": file.filename,
        "analysis": analysis_result
    }
