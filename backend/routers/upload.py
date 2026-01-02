from fastapi import APIRouter, UploadFile, File, HTTPException, Query
import shutil
import os
import uuid
from datetime import datetime
from services.gemini_service import analyze_document

import tempfile

router = APIRouter()

# Use system temp directory
UPLOAD_DIR = tempfile.gettempdir()

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
    # Sanitize filename
    safe_filename = "".join([c for c in file.filename if c.isalpha() or c.isdigit() or c in (' ', '.', '_')]).strip()
    filename = f"{timestamp}_{unique_id}_{safe_filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        # Save File
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

        # Analyze with Gemini
        try:
            analysis_result = analyze_document(file_path, paper_count)
        except Exception as e:
            # Return partial error but don't crash
            analysis_result = [{"topic": "Analysis Error", "probability": 0, "frequency": f"0/{paper_count}", "reasoning": str(e)}]

        return {
            "filename": filename,
            "status": "uploaded",
            "file_id": unique_id,
            "original_name": file.filename,
            "analysis": analysis_result
        }
        
    finally:
        # CLEANUP: Delete the local file after analysis (Crucial for free cloud hosting)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"[CLEANUP] Removed temporary file: {file_path}")
            except Exception as e:
                print(f"[CLEANUP ERROR] Could not remove {file_path}: {e}")
