# OpenAI Image API

**A RESTful API to generate, edit, and get variations of images using OpenAI DALL·E.**

## Endpoints

| Method | Route                     | Description                      |
|--------|--------------------------|----------------------------------|
| GET    | /api/health              | Health check                     |
| POST   | /api/generate-image      | Generate image from prompt       |
| POST   | /api/edit-image          | Edit uploaded image with prompt  |
| POST   | /api/generate-variations | Generate variations of an image  |
| GET    | /api/history             | Operation history (last 20 ops)  |
| GET    | /api/image/:id           | Details for op by id             |

## Setup

- `npm install`
- Set your `.env` with `OPENAI_API_KEY`
- `npm start`
- Browse Swagger docs at [/docs](http://localhost:3000/docs)