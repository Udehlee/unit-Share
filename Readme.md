## unit-Share
An API service that simulates the transfer of prepaid electricity units between users

### How it works
- After registration, The system assign a unique meter number along with an initial unit balance to the user. 

- The User can now transfer prepaid electricity units to another user by providing the recipient’s meter number and the amount of units to send. Before completing the transaction, the system checks if the sender has enough units and If the transfer is valid, then the specified amount is deducted from the sender’s balance and added to the recipient’s balance. 

### Technologies Used
- node js (Express) 
- Postgres

### Setup and installation
- Clone the repository:
```sh 
git clone https://github.com/Udehlee/unit-Share.git
```

```sh
cd unit-Share
 ```

- Install dependencies 
```sh
npm install
```

- Start the application with
 ```sh
npm start
```
The sever is listening on http://localhost:3000

- Run migrations
 ```sh
npm migrate:up
```
### Api Endpoint

```sh
POST /api/v1/signup
POST /api/v1/login
POST /api/v1/transaction
```

### Example Request
 ```sh
{
  "senderId": 1,
  "recipientId": 2,
  "unitsTransferred": "20"
}

```

### Example Response
```sh
{
   {
    "success": true,
    "message": "Transaction completed successfully",
    "data": {
        "id": 1,
        "senderId": 1,
        "recipientId": 2,
        "unitsTransferred": 20,
        "status": "success",
        "createdAt": "2025-07-28T11:26:44.060Z"
  }
  
 }

```
