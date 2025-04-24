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



# OpenAI Image API

A robust, modern REST API for generating, editing, and varying images using OpenAI DALL·E.  
Features flexible image options, file upload/download, auto-saving, and live documentation.

---

## 🚀 Features

- **/api/generate-image**: Generate images with flexible options (prompt, size, model, quality)
- **/api/edit-image**: Edit an uploaded image using a descriptive prompt
- **/api/generate-variations**: Generate variations from an uploaded seed image
- **/api/history**: View the recent generation/edit/variation jobs (in-memory log)
- **/api/image/:id**: Inspect a specific job by ID
- **Permanent image download**: Automatically downloads and saves generated images locally
- **Serves saved images**: Download saved files from `/saved/filename.png`
- **Swagger**: Live interactive API docs at `/docs`
- **Postman collection**: Provided for quick testing
- **CORS and logging enabled**
- **Hot reload**: Use `npm run dev` (with nodemon) for immediate backend updates

---

## 🛠️ Quickstart

1. **Clone this repo & install dependencies**
   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   npm install