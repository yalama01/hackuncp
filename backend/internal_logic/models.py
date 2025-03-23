from dataclasses import field
from typing import Optional, Dict

from pydantic import BaseModel

class EventLocationRequest(BaseModel):
    event_summary: str
    location: str

@dataclass
class Person:
    name: Optional[str] = field(default=None)
    raw: Optional[str] = field(default=None)
    json_raw: Optional[Dict] = field(default=None)
    job_title: Optional[str] = field(default=None)
    score: Optional[int] = field(default=None)
    bio: Optional[str] = field(default=None)
    email: Optional[str] = field(default=None)

    def __post_init__(self):
        # Ensure json_raw is always a dictionary or None
        if self.json_raw is not None and not isinstance(self.json_raw, dict):
            raise ValueError("json_raw must be a dictionary or None")
