import argparse
from pymongo import MongoClient
from datetime import datetime, timedelta
import random

parser = argparse.ArgumentParser(description='MongoDB connection string')
parser.add_argument('--mongo_url', type=str, required=True, help='MongoDB connection string')
args = parser.parse_args()

mongo_url = args.mongo_url

# Connect to MongoDB
client = MongoClient(mongo_url)
db = client["ai_scores"]
collection = db["daily_scores"]

# Function to generate random scores for AI
def generate_ai_scores():
    return {
        "chatgpt": {"score": random.randint(0, 100)},
        "claude": {"score": random.randint(0, 100)},
        "gemini": {"score": random.randint(0, 100)}
    }

# Insert mock data for the past 30 days
today = datetime.now()
for i in range(30):
    date = today - timedelta(days=i)
    daily_scores = {
        "date": date,  # Storing datetime object instead of string
        "ai_scores": generate_ai_scores(),
        "created_at": date  # Both can use the same datetime object
    }
    collection.insert_one(daily_scores)

print("Mock data for the last 30 days inserted successfully.")
