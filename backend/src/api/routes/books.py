"""
Books API routes - Alias for tasks endpoint.
This provides backward compatibility for frontend calling /books endpoint.
"""

from fastapi import APIRouter
from src.api.routes.tasks import router as tasks_router

# Create books router that uses the same routes as tasks
# We'll register it with /books prefix
router = APIRouter(prefix="/api", tags=["books"])

# Re-export all task routes as book routes
# The actual implementation is in tasks.py
# We just need to register routes with /books instead of /tasks

# Import task routes and register them with /books prefix
from src.api.routes import tasks

# Register all task routes but with /books instead of /tasks
# We'll do this by including the tasks router but with a prefix override
# Actually, simpler: just create alias routes

from typing import Dict
from fastapi import Depends, HTTPException, status
from sqlmodel import Session
from src.db import get_db
from src.middleware.jwt import verify_jwt_token
from src.schemas.requests import TaskCreate, TaskPatch, TaskUpdate
from src.schemas.responses import TaskListResponse, TaskResponse
from src.services.task_service import TaskService

task_service = TaskService()

# Alias routes: /books -> /tasks
@router.get(
    "/{user_id}/books",
    response_model=TaskListResponse,
    status_code=status.HTTP_200_OK,
)
async def get_books(
    user_id: str,
    current_user: Dict[str, str] = Depends(verify_jwt_token),
    db: Session = Depends(get_db),
) -> TaskListResponse:
    """Get books (alias for tasks)."""
    from src.api.routes.tasks import get_tasks
    return await get_tasks(user_id, current_user, db)

@router.post(
    "/{user_id}/books",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_book(
    user_id: str,
    task_data: TaskCreate,
    current_user: Dict[str, str] = Depends(verify_jwt_token),
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Create book (alias for tasks)."""
    from src.api.routes.tasks import create_task
    return await create_task(user_id, task_data, current_user, db)

@router.get(
    "/{user_id}/books/{book_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
)
async def get_book(
    user_id: str,
    book_id: int,
    current_user: Dict[str, str] = Depends(verify_jwt_token),
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Get book by ID (alias for tasks)."""
    from src.api.routes.tasks import get_task
    return await get_task(user_id, book_id, current_user, db)

@router.put(
    "/{user_id}/books/{book_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
)
async def update_book(
    user_id: str,
    book_id: int,
    task_data: TaskUpdate,
    current_user: Dict[str, str] = Depends(verify_jwt_token),
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Update book (alias for tasks)."""
    from src.api.routes.tasks import update_task
    return await update_task(user_id, book_id, task_data, current_user, db)

@router.patch(
    "/{user_id}/books/{book_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
)
async def patch_book(
    user_id: str,
    book_id: int,
    task_data: TaskPatch,
    current_user: Dict[str, str] = Depends(verify_jwt_token),
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Patch book (alias for tasks)."""
    from src.api.routes.tasks import patch_task
    return await patch_task(user_id, book_id, task_data, current_user, db)

@router.delete(
    "/{user_id}/books/{book_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_book(
    user_id: str,
    book_id: int,
    current_user: Dict[str, str] = Depends(verify_jwt_token),
    db: Session = Depends(get_db),
):
    """Delete book (alias for tasks)."""
    from src.api.routes.tasks import delete_task
    return await delete_task(user_id, book_id, current_user, db)

