from web3 import Web3
import hashlib
import json
import os
import logging

logger = logging.getLogger(__name__)

# -----------------------------
# Web3 setup (local Hardhat)
# -----------------------------

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
BLOCKCHAIN_ENABLED = False
ACCOUNT = None

if not w3.is_connected():
    logger.warning("Hardhat node not connected at http://127.0.0.1:8545. Blockchain features disabled.")
else:
    try:
        ACCOUNT = w3.eth.accounts[0]
        BLOCKCHAIN_ENABLED = True
        logger.info("Blockchain connection established. Commits will be recorded on-chain.")
    except Exception as e:
        logger.warning(f"Failed to get account from Hardhat: {e}. Blockchain features disabled.")

# -----------------------------
# Contract ABI & address
# -----------------------------

ABI_PATH = "backend/blockchain/abi/MatchRegistry.json"
CONTRACT_ADDRESS = os.getenv(
    "MATCH_CONTRACT_ADDRESS",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
)

abi = None
contract = None

try:
    with open(ABI_PATH) as f:
        abi = json.load(f)
    if BLOCKCHAIN_ENABLED:
        contract = w3.eth.contract(
            address=Web3.to_checksum_address(CONTRACT_ADDRESS),
            abi=abi
        )
except Exception as e:
    logger.warning(f"Failed to load contract ABI: {e}. Blockchain features disabled.")

# -----------------------------
# Helpers
# -----------------------------

def sha256_bytes(value: object) -> bytes:
    if isinstance(value, list):
        value = "\n".join(value)
    if not isinstance(value, str):
        value = str(value)
    return hashlib.sha256(value.encode()).digest()


def generate_match_id(student_id: str, faculty_id: str, project_id: str) -> str:
    """
    Deterministic match id (important for auditability)
    """
    return hashlib.sha256(
        f"{student_id}:{faculty_id}:{project_id}".encode()
    ).hexdigest()

# -----------------------------
# Core commit function
# -----------------------------

def commit_match(
    student_id: str,
    faculty_id: str,
    project_id: str,
    final_score: float,
    match_mode: str,
    explanation: object  # Can be str or list
) -> str:
    """
    Commits a match record to blockchain.
    Returns match_id (hex string).
    Falls back to just generating match_id if blockchain is unavailable.
    """

    match_id = generate_match_id(student_id, faculty_id, project_id)
    
    if not BLOCKCHAIN_ENABLED or contract is None:
        logger.info(f"Blockchain disabled: returning match_id {match_id} without on-chain commit.")
        return match_id

    # Handle explanation list
    explanation_str = explanation
    if isinstance(explanation, list):
        explanation_str = "\n".join(explanation)

    tx = contract.functions.commitMatch(
        sha256_bytes(match_id),                  # matchId
        sha256_bytes(student_id),                # studentHash
        sha256_bytes(faculty_id),                # facultyHash
        int(final_score * 10000),                # preserve decimals
        match_mode,
        sha256_bytes(explanation_str)            # explanationHash
    ).transact({"from": ACCOUNT})

    w3.eth.wait_for_transaction_receipt(tx)
    logger.info(f"Match committed to blockchain: {match_id}")
    return match_id
