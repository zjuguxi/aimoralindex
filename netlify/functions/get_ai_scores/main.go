package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func init() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, relying on environment variables")
	}
}

type DailyScore struct {
	Date      time.Time `json:"date"`
	ChatGPT   int       `json:"chatgpt"`
	Claude    int       `json:"claude"`
	Gemini    int       `json:"gemini"`
	CreatedAt time.Time `json:"created_at"`
}

// Handler 函数按照 AWS Lambda 的要求进行签名
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	log.Println("Received a request at handler")

	// 从环境变量中读取 MongoDB URL
	mongoURL := os.Getenv("MONGO_URL")
	if mongoURL == "" {
		log.Println("Error: MongoDB URL not set")
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "MongoDB URL not set",
		}, nil
	}
	log.Println("MongoDB URL retrieved from environment variable")

	// 连接到 MongoDB
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoURL))
	if err != nil {
		log.Println("Error: Failed to connect to MongoDB:", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Failed to connect to database",
		}, nil
	}
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Println("Warning: Error disconnecting from MongoDB:", err)
		} else {
			log.Println("Successfully disconnected from MongoDB")
		}
	}()

	log.Println("Successfully connected to MongoDB")

	// 查询 MongoDB
	collection := client.Database("ai_scores").Collection("daily_scores")
	now := time.Now()
	past30Days := now.AddDate(0, 0, -30)
	log.Println("Querying database for scores in the past 30 days")

	filter := bson.M{"date": bson.M{"$gte": past30Days}}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		log.Println("Error: Database query failed:", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Database query error",
		}, nil
	}

	var results []DailyScore
	if err := cursor.All(context.TODO(), &results); err != nil {
		log.Println("Error: Failed to decode query results:", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Error fetching results",
		}, nil
	}

	log.Printf("Successfully fetched %d records from MongoDB\n", len(results))

	// 返回结果
	responseBody, err := json.Marshal(results)
	if err != nil {
		log.Println("Error: Failed to encode response to JSON:", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Failed to encode response",
		}, nil
	}

	log.Println("Response successfully sent")
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(responseBody),
	}, nil
}

func main() {
	lambda.Start(Handler)
}
