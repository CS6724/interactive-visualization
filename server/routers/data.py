from fastapi import APIRouter, Query
from typing import Optional

from .resource import faqs

router = APIRouter(prefix="/data", tags=["data"])

@router.get("/faq")
def get_faq():
    """
    Get frequently asked questions (FAQs) for users.
    This endpoint retrieves a list of FAQs categorized by topic.
    Returns:
        dict: A dictionary containing categories of FAQs and their respective questions.
    """
    return faqs

from data import get_classes, get_packages
@router.get("/classes")
async def get_classes_data(
    package: Optional[str] = Query(None, description="Optional package name to filter classes"),
    # filter: Optional[str] = Query(None, description="Optional filter object")
):
    """
    Retrieve data from a JSON file with optional filtering.
    
    Query Parameters:
    - package (optional): Package name to filter UML classes
    """
    data = get_classes(package or None)
    return {"data": data}

@router.get("/packages")
async def get_packages_data(
    package: Optional[str] = Query(None, description="Optional package name to filter classes"),
    # filter: Optional[str] = Query(None, description="Optional filter object")
):
    """
    Retrieve data from a JSON file with optional filtering.
    
    Query Parameters:
    - package (optional): Package name to filter UML classes
    """
    data = get_packages(package or None)
    return {"data": data}

