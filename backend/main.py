"""
MAIN API SERVER - MongoDB Version
- entry point that runs backend
- FastAPI creates the web server
- CORS allows frontend to talk to backend
- get_current_user() checks if someone is logged in before getting protected routes
- Routes
    / = basic check if server is running
    /api/me = returns logged-in user info (protected - needs login)
    /api/tokens = saves Canvas and Navigator tokens (protected)
    /api/onboarding-status = checks if user has completed onboarding (protected)
    /api/sync-courses = fetches user's Canvas courses and stores them (protected)
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from database import get_or_create_user, update_user, users_collection, init_db, user_has_tokens
from clerk_auth import verify_clerk_token
from canvas_retriever import CanvasContentRetriever

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request models
class TokensRequest(BaseModel):
    canvas_token: str
    navigator_token: str


async def get_current_user(authorization: str = Header(...)) -> dict:
    token = authorization.replace("Bearer ", "")
    clerk_data = await verify_clerk_token(token)
    
    user_data = {
        "email": clerk_data.get("email"),
        "first_name": clerk_data.get("first_name"),
        "last_name": clerk_data.get("last_name")
    }
    
    user = get_or_create_user(clerk_data.get("sub"), user_data)
    return user

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
async def root():
    return {"status": "running"}

@app.get("/api/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Returns logged-in user info including onboarding status"""
    return {
        "id": str(current_user["_id"]),
        "clerk_id": current_user["clerk_id"],
        "university_id": current_user.get("university_id"),
        "canvas_user_id": current_user.get("canvas_user_id"),
        "email": current_user.get("email"),
        "first_name": current_user.get("first_name"),
        "last_name": current_user.get("last_name"),
        "has_canvas_token": current_user.get("canvas_token_encrypted") is not None,
        "has_navigator_token": current_user.get("navigator_token_encrypted") is not None,
        "onboarding_complete": user_has_tokens(current_user)
    }


@app.post("/api/tokens")
async def save_tokens(
    tokens: TokensRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Save Canvas and Navigator tokens for user.
    Validates Canvas token by attempting to fetch courses.
    """
    
    # Verify Canvas token works by fetching courses
    try:
        canvas = CanvasContentRetriever(
            canvas_url="https://ufl.instructure.com",
            access_token=tokens.canvas_token
        )
        courses = canvas.get_courses()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid Canvas token: {str(e)}")
    
    # TODO: Verify Navigator token when we have Navigator API
    
    # Save tokens
    update_user(current_user["clerk_id"], {
        "canvas_token_encrypted": tokens.canvas_token,
        "navigator_token_encrypted": tokens.navigator_token
    })
    
    return {
        "message": "Tokens saved successfully",
        "onboarding_complete": True
    }


@app.get("/api/onboarding-status")
async def get_onboarding_status(current_user: dict = Depends(get_current_user)):
    """Check if user has completed onboarding (has both tokens)"""
    return {
        "has_canvas_token": current_user.get("canvas_token_encrypted") is not None,
        "has_navigator_token": current_user.get("navigator_token_encrypted") is not None,
        "onboarding_complete": user_has_tokens(current_user)
    }


"""
Fetches user's Canvas courses and returns: courses_synced (count) and courses list.
Each course has: id, name, course_code, enrollments (role + enrollment_state).
Note: frontend should only show courses where role is "TeacherEnrollment" on the dashboard, since "StudentEnrollment" users can't create or publish quizzes.
"""
@app.post("/api/sync-courses")
async def sync_courses(current_user: dict = Depends(get_current_user)):
    canvas_token = current_user.get("canvas_token_encrypted") or os.getenv("CANVAS_TOKEN")
    if not canvas_token:
        raise HTTPException(status_code=400, detail="No Canvas token found. Please complete onboarding.")

    canvas = CanvasContentRetriever(
        canvas_url="https://ufl.instructure.com",
        access_token=canvas_token
    )

    try:
        courses = canvas.get_courses()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch courses from Canvas: {str(e)}")

    # Save courses to user's document in MongoDB
    update_user(current_user["clerk_id"], {"courses": courses})

    return {"courses_synced": len(courses), "courses": courses}


"""
Retrieves all quizzes for a given course from Canvas.
"""
@app.get("/api/courses/{course_id}/quizzes")
async def retrieve_quizzes(course_id: int, current_user: dict = Depends(get_current_user)):
    canvas_token = current_user.get("canvas_token_encrypted") or os.getenv("CANVAS_TOKEN")
    if not canvas_token:
        raise HTTPException(status_code=400, detail="No Canvas token found. Please complete onboarding.")

    canvas = CanvasContentRetriever(
        canvas_url="https://ufl.instructure.com",
        access_token=canvas_token
    )

    try:
        quizzes = canvas.get_course_quizzes(course_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch quizzes from Canvas: {str(e)}")
    return {"quiz_count": len(quizzes), "quizzes": quizzes}


"""
Retrieves all files for a given course from Canvas.
"""
@app.get("/api/courses/{course_id}/files")
async def retrieve_files(course_id: int, current_user: dict = Depends(get_current_user)):
    canvas_token = current_user.get("canvas_token_encrypted") or os.getenv("CANVAS_TOKEN")
    if not canvas_token:
        raise HTTPException(status_code=400, detail="No Canvas token found. Please complete onboarding.")

    canvas = CanvasContentRetriever(
        canvas_url="https://ufl.instructure.com",
        access_token=canvas_token
    )

    try:
        files = canvas.get_course_files(course_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch files from Canvas: {str(e)}")

    return {"file_count": len(files), "files": files}


"""
Retrieves all questions for a given quiz from Canvas.
"""
@app.get("/api/courses/{course_id}/quizzes/{quiz_id}/questions")
async def retrieve_quiz_questions(course_id: int, quiz_id: int, current_user: dict = Depends(get_current_user)):
    canvas_token = current_user.get("canvas_token_encrypted") or os.getenv("CANVAS_TOKEN")
    if not canvas_token:
        raise HTTPException(status_code=400, detail="No Canvas token found. Please complete onboarding.")

    canvas = CanvasContentRetriever(
        canvas_url="https://ufl.instructure.com",
        access_token=canvas_token
    )

    try:
        questions = canvas.get_quiz_questions(course_id, quiz_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch quiz questions from Canvas: {str(e)}")

    return {"question_count": len(questions), "questions": questions}