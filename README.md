# EcoSync 🌱 - AI-Powered Carbon Footprint Tracker

EcoSync is a full-stack personal carbon footprint tracker that monitors daily CO₂ emissions from transportation, diet, and energy usage. Using historical logging and **Google Gemini AI**, the application analyzes your emission patterns and provides personalized, actionable recommendations to help reduce your carbon footprint.

---

## 🚀 Key Features

*   **Daily Activity Logging**: Easily input daily commute mode and distance, meal preferences (meat-heavy, vegetarian, vegan), and household energy consumption (kWh).
*   **Carbon Engine**: Automatic calculation of CO₂ impact based on standard environmental coefficients (e.g., commute modes and diet types).
*   **Historical Analytics**: Responsive dashboards with interactive line charts showing your daily emissions trend over the last 7 days using [Recharts](https://recharts.org/).
*   **Smart AI Suggestions**: Direct integration with Google Gemini AI (`gemini-2.5-flash`) that analyzes your last 5 activity logs to produce 3 punchy, personalized, and actionable carbon reduction bullets (under 100 words).
*   **Modern Full-Stack Architecture**: Built on top of **Bun**, leveraging **ElysiaJS** for an ultra-fast backend and **Vite + React + TS** for a sleek frontend.

---

## 🛠️ Tech Stack

*   **Runtime**: [Bun](https://bun.sh/) (Backend server runtime, package manager)
*   **Backend Framework**: [ElysiaJS](https://elysiajs.com/) (Fast, TypeScript-first web framework)
*   **Frontend Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
*   **Database**: [Supabase](https://supabase.com/) (PostgreSQL backend with built-in client libraries)
*   **AI Integration**: [Google Gemini Developer API](https://ai.google.dev/) (`gemini-2.5-flash`)
*   **Charts & Visualization**: [Recharts](https://recharts.org/)

---

## 📁 Repository Structure

```text
eco-tracker-bun/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers and emission formulas
│   │   │   ├── carbonEngine.ts         # Logic for calculating CO2 emissions
│   │   │   ├── footprintController.ts  # Daily activity logs CRUD endpoints
│   │   │   └── insightsController.ts   # Integration with Gemini AI
│   │   ├── db/               # Supabase database initialization
│   │   │   └── supabase.ts
│   │   └── index.ts          # Server entry point
│   ├── .env                  # Backend credentials (Supabase, Gemini)
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/       # UI Components
    │   │   ├── AiInsights.tsx  # Gemini recommendations panel
    │   │   ├── Dashboard.tsx   # Dashboard wrapper & Recharts configuration
    │   │   └── LogActivity.tsx # Form to input daily logs
    │   ├── services/
    │   │   └── api.ts          # API fetch services and endpoint config
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css           # Styling
    ├── package.json
    └── vite.config.ts
```

---

## 🗄️ Database Setup (Supabase)

To support daily activity logs and analytics, you need to set up a table named `footprint_logs` in your Supabase SQL Editor. Use the following schema:

```sql
CREATE TABLE footprint_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    logged_at DATE NOT NULL,
    commute_mode TEXT CHECK (commute_mode IN ('car', 'public_transport', 'bike', 'walk')),
    commute_distance_km NUMERIC DEFAULT 0,
    meal_type TEXT CHECK (meal_type IN ('meat_heavy', 'vegetarian', 'vegan')),
    energy_kwh NUMERIC DEFAULT 0,
    total_co2_kg NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Unique constraint ensures only one log exists per user per day (supports upserts)
    UNIQUE (user_id, logged_at)
);
```

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have [Bun](https://bun.sh/) installed on your machine.

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    bun install
    ```
3.  Create a `.env` file in the `backend/` directory:
    ```env
    PORT=3000
    SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
4.  Run the backend server in development mode:
    ```bash
    bun run dev
    ```
    The server will start on `http://localhost:3000`.

### 2. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    bun install
    ```
3.  Ensure the API endpoint base URL matches `http://localhost:3000/api/v1` in `frontend/src/services/api.ts`.
4.  Run the React application locally:
    ```bash
    bun run dev
    ```
    The app will start on `http://localhost:5173`.

---

## 🔌 API Endpoints

### 1. Log Daily Footprint
*   **Route**: `POST /api/v1/footprint/log`
*   **Body**:
    ```json
    {
      "userId": "7622df75-5bde-42f9-b2d3-aaa69d13e506",
      "commuteMode": "car",
      "commuteDistanceKm": 25,
      "mealType": "meat_heavy",
      "energyKwh": 8.5
    }
    ```
*   **Response**: Inserts/updates the log for the day and returns calculated `total_co2_kg`.

### 2. Historical Logs
*   **Route**: `GET /api/v1/footprint/history/:userId`
*   **Response**: Returns the last 7 daily logs for dashboard trends.

### 3. AI Suggestions
*   **Route**: `GET /api/v1/insights/:userId`
*   **Response**: Returns 3 concise bullets generated by Gemini based on user's recent emission history.

---

## ⚡ Emission Formula Coefficients

EcoSync calculates your daily footprint using standard climate estimation factors:
*   **Transport (CO₂ per km)**: `car` (0.170kg), `public_transport` (0.040kg), `bike` / `walk` (0.0kg).
*   **Diet (CO₂ per day average)**: `meat_heavy` (3.0kg), `vegetarian` (1.2kg), `vegan` (0.7kg).
*   **Electricity**: Average grid emission factor is calculated at `0.4kg` of CO₂ per `1.0 kWh`.
