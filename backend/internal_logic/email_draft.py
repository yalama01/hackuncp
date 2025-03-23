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
            "content": """You are an an agent tasked with taking in creating an email to send to a person about how they could help a project.
            This email should entice the person to help the user with their project.
            """
            },
            {
            "role": "user",
            "content": f"""Im working on this project. Here is a summary about what Im doing.
            {event_summery}
            I belive this person could be of use to me.
            
            Name: {person.name}
            
            Job Title: {person.job_title}
            
            Bio: {person.bio}
            
            Please write an email to connect me with this person.
            """
        }]
    )

    return completion.choices[0].message.content