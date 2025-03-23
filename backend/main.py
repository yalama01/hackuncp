import uvicorn

from fastapi import FastAPI

from backend.external_logic.user_event import router

app = FastAPI()

# Include Routers
app.include_router(router, prefix="/api", tags=["Project Proposal"])

# Main entry point
if __name__ == "__main__":
    print("HELLO??")
    uvicorn.run(app, port=8000)
    print("running?")
