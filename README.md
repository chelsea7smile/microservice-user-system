Users Push Notification Service

This project is a microservices-based application for managing users and sending them push notifications. The application consists of two main microservices:

•	User Service: Handles user creation and persists user data in a PostgreSQL database. When a user is created via an HTTP POST request, the service stores the user and emits an event to RabbitMQ.

•	Notification Service: Listens for user creation events from RabbitMQ, schedules a push notification (using Bull with Redis as a backing store), and after a specified delay (e.g. 24 hours or a test delay of 1 second), sends a push notification to a specified webhook URL (e.g., Webhook.site).


Technologies Used

•	NestJS – A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

•	TypeORM – ORM for managing PostgreSQL interactions.
 
•	PostgreSQL – The database for storing user data.
 
•	RabbitMQ – Message broker for decoupled communication between services (with Management UI).

•	Redis – In-memory data structure store used by Bull for queue management.

•	Bull – A Node library for robust job/task queueing.

•	Axios – HTTP client for sending requests to the webhook.

•	Docker & Docker Compose – For containerizing the application and its dependencies.

How to Run the Application via Docker Compose

1.	Prerequisites:

•	Install Docker and Docker Compose.

2.	Build and Start:
   
•	Navigate to the root directory of the project:

``` cd /path/to/users-push-service ```


•	Run the following command to build and start all services:

``` docker-compose up --build ```


•	The following containers will be started:

•	postgres – PostgreSQL database.

•	rabbitmq – RabbitMQ message broker (ports: 5672 for AMQP, 15672 for the management UI).

•	redis – Redis instance.

•	user-service – Service running on port 3000.

•	notification-service – Service for sending notifications.

3.	Verifying RabbitMQ:

•	Open your browser and navigate to http://localhost:15672.

•	Login using the default credentials: guest / guest.

•	Check the queues and connections to monitor message activity.

4.	Verifying Redis:
	
•	Connect to the Redis container using the CLI:

``` docker exec -it users-push-service-redis-1 redis-cli ```


•	Run commands like KEYS * to list keys or MONITOR to see real-time operations.

Testing the Application via Postman

1.	Create a User:

•	Send an HTTP POST request to create a new user:

``` POST http://localhost:3000/users ```


•	Set the request body (JSON):
```
{
  "username": "John Doe"
}
```

•	Expected response:
```
{
  "username": "John Doe",
  "id": 1,
  "createdAt": "2025-03-02T14:33:22.218Z"
}
```

2.	Verify Notification:

•	Once a user is created, the User Service emits a user.created event to RabbitMQ.

•	The Notification Service receives this event, schedules a push notification (with a test delay of 1000 ms), and sends a POST request to the webhook URL.

•	Open Webhook.site and use the provided URL (e.g., ``` https://webhook.site/#!/view/954cee53-5ac0-4a77-96fd-420bb60700e9/e9549dd7-7d49-4746-b760-1ee684130e9d/1 ```) to inspect the incoming notification.

•	The notification payload should look similar to:
```
{
  "message": "Hello, John Doe!"
}
```


How to Verify Users in the Database

To check if a user is saved in PostgreSQL:

1.	Connect to the PostgreSQL container:
```
docker exec -it users-push-service-postgres-1 psql -U user -d users_db
```

2.	Run the SQL query:

``` SELECT * FROM "user"; ```

This will display the list of stored users.

Additional Information

•	Delayed Notifications:

The Notification Service uses Bull to schedule delayed jobs. The delay is passed as an argument (in milliseconds) when scheduling a job. In production, this delay should be 24 hours (86400000 ms), but for testing, a shorter delay (e.g., 1000 ms) is used.

•	Environment Configuration:

Verify that the .env files in both the user-service and notification-service directories contain the correct environment variables:

# For Notification Service (.env)
```
RABBITMQ_URL=amqp://rabbitmq:5672
REDIS_HOST=redis
```
