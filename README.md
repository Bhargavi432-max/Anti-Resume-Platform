# Anti-Resume Platform

The **Anti-Resume Platform** is a web-based application that breaks the traditional hiring mold. It empowers candidates to showcase their real-world projects, skills, and accomplishments without relying on a standard resume. Built with modern web technologies, it facilitates a more inclusive and skill-based hiring process.


##  Overview

Most resumes don’t tell the full story. The Anti-Resume Platform allows individuals to express their true potential through project portfolios, skill ratings, and self-described journeys. Whether you're a self-taught developer, a designer with real-world work, or someone breaking into tech, this platform is built for you.


##  Features

- **Project Portfolio Uploads**: Showcase your work through GitHub links, images, and descriptions.
- **Skill-Based Profiles**: Rate your strengths across tech stacks or creative tools.
- **Custom Testimonials**: Add reviews or endorsements that validate your talent.
- **No Resume Uploads**: This platform intentionally avoids traditional resume files.
- **Admin CRUD System**: Manage users, portfolios, and skill categories.
- **Modern UI/UX**: Clean, intuitive interface to explore candidate profiles.


##  Technologies Used

###  Frontend
- **React.js** – Component-based UI development.
- **HTML/CSS** – Semantic structure and responsive design.
- **Vite** – Lightweight dev server and bundler for React apps.

###  Backend
- **Node.js** – Server-side runtime.
- **Express.js** – Fast backend API handling.
- **MongoDB** – NoSQL database for storing user data, projects, and skills.
- **Mongoose** – ODM for interacting with MongoDB.

###  Other Libraries
- `react-router-dom` – Client-side routing
- `dotenv` – Environment variable handling
- `cors` – Middleware for handling cross-origin requests

---

##  Installation

To get started with this project locally, follow the steps below.

### 1. Clone the Repository

```bash
git clone https://github.com/Bhargavi432-max/Anti-Resume-Platform
cd Anti-Resume-Platform
```

---

### 2. Install Dependencies

#### Frontend

```bash
cd Frontend
npm install
```

#### Backend

```bash
cd ../Backend
npm install
```

---

### 3. Configure Environment Variables

Inside the `Backend` directory, create a `.env` file with the following:

```
MONGODB_URI=your_mongodb_connection_string
PORT=your_desired_backend_port (e.g., 5000)
```

Replace the MongoDB URI with your local or MongoDB Atlas connection string.

---

### 4. Start Development Servers

#### Backend

```bash
cd Backend
node server.js
```

(Or use `nodemon` for auto-reloading.)

#### Frontend

```bash
cd ../Frontend
npm run dev
```

By default:
- Frontend runs at: [http://localhost:5173]
- Backend runs at: [http://localhost:5000]

---

## Project Structure

```bash
Anti-Resume-Platform/
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── server.js
│   ├── package.json
│   └── .env
└── Frontend/
    ├── public/
    ├── src/
    ├── index.html
    ├── vite.config.js
    ├── package.json
```

---

## API Integration

Currently, the backend handles RESTful APIs for managing user profiles, portfolios, and skills. It supports full CRUD operations. Future integration possibilities include:

- Skill match scoring using specific algorithm
- Candidates complete skill-based challenges instead of submitting resumes
- Companies post real work samples instead of generic job descriptions
- Blind initial matching process to eliminate bias
- Transparent salary data and company culture metrics
- Post-hire feedback loop that improves future matching

---

## How It Works

1. **Homepage** – User is introduced to the concept and can sign up or log in.
2. **Profile Setup** – Add skills, project details, and personal bio.
3. **QR Code Sharing (Future Feature)** – Generate sharable QR codes for unique profile links.
4. **Admin Panel** – Manage users and submissions from a centralized dashboard.

---

##  Contributing

We welcome contributions to make the platform better!

### How to Contribute:
- Fork the repository
- Create a new branch:  
  `git checkout -b feature/your-feature-name`
- Make your changes and commit:  
  `git commit -m "Add your feature"`
- Push to GitHub:  
  `git push origin feature/your-feature-name`
- Create a Pull Request

---

