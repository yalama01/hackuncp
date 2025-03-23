from pydantic import BaseModel

class EventLocationRequest(BaseModel):
    event_name: str
    location: str
