# Project Management Tool with Predictive Analytics Models for Forecasting Software Project Timelines

This is a full-stack, modular project management system developed as part of an academic research project. The system integrates predictive analytics, real-time delay forecasting, gamified task management, and a user-centered interface to enhance the planning, monitoring, and execution of software projects.

## 🚀 Project Overview

The platform aims to solve key challenges in modern software project management, including:

- Inaccurate forecasting of project timelines, defects, and effort.
- Lack of developer motivation and team engagement.
- Delayed detection of project risks and schedule overruns.
- Poor user experience and limited project visibility.

## 🔍 Core Features

### 1. Predictive Analytics (ML-Driven)
- **Timeline Prediction** – Random Forest model forecasts project duration.
- **Defect Prediction** – Predicts defect counts using project and code metrics.
- **Effort Estimation** – Estimates total effort hours using the Desharnais dataset.
- **Task Allocation** – Recommends best-fit teams using ensemble classification (XGBoost + Random Forest).
- **AI Assistant (Gemini API)** – Offers LLM-powered estimations and explanations for duration, risk, and defect count.

### 2. Delay Prediction Component
- Binary classification model predicts task delay probability.
- Regression model estimates delay duration (in days).
- Integrated into CI/CD-like workflows with real-time supervisor alerts.

### 3. Gamification Engine
- Experience points (XP), skill tree unlocks, badges, and leaderboards.
- Motivation-driven design to increase productivity and accountability.
- React-based dynamic notifications and progression feedback.

### 4. UI/UX Dashboard
- Built using React.js + Tailwind CSS.
- Modular, responsive dashboards tailored for developers and project managers.
- Accessible and intuitive layout with progressive disclosure of predictive insights.

---

## 🧠 Technical Stack

| Layer        | Technology                             |
|--------------|----------------------------------------|
| Frontend     | React.js, TailwindCSS, Chart.js        |
| Backend APIs | Flask, FastAPI, Node.js (Express)      |
| Database     | MongoDB Atlas, MySQL                   |
| ML Models    | Scikit-learn, XGBoost, SHAP, Joblib    |
| Testing      | Postman, Jest, PyTest, axe-core        |
| AI Assistant | Gemini API (Google GenAI SDK)          |

---