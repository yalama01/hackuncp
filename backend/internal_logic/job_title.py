from typing import List

import openai

def get_job_title_list(event_summary: str)-> List[str]:
    #call the ai logic gets a list of titles
    print(f"Event summary: {event_summary}")

    #gets the ai permuations of the job title
    return ["Officer of Sustainability"]