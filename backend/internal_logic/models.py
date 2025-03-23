from dataclasses import field, dataclass, asdict
from typing import Optional, Dict, List, Tuple
from pydantic import BaseModel

class EventLocationRequest(BaseModel):
    event_summary: str
    location: str

@dataclass
class Person:
    name: str
    location: str
    current_job_title: str
    company_name: str
    industry: str
    skills: List[str] = field(default_factory=list)
    interests: List[str] = field(default_factory=list)
    summary: str = ""
    emails: List[str] = field(default_factory=list)
    phone_numbers: List[str] = field(default_factory=list)
    linkedin: str = ""
    past_job_title: List[Tuple[str, int]] = field(default_factory=list)

    def __init__(
        self,
        name: str,
        location: str,
        current_job_title: str,
        company_name: str,
        industry: str,
        skills: List[str],
        interests: List[str],
        summary: str,
        emails: List[str],
        phone_numbers: List[str],
        linkedin: str,
        past_job_title: List[Tuple[str, int]]
    ):
        self.name = name
        self.location = location
        self.current_job_title = current_job_title
        self.company_name = company_name
        self.industry = industry
        self.skills = skills
        self.interests = interests
        self.summary = summary
        self.emails = emails
        self.phone_numbers = phone_numbers
        self.linkedin = linkedin
        self.past_job_title = past_job_title

    def __post_init__(self):
        # Ensure json_raw is always a dictionary or None
        if self.json_raw is not None and not isinstance(self.json_raw, dict):
            raise ValueError("json_raw must be a dictionary or None")
