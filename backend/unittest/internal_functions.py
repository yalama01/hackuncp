import pytest
from httpx import AsyncClient
from fastapi import FastAPI



import pytest
from internal_logic import bio_summary, email_draft, models

person = models.Person()
person.company_name = "coke"
person.name = "Tommy dingle burg"
person.current_job_title = "head of outreach"
person.industry = "Coke"
person.skills = "marketing"
person.interests = "helping people"
person.summary = "Im chilling working for coke i like helping people"
person.past_job_title = "dean of arts"

input_data = "I want to bring more coke machines to campus."

# Tests for bio_summary.py
def test_generate_bio_summary():
    result = bio_summary.bio(person,input_data)
    print(result)
    assert len(result)>1

# Tests for email_draft.py
def test_generate_email_draft():
    draft = email_draft.make_email(person,input_data)
    print(draft)
    assert len(draft)>1

