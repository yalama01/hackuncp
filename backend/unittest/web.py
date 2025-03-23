import pytest
from httpx import AsyncClient
from fastapi import FastAPI

from backend.external_logic.user_event import router

# Create a test FastAPI app instance
app = FastAPI()
app.include_router(router)


@pytest.mark.asyncio
async def test_submit_event_location():
    async with AsyncClient(base_url="http://127.0.0.1:8000") as client:
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
        response = await client.post("api/project/proposal", json=payload)

        # Assertions
        assert response.status_code == 200
        data = response.json()

        assert "people_list" in data  # Ensure response contains people_list
        assert isinstance(data["people_list"], list)  # Ensure it is a list
