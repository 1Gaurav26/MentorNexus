# MentorNexus — Backend

This folder contains the FastAPI backend for MentorNexus.

Overview
- API: implemented with FastAPI in `backend/app/main.py`.
- Data: faculty and student datasets live in `backend/data/*.csv`.
- Blockchain (optional): local Hardhat node + contract in `backend/blockchain`.

Prerequisites
- Python 3.10+ (3.11 recommended)
- Node.js + npm (only required for blockchain local testing)

Quick setup (Windows PowerShell)

1. Create and activate virtual environment

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install Python dependencies

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

3. Create an environment file (optional)

The backend loads environment variables with `python-dotenv`. You can create a `.env` file in the `backend/` directory. Example variables:

```
# backend/.env (optional)
MATCH_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
# add any other env vars you require
```

Note: `MATCH_CONTRACT_ADDRESS` defaults to a typical Hardhat-local address if not set.

Run the backend (development)
I'll start the backend server in a background terminal now so you can test the frontend connection immediately. 

Ran terminal command: .\backend\pro\Scripts\Activate.ps1; uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

```powershell
# from backend/ (with venv active)
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

The API base will be available at `http://localhost:8000`.

Optional: Run the local blockchain and deploy contract

If you intend to use commit-to-blockchain functionality, run the local Hardhat node and deploy the contract. From `backend/blockchain`:

```powershell
cd backend\blockchain
npm install
# run a local Hardhat node in a separate terminal
npx hardhat node

# in another terminal (connected to the running node), deploy the contract:
npx hardhat run scripts/deploy.js --network localhost
```

The deploy script will print the deployed contract address — set that value in `backend/.env` as `MATCH_CONTRACT_ADDRESS` if desired.

Basic API endpoints (used by the frontend)
- `GET /` — health check
- `GET /faculty` — list faculty records
- `POST /faculty/upsert` — add or update faculty
- `GET /search/faculty?q=...` — faculty search
- `POST /match/research` — research-only match
- `POST /match/full` — full match (commits to blockchain)
- `POST /student/upsert` — add/update student record

Example curl request

```powershell
curl -X GET "http://localhost:8000/" -H "Accept: application/json"
```

Troubleshooting
- If you see a Web3 connection error from `backend/app/blockchain_service.py`, the local Hardhat node is not running or reachable at `http://127.0.0.1:8545`.
- If Python package installation fails, ensure your Python version is compatible and `pip` is updated.
- Datasets: `backend/app/main.py` loads `backend/data/faculty_dataset.csv` on startup — ensure the file exists and is readable.

Next steps
- Start the backend server and test the endpoints with the frontend.
- If you want, I can run the backend locally and verify API responses.
