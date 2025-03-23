from backend.internal_logic.models import Person
from openai import OpenAI

def make_bio(person: Person, event_summery: str)->str:
    return bio(person, event_summery)


def bio(person: Person, event_summery: str) -> str:
    client = OpenAI()

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
            "role": "system",
            "content": """You are an agent tasked with taking in information about a person who could help the user.
            The user wants to know how this person could help them compleate their task.
            You will be given the task the user has asked, and the information about a person they should know about.
            Use that information to create 3 bullet point bio about the person using information that is relivent to the event the user is planing.
            """
            },
            {
            "role": "user",
            "content": f"""Im working on this project. Here is a summary about what Im doing.
            {event_summery}
            I belive this person could be of use to me.
            
            Name: {person.name}
            
            Job Title: {person.job_title}
            
            
            Please create a bio for this person.
            """
        }]
    )

    return completion.choices[0].message.content