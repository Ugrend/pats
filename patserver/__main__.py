import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from patserver.settings import settings
from patserver.views import api_router

app = FastAPI()
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(api_router, prefix="/api")



if __name__ == "__main__":
    uvicorn.run(
        app,
        host=settings.app.listen_host,
        port=settings.app.port
    )
