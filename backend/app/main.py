from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

from app.config import settings
from app.api.routes import router as api_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_resume_analyzer")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routes
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Sanitize validation errors into user-friendly JSON without raw schema internals."""
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        errors.append(f"{field}: {msg}")
    
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error: " + "; ".join(errors)}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Sanitize all unexpected internal errors to prevent exposing API keys or raw tracebacks."""
    logger.error(f"Unhandled system exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred while processing your request. Please try again."}
    )

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "health_endpoint": f"{settings.API_PREFIX}/health",
        "docs": "/docs"
    }
