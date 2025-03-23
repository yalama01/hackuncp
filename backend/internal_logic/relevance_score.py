from idlelib.configdialog import is_int
from typing import List
from openai import OpenAI
import os
from dotenv import load_dotenv
import ast

from backend.internal_logic.models import Person

#load variables from .env
load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)
def make_score(person: Person, event_summary: str) -> int:
    person.score = get_relevance_score(event_summary,person.summary)
    if is_int(person.score):
        return person.score
    else:
        person.score = get_relevance_score(event_summary, person.summary)
        if is_int(person.score):
            return person.score
        else:
            person.score = get_relevance_score(event_summary, person.summary)
            if is_int(person.score):
                return person.score
            else:
                person.score = 0
                return person.score

def get_relevance_score(event_summary: str, person_summary: str) -> int:
    prompt = f"""
        You are helping evaluate the relevance of potential contacts for a sustainability-related community project.

        Given:
        - A summary of the project idea.
        - A summary of a potential sponsor or contact person.

        Your task:
        Analyze how relevant and useful this person would be in supporting or enabling the project.

        Instructions:
        Return a single integer between 1 and 100, where:
        - 1 means not relevant at all,
        - 100 means extremely relevant and likely to help.

        Only return the integer. Do not include any explanation, formatting, or extra text.

        Project Summary:
        {event_summary}

        Person Summary:
        {person_summary}
        """

    response = client.chat.completions.create(model="gpt-4o",
    messages=[
        {"role": "system", "content": "You help find sponsors for sustainability-related community projects."},
        {"role": "user", "content": prompt}
    ],
    temperature=0)

    content = response.choices[0].message.content

    return int(content)

if __name__ == "__main__":
    event_summary = "We are organizing a community-led initiative to transform an abandoned lot into a green space that includes a community garden, native plant landscaping, and educational signage about local ecology. The goal is to improve food access, promote environmental awareness, and create a safe, beautiful space for residents to gather. We are seeking support with land use approvals, funding, volunteer coordination, and long-term maintenance partnerships."
    person_summary = "I am John Pork."

    print(get_relevance_score(event_summary, person_summary))
    person_summary = """
    Sustainability Experience: Worked as an Eco-Rep at UNC Charlotte Office of Sustainability, engaging in peer-to-peer outreach and education initiatives. This experience is valuable for promoting sustainable gardening practices and educating others on eco-friendly methods.
    Analytical Skills: As a Functional Compliance Purchasing Analyst, Anna analyzes data and identifies risks, which can help in assessing soil quality, plant health, and optimizing garden resources effectively.
    Community Engagement: Skills in volunteering and outreach programs indicate a strong ability to connect with community members, which can be beneficial for organizing community gardening events or workshops.
    """
    print(get_relevance_score(event_summary, person_summary))

