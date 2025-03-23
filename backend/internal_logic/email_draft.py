from backend.internal_logic.models import Person
from openai import OpenAI

def make_email(person: Person, event_summery: str)->str:
    return ""