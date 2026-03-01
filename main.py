import uvicorn
from fastapi import FastAPI


app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
