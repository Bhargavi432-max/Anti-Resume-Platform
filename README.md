#  Anti-Resume Platform

The **Anti-Resume Platform** is a unique approach to evaluating talent beyond the traditional resume. It allows users to showcase their skills, projects, and contributions without relying on formal qualifications or standardized resumes.

---

##  Project Overview

Traditional resumes don't always capture a candidate’s true potential. The Anti-Resume Platform empowers individuals to highlight their real-world skills and creative work, making hiring more inclusive and merit-based.

---

##  Key Features & Technologies

### 🔹 Frontend
- **React.js**
- **Vite** for fast bundling and dev server
- **JavaScript (ES6+)**
- **CSS Modules**

### 🔹 Backend
- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **Dotenv** for environment configuration

---

##  Setup Instructions

###  Clone the Repository

```bash
git clone https://github.com/your-username/Anti-Resume-Platform.git
cd Anti-Resume-Platform
```

---

###  Backend Setup

```bash
cd Backend
npm install
```

####  Start Backend Server

```bash
node server.js
```

Or use nodemon if installed:

```bash
npx nodemon server.js
```

---

###  Frontend Setup

```bash
cd ../Frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

####  Run the Frontend App

```bash
npm run dev
```

Open your browser and go to:  
```
http://localhost:5173/
```

---

##  Folder Structure

```bash
Anti-Resume-Platform/
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── .env
│   ├── server.js
│   └── package.json
└── Frontend/
    ├── public/
    ├── src/
    ├── index.html
    ├── vite.config.js
    └── package.json
```
