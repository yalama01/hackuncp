from logging import warning
from typing import List
from openai import OpenAI
import os
from dotenv import load_dotenv
import ast

#load variables from .env

load_dotenv()

try:
    openai_api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=openai_api_key)
except Exception as e:
    print(e)
    openai_api_key = None
    client = None
    warning("NO ENV OPENAI_API_KEY found!!")


def check_description(event_summary: str)-> List[str]:

    prompt = f"""
        Given the following project summary, determine whether it provides *enough general detail* to identify relevant people (e.g., government officials, nonprofit leaders, or community stakeholders) who could support or enable a sustainability-related community project.

        Project Summary:
        {event_summary}

        If the summary includes at least a general idea of the project’s goals, some context about the location or community, or mentions any needs (like funding, partnerships, or permissions), return **"1"**.

        Otherwise, return a *friendly and constructive message* explaining how the summary could be improved — for example:
        - It doesn’t mention what the project is trying to achieve
        - There’s no sense of where it takes place or who it helps
        - It doesn’t mention any kind of support needed (like funding or volunteers)

        Err on the side of being helpful — if there’s *some* useful info that could guide outreach, assume it's enough and return **"1"**.
        """

    response = client.chat.completions.create(model="gpt-4o",
    messages=[
        {"role": "system", "content": "You help check project summaries for sustainability-related community projects."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.6)

    #plain text response from gippity
    content = response.choices[0].message.content

    return content


#test 1
print(check_description("Starting a green initiative. Need help."))


