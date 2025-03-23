from typing import List
from openai import OpenAI
import os
from dotenv import load_dotenv
import ast

#load variables from .env
load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)


def get_job_title_list(event_summary: str)-> List[str]:

    prompt = f"""
        Given the following project summary, list the types of job titles (mostly government or community organization positions) that should be contacted to support or enable the project.

        Project Summary:
        {event_summary}

        Return the job titles as a Python list.
        """

    response = client.chat.completions.create(model="gpt-4o",
    messages=[
        {"role": "system", "content": "You help generate relevant job titles for sustainability-related community projects."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.6)

    #plain text response from gippity
    content = response.choices[0].message.content

    try:
        #handle gippity's weird outputs
        content_clean = content.strip()

        if content_clean.startswith("```"):
            lines = content_clean.splitlines()
            lines = [line for line in lines if not line.startswith("```")]
            content_clean = "\n".join(lines)

        if "=" in content_clean:
            content_clean = content_clean.split("=", 1)[1].strip()

        job_titles = ast.literal_eval(content_clean) if content_clean.startswith("[") else [
            title.strip() for title in content_clean.split("\n") if title.strip()
        ]

        return job_titles

    except Exception as e:
        print("could not parse job title list:", e)
        print("raw output:\n", content)
        return []


event_summary = "We are organizing a community-led initiative to transform an abandoned lot into a green space that includes a community garden, native plant landscaping, and educational signage about local ecology. The goal is to improve food access, promote environmental awareness, and create a safe, beautiful space for residents to gather. We are seeking support with land use approvals, funding, volunteer coordination, and long-term maintenance partnerships."

print(get_job_title_list(event_summary))
