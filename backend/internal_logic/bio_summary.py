from backend.internal_logic.models import Person
from openai import OpenAI

def make_bio(person: Person, event_summary: str)->str:
    person.bio = bio(person, event_summary)
    return person.bio


def bio(person: Person, event_summary: str) -> str:
    client = OpenAI()

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
            "role": "system",
            "content": """You are an agent tasked with taking in information about a person who could help the user with task.
            The user wants to know how this person could help them complete their task.
            You will be given the task the user has asked, and the information about a person they should know about.
            Then use that information to create 3 or less bullet points about the person using information that is relevant to the event the user is planing.
            Exclude text before and after the bullet points
            Keep it short
            Have both positive and negative points if possible
            Elaborate why it is important to the task for two sentences
            Do not say the name
            """
            },
            {
            "role": "user",
            "content": f"""A user wants to make a project:
            
            {event_summary}
            
            Here is a candidate information who might be helpful create 6 short bullet point summary of their experience and also include information that might be relevant to the project:
            
            Name: {person.name}
            
            Current Job Title : {person.current_job_title}
            
            Company Name : {person.company_name}
            
            Industry : {person.industry}
            
            Skills : {person.skills}
            
            interests : {person.interests}
            
            linkedIn bio : {person.summary}
            
            past_job_title(s) : {person.past_job_title}
            
            
            
            
            Please create a bio for this person.
            """
        }],
            temperature=.35,
            top_logprobs=.95,
            max_tokens=800
    )

    return completion.choices[0].message.content

if __name__ == "__main__":
    bio()