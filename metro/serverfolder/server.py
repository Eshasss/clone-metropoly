import uvicorn
from fastapi import Request
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles


app = FastAPI()

@app.get("/")
async def main() -> JSONResponse:
    return FileResponse("test_html.html")

@app.post("/data/")
async def get_data(request: Request) -> JSONResponse:
    json = await request.json()
    # name = json["name"]
    # age = json["age"]

    # print(name, age)
    return JSONResponse(content={"message": "thank you"}, status_code=200)
    

if __name__ == '__main__':
    uvicorn.run('server:app', port=8000, reload=True)