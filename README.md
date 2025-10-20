# 🧠 EDU_MASTER – Learning Management System (LMS)

## 📘 Overview

**EDU_MASTER** is a full-featured Learning Management System that allows administrators and students to manage lessons, exams, and results in an interactive way.  
It provides an intuitive dashboard, real-time validations, and smooth UI interactions using modern web technologies.

---

## 🚀 Features

### 🧑‍🏫 Admin Features

- Manage **Lessons** (Add / Update / Delete / View All)
- Manage **Questions** (MCQ, True/False, and Short Answers)
- Create and manage **Exams** (Add / Update / Delete / Get All / Get Specific)
- Manage **Users** and **Admins**

### 🎓 Student Features

- View enrolled lessons and purchased courses.
- Start and submit exams.
- View exam results and progress.
- Authentication using **JWT** (Login / Register).
- Protected routes for authorized users only.

### 💻 Frontend Features

- Built with **React.js** and **Tailwind CSS** for fast, responsive design.
- **Redux Toolkit** for state management.
- **Context API** for global data sharing.
- **Formik** + **Yup** for dynamic forms and validation.
- **SweetAlert2** for elegant confirmation dialogs (delete, submit, etc.).
- **JWT Decode** to extract and use student info securely.
- Loading and pagination for better UX.

---

## 🧩 Tech Stack

| Layer                      | Technologies                                |
| -------------------------- | ------------------------------------------- |
| **Frontend**               | React.js, Vite, Tailwind CSS                |
| **State Management**       | Redux Toolkit, Context API                  |
| **Form Handling**          | Formik + Yup                                |
| **Alerts & Notifications** | SweetAlert2, React Hot Toast                |
| **Authentication**         | JWT (JSON Web Tokens)                       |
| **API Testing**            | Postman                                     |
| **Backend (API)**          | Express.js / Node.js (based on your routes) |

---

## 🧰 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/edu-master.git
cd edu-master

# Install dependencies
npm install

# Start the development server
npm run dev
```
