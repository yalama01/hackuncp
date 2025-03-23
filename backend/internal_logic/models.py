from dataclasses import field, dataclass, asdict
from typing import Optional, Dict, List, Tuple
from pydantic import BaseModel, Field

# Pydantic Model for Coordinates
class Coordinates(BaseModel):
    latitude: float = Field(..., example=35.2271)
    longitude: float = Field(..., example=-80.8431)

# Pydantic Model for Location
class Location(BaseModel):
    city: str = Field(..., example="Pembrook")
    state: str = Field(..., example="NC")
    country: str = Field(default="USA", example="USA")
    postal_code: Optional[str] = Field(None, example="28202")
    coordinates: Optional[Coordinates] = None

# Pydantic Model for Project Submission
class ProjectSubmission(BaseModel):
    project_overview: str = Field(..., example="A super awesome community garden 20sq ft")
    location: Location

# Dataclass for Person
@dataclass
class Person:
    # Fields required in final object
    name: Optional[str] = None
    score: Optional[int] = None
    email_draft: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    emails: List[str] = field(default_factory=list)
    linkedin_url: Optional[str] = None

    # Additional fields
    current_job_title: Optional[str] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    skills: List[str] = field(default_factory=list)
    interests: List[str] = field(default_factory=list)
    summary: Optional[str] = None
    phone_numbers: List[str] = field(default_factory=list)
    past_job_title: List[Tuple[str, int]] = field(default_factory=list)

# ✅ Now all fields should work properly with FastAPI & Pydantic!
