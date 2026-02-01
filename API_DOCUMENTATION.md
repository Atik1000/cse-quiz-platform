# CSE Quiz Platform - API Documentation

Base URL: `http://localhost:4000/api` (Development)

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2026-01-31T...",
    "updatedAt": "2026-01-31T..."
  }
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as Register

---

## 👤 User Endpoints

### Get User Profile
```http
GET /user/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "createdAt": "2026-01-31T...",
  "updatedAt": "2026-01-31T...",
  "totalQuizzes": 5,
  "averageScore": 85.5
}
```

---

## 📚 Category Endpoints

### Get All Categories
```http
GET /categories
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Programming",
    "parentId": null,
    "createdAt": "2026-01-31T...",
    "updatedAt": "2026-01-31T...",
    "parent": null,
    "children": [
      {
        "id": "uuid",
        "name": "Python",
        "parentId": "parent-uuid",
        ...
      }
    ],
    "_count": {
      "questions": 50
    }
  }
]
```

### Get Category Tree
```http
GET /categories/tree
Authorization: Bearer <token>
```

**Response:** Hierarchical structure of categories

### Get Single Category
```http
GET /categories/:id
Authorization: Bearer <token>
```

### Create Category (Admin Only)
```http
POST /categories
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Data Structures",
  "parentId": "parent-uuid" // optional
}
```

### Update Category (Admin Only)
```http
PUT /categories/:id
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Updated Name",
  "parentId": "new-parent-uuid"
}
```

### Delete Category (Admin Only)
```http
DELETE /categories/:id
Authorization: Bearer <token>
```

---

## ❓ Question Endpoints

### Get All Questions
```http
GET /questions?page=1&limit=10&categoryId=uuid&difficulty=EASY
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `categoryId` (optional): Filter by category
- `difficulty` (optional): Filter by difficulty (EASY, MEDIUM, HARD)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "question": "What is Python?",
      "options": ["A programming language", "A snake", "A framework", "A database"],
      "correctAnswer": "A programming language",
      "explanation": "Python is a high-level programming language...",
      "difficulty": "EASY",
      "type": "MCQ",
      "categoryId": "uuid",
      "createdAt": "2026-01-31T...",
      "updatedAt": "2026-01-31T...",
      "category": {
        "id": "uuid",
        "name": "Programming"
      }
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Get Single Question
```http
GET /questions/:id
Authorization: Bearer <token>
```

### Create Question (Admin Only)
```http
POST /questions
Authorization: Bearer <token>
```

**Body:**
```json
{
  "question": "What is the time complexity of binary search?",
  "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
  "correctAnswer": "O(log n)",
  "explanation": "Binary search divides the search space in half...",
  "difficulty": "MEDIUM",
  "type": "MCQ",
  "categoryId": "uuid"
}
```

### Update Question (Admin Only)
```http
PUT /questions/:id
Authorization: Bearer <token>
```

### Delete Question (Admin Only)
```http
DELETE /questions/:id
Authorization: Bearer <token>
```

---

## 📝 Quiz Endpoints

### Start Quiz
```http
POST /quiz/start
Authorization: Bearer <token>
```

**Body:**
```json
{
  "categoryId": "uuid",
  "difficulty": "MIX", // or EASY, MEDIUM, HARD
  "numberOfQuestions": 10
}
```

**Response:**
```json
{
  "attemptId": "uuid",
  "quiz": {
    "id": "uuid",
    "title": "Programming - MIX Quiz",
    "categoryId": "uuid",
    "difficulty": "MIX",
    "totalQuestions": 10,
    "timeLimit": 20
  },
  "questions": [
    {
      "id": "uuid",
      "question": "What is Python?",
      "options": ["...", "...", "...", "..."],
      "difficulty": "EASY",
      "type": "MCQ",
      "categoryId": "uuid",
      "createdAt": "...",
      "updatedAt": "..."
      // Note: correctAnswer and explanation are NOT included
    }
  ],
  "startedAt": "2026-01-31T..."
}
```

### Submit Quiz
```http
POST /quiz/submit
Authorization: Bearer <token>
```

**Body:**
```json
{
  "attemptId": "uuid",
  "answers": [
    {
      "questionId": "uuid",
      "answer": "A programming language",
      "timeSpent": 30
    }
  ]
}
```

**Response:**
```json
{
  "attempt": {
    "id": "uuid",
    "userId": "uuid",
    "quizId": "uuid",
    "score": 80,
    "totalQuestions": 10,
    "status": "COMPLETED",
    "startedAt": "...",
    "completedAt": "...",
    "answers": [...]
  },
  "questions": [
    {
      "id": "uuid",
      "question": "...",
      "options": [...],
      "correctAnswer": "...",
      "explanation": "...",
      "userAnswer": "...",
      "isCorrect": true,
      "timeSpent": 30
    }
  ],
  "totalScore": 80,
  "percentage": 80,
  "timeTaken": 600
}
```

### Get Quiz History
```http
GET /quiz/history?page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "attempts": [
    {
      "id": "uuid",
      "userId": "uuid",
      "quizId": "uuid",
      "score": 85,
      "totalQuestions": 10,
      "status": "COMPLETED",
      "startedAt": "...",
      "completedAt": "...",
      "quiz": {
        "id": "uuid",
        "title": "...",
        "category": {
          "id": "uuid",
          "name": "Programming"
        }
      }
    }
  ],
  "statistics": {
    "totalQuizzes": 5,
    "averageScore": 82.5,
    "totalTimeSpent": 3600,
    "categoryBreakdown": [
      {
        "categoryId": "uuid",
        "categoryName": "Programming",
        "attempts": 3,
        "averageScore": 85
      }
    ]
  },
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 👨‍💼 Admin Endpoints

### Generate Questions (AI)
```http
POST /admin/generate-questions
Authorization: Bearer <admin-token>
Rate Limited: 5 requests per minute
```

**Body:**
```json
{
  "categoryId": "uuid",
  "subcategoryId": "uuid", // optional
  "difficulty": "MIX", // or EASY, MEDIUM, HARD
  "numberOfQuestions": 10,
  "type": "MCQ" // or SHORT_ANSWER, CODING
}
```

**Response:**
```json
{
  "message": "Successfully generated 10 questions",
  "questions": [
    {
      "id": "uuid",
      "question": "...",
      "options": [...],
      "correctAnswer": "...",
      "explanation": "...",
      "difficulty": "MEDIUM",
      "type": "MCQ",
      "categoryId": "uuid",
      "category": {
        "id": "uuid",
        "name": "..."
      }
    }
  ]
}
```

### Get Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "totalUsers": 150,
  "totalCategories": 20,
  "totalQuestions": 500,
  "totalQuizAttempts": 1200,
  "averageScore": 78.5,
  "questionsByDifficulty": [
    { "difficulty": "EASY", "count": 200 },
    { "difficulty": "MEDIUM", "count": 200 },
    { "difficulty": "HARD", "count": 100 }
  ],
  "questionsByCategory": [
    {
      "categoryId": "uuid",
      "categoryName": "Programming",
      "count": 150
    }
  ],
  "recentAttempts": [...]
}
```

### Get All Users
```http
GET /admin/users?page=1&limit=20
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "...",
      "_count": {
        "quizAttempts": 5
      }
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

## ⚠️ Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Common Status Codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## 🔒 Role-Based Access

### USER Role:
- All category endpoints (read)
- All question endpoints (read)
- Quiz endpoints (start, submit, history)
- User profile endpoint

### ADMIN Role:
All USER permissions plus:
- Create/Update/Delete categories
- Create/Update/Delete questions
- Generate questions with AI
- View dashboard statistics
- View all users

---

## 🚀 Rate Limiting

**Default Limits:**
- Standard endpoints: 10 requests per minute
- AI generation endpoint: 5 requests per minute

Exceeding limits returns `429 Too Many Requests`

---

## 📊 Best Practices

1. **Always validate input** before sending requests
2. **Handle errors gracefully** on the client side
3. **Store JWT tokens securely** (HttpOnly cookies or secure storage)
4. **Refresh tokens** before expiration
5. **Use pagination** for large datasets
6. **Implement proper error handling** for failed API calls
7. **Test with rate limiting** in mind

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Start Quiz
```bash
curl -X POST http://localhost:4000/api/quiz/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"categoryId":"uuid","difficulty":"MIX","numberOfQuestions":10}'
```

---

For more information, visit the GitHub repository or contact support.
