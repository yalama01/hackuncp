import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI

from backend.external_logic.user_event import router

# Create a test FastAPI app instance
app = FastAPI()
app.include_router(router)

# Use TestClient instead of AsyncClient with real HTTP requests
client = TestClient(app)

def test_submit_event_location():
    # Sample input data matching ProjectSubmission model
    payload = {
        "project_overview": "A super awesome community garden 20sq ft",
        "location": {
            "city": "Pembrook",
            "state": "NC",
            "country": "USA",
            "postal_code": "28202",
            "coordinates": {
                "latitude": 35.2271,
                "longitude": -80.8431
            }
        }
    }

    # Send a POST request to the endpoint
    response = client.post("/api/project/proposal", json=payload)

    # Assertions
    data = response.json()
    print(data)

    assert isinstance(data["feedback"], list)

def test_submit_verbose_location():
    # Sample input data matching ProjectSubmission model
    payload = {
        "project_overview": "This project aims to develop a self-sustaining urban rooftop garden in the downtown area, spanning 50 square feet. It will utilize hydroponic systems to maximize crop yield and implement a rainwater collection system for irrigation. Additionally, the garden will serve as a community engagement hub, hosting educational workshops on sustainable agriculture and providing fresh produce to local food banks.",
        "location": {
            "city": "Pembrook",
            "state": "NC",
            "country": "USA",
            "postal_code": "28202",
            "coordinates": {
                "latitude": 35.2271,
                "longitude": -80.8431
            }
        }
    }

    # Send a POST request to the endpoint
    response = client.post("/project/proposal", json=payload)

    # Assertions
    print(response)
    data = response.json()
    print(data)

    assert isinstance(data["people_list"], list)