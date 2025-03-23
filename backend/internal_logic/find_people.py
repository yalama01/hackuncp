from typing import List, Dict
import requests

def find_people(job_titles:List[str], location):
    information = [{}]
    """
    {"Name":"Ethan Nguyen",
    "current_job_title": "",
    "past_job_title":[("Research Assistant",0),("Janitor",200),("Research Assistant",0)] # Job title, how long ago was that job in days
    """
    requests.get("https://charlotte.edu")

    return information

def rate_relevancy(job_title,personal_information, summary)-> int:
    return 0 #return a number 0 through a 100