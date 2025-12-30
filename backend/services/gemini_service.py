import google.generativeai as genai
import os
import time
import json
from dotenv import load_dotenv
from typing import List, Dict, Any

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Model Configuration - 3-Tier Intelligent Fallback
PRIMARY_MODEL = "models/gemini-3-flash-preview"
FALLBACK_MODEL_1 = "models/gemini-2.5-flash"
FALLBACK_MODEL_2 = "models/gemini-2.5-flash-lite"

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

def analyze_document(file_path: str, paper_count: int = 3) -> List[Dict[str, Any]]:
    """
    Uploads a file to Gemini, waits for processing, and returns structured topic analysis.
    Returns a list of topic dictionaries with probability, frequency, and reasoning.
    
    Args:
        file_path: Path to the uploaded file
        paper_count: Number of past papers uploaded (for realistic frequency calculation)
    """
    if not GEMINI_API_KEY:
        print("ERROR: No API key configured")
        return [{"topic": "Configuration Error", "probability": 0, "frequency": f"0/{paper_count} Years", "reasoning": "API Key missing"}]

    try:
        # 1. Upload File
        print(f"[UPLOAD] Starting upload: {file_path}")
        print(f"[CONTEXT] Analyzing with {paper_count} past papers")
        file = genai.upload_file(file_path)
        print(f"[UPLOAD] Success! URI: {file.uri}")

        # 2. Wait for Processing
        while file.state.name == "PROCESSING":
            print("[PROCESSING] Waiting for file processing...")
            time.sleep(2)
            file = genai.get_file(file.name)

        if file.state.name == "FAILED":
            print("[ERROR] File processing failed")
            raise ValueError("Gemini failed to process the file.")
        
        print("[READY] File processing complete. Generating analysis...")

        # 3. Generate Content with Dynamic Prompt and 3-Tier Fallback Logic
        prompt = f"""Analyze this document (syllabus or exam paper) and extract key topics that are likely to appear in exams.

IMPORTANT: The user has uploaded {paper_count} past exam papers. Your frequency estimates MUST use this exact number.

For each topic, provide:
1. The topic name (clear and concise)
2. An estimated probability (0-100) of appearing based on importance and recurrence patterns
3. Frequency estimate in format "X/{paper_count} Years" where X is between 0 and {paper_count}
4. Brief reasoning for the probability estimate
5. **1-2 sample questions** from the past papers that relate to this topic (if available in the document)

CRITICAL RULES:
- Frequency MUST be in format "X/{paper_count} Years" (e.g., "2/{paper_count} Years")
- X must be a realistic number between 0 and {paper_count}
- Higher frequency (closer to {paper_count}) should correlate with higher probability
- Be conservative and realistic - not every topic appears in every paper
- Extract actual question text from the document when possible
- If no questions are found for a topic, use an empty array for sample_questions

Return ONLY a valid JSON array with this structure (no markdown, no backticks):
[
  {{
    "topic": "Topic Name",
    "probability": 85,
    "frequency": "2/{paper_count} Years",
    "reasoning": "Brief explanation",
    "sample_questions": [
      "Explain the concept of X with examples.",
      "Derive the equation for Y."
    ]
  }}
]

Extract 6-10 most important topics. Be factual and based only on the document content."""
        
        # 3-Tier Intelligent Fallback: Try best model first, gracefully degrade
        response = None
        model_used = None
        
        # Try PRIMARY (Gemini 3 Flash - Most Intelligent)
        try:
            print(f"[MODEL] Attempting analysis with {PRIMARY_MODEL} (Primary - Best Quality)")
            model = genai.GenerativeModel(PRIMARY_MODEL)
            response = model.generate_content([file, prompt])
            model_used = PRIMARY_MODEL
            print(f"[SUCCESS] Analysis completed with {PRIMARY_MODEL}")
        except Exception as primary_error:
            # Check if it's a rate limit error
            error_str = str(primary_error).lower()
            is_rate_limit = (
                "429" in error_str or 
                "quota" in error_str or 
                "rate limit" in error_str or 
                "resource exhausted" in error_str or
                "resourceexhausted" in error_str
            )
            
            if is_rate_limit:
                print(f"[FALLBACK-1] Rate limit on {PRIMARY_MODEL}, trying {FALLBACK_MODEL_1}")
                
                # Try FALLBACK 1 (Gemini 2.5 Flash - Good Quality)
                try:
                    model = genai.GenerativeModel(FALLBACK_MODEL_1)
                    response = model.generate_content([file, prompt])
                    model_used = FALLBACK_MODEL_1
                    print(f"[SUCCESS] Analysis completed with {FALLBACK_MODEL_1}")
                except Exception as fallback1_error:
                    # Check if fallback 1 also hit rate limit
                    error_str_fb1 = str(fallback1_error).lower()
                    is_rate_limit_fb1 = (
                        "429" in error_str_fb1 or 
                        "quota" in error_str_fb1 or 
                        "rate limit" in error_str_fb1 or 
                        "resource exhausted" in error_str_fb1 or
                        "resourceexhausted" in error_str_fb1
                    )
                    
                    if is_rate_limit_fb1:
                        print(f"[FALLBACK-2] Rate limit on {FALLBACK_MODEL_1}, trying {FALLBACK_MODEL_2}")
                        
                        # Try FALLBACK 2 (Gemini 2.5 Flash Lite - Acceptable Quality)
                        try:
                            model = genai.GenerativeModel(FALLBACK_MODEL_2)
                            response = model.generate_content([file, prompt])
                            model_used = FALLBACK_MODEL_2
                            print(f"[SUCCESS] Analysis completed with {FALLBACK_MODEL_2}")
                        except Exception as fallback2_error:
                            print(f"[ERROR] All models failed. Final error: {fallback2_error}")
                            raise fallback2_error
                    else:
                        # Fallback 1 failed for non-rate-limit reason
                        raise fallback1_error
            else:
                # Primary failed for non-rate-limit reason
                raise primary_error
        
        # 4. Parse JSON Response
        response_text = response.text.strip()
        print(f"[RESPONSE] Received {len(response_text)} characters")
        
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()
        
        # Parse JSON
        try:
            topics = json.loads(response_text)
            
            # Validate structure
            if not isinstance(topics, list):
                print(f"[ERROR] Response is not a list, got: {type(topics)}")
                raise ValueError("Response is not a list")
            
            if len(topics) == 0:
                print("[WARNING] Empty topics array returned")
                return [{
                    "topic": "No Topics Found",
                    "probability": 0,
                    "frequency": f"0/{paper_count} Years",
                    "reasoning": "AI returned empty analysis"
                }]
            
            # Ensure all required fields exist and validate frequency format
            for i, topic in enumerate(topics):
                if not all(key in topic for key in ["topic", "probability", "frequency", "reasoning"]):
                    print(f"[ERROR] Topic {i} missing required fields: {topic}")
                    raise ValueError(f"Missing required fields in topic {i}")
                
                # Add sample_questions if not present (optional field)
                if "sample_questions" not in topic:
                    topic["sample_questions"] = []
                
                # Ensure frequency uses correct paper count
                if f"/{paper_count}" not in topic["frequency"]:
                    print(f"[WARNING] Topic {i} has incorrect frequency format: {topic['frequency']}, fixing...")
                    # Try to extract the number and reformat
                    freq_match = topic["frequency"].split("/")[0]
                    try:
                        freq_num = int(freq_match)
                        topic["frequency"] = f"{min(freq_num, paper_count)}/{paper_count} Years"
                    except:
                        topic["frequency"] = f"1/{paper_count} Years"
            
            print(f"[SUCCESS] Parsed {len(topics)} topics successfully using {model_used}")
            return topics
            
        except json.JSONDecodeError as e:
            print(f"[ERROR] JSON parsing failed: {e}")
            print(f"[RAW RESPONSE] {response_text[:1000]}")
            # Return a single error topic instead of crashing
            return [{
                "topic": "Parsing Error",
                "probability": 0,
                "frequency": "0/0 Years",
                "reasoning": f"JSON decode failed: {str(e)}"
            }]

    except Exception as e:
        print(f"[CRITICAL ERROR] analyze_document failed: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        
        return [{
            "topic": "System Error",
            "probability": 0,
            "frequency": "0/0 Years",
            "reasoning": f"Analysis failed: {str(e)}"
        }]
