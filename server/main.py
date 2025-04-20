import json
import uvicorn
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from routers import data, chat

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(data.router)
app.include_router(chat.router)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time AI chat."""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            user_input = json.loads(data)

            # Send a "Thinking..." message to client
            await websocket.send_text(json.dumps({"status": "thinking"}))
            # Stream the AI response
            question = user_input.get("message", "")
            context  = user_input.get("context", "")
            print(f"User Query: {question} \n \n in the context of \n\n {context}")
            # messages = db_app.invoke( { "messages": [("user", f"User Query: {question} \n \n in the context of \n\n {context}")] } )
            await websocket.send_text(json.dumps({"final_response": ""}))
    except Exception as e:
        print("Error:")
        print(e)
        await websocket.send_text(json.dumps({"error": str(e)}))
    finally:
        print("Closing ")
        await websocket.close()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
