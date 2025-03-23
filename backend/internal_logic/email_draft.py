from backend.internal_logic.models import Person
from openai import OpenAI

def make_email(person: Person, event_summery: str)->str:
    person.email_draft = bio(person , event_summery)
    return person.email_draft


def bio(person: Person, event_summary: str) -> str:
    client = OpenAI()

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
            "role": "system",
            "content": """You are an agent tasked with writing a concise, professional email to the person in question, inviting them to discuss or collaborate on a forthcoming event. You will be given the event details and information about the person. Please craft an email that:

            1. Includes a greeting addressing the person by their name (if provided).
            2. Briefly describes the event and its objectives.
            3. Highlights relevant aspects of the person\'s background or expertise that relate to the event.
            4. Politely requests their consideration or discussion about how they might help.
            5. Concludes with a friendly and clear next step or invitation to connect further.

            The email should be short, direct, and professional. Avoid bullet points, maintain a warm and respectful tone, and sign off with a polite closing. Do not provide any additional commentary or text outside of the email itself.
            """
            },
            {
            "role": "user",
            "content": f"""A user wants to create or plan the following event:
            "{event_summary}"

            Here is the candidate information who might be helpful:

            Name: {person.name}
            Summary: {person.bio}
            Current Job Title: {person.current_job_title}
            Company Name: {person.company_name}
            Industry: {person.industry}
            Skills: {person.skills}
            Interests: {person.interests}
            LinkedIn Bio: {person.summary}
            Past job title(s): {person.past_job_title}

            Please create an email to this person."""
        },]
            temperature=.35,
            top_logprobs=.95,
            max_tokens=800
    )

    return completion.choices[0].message.content