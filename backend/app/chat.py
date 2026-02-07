
from fastapi import WebSocket
from typing import List, Dict

class ConnectionManager:
    def __init__(self):
        # active_connections: List[WebSocket] = []
        # user_id -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, facebook_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[facebook_id] = websocket

    def disconnect(self, facebook_id: str):
        if facebook_id in self.active_connections:
            del self.active_connections[facebook_id]

    async def send_personal_message(self, message: str, facebook_id: str):
        if facebook_id in self.active_connections:
            await self.active_connections[facebook_id].send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = ConnectionManager()
