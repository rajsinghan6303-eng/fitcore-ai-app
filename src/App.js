import React, { useState, useEffect } from "react";

// ---------- MOCK DATA ----------
const FOOD_DB = [
  { name: "Chicken Breast (100g)", cal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Brown Rice (100g)", cal: 111, protein: 2.6, carbs: 23, fat: 0.9 },
  { name: "Paneer (100g)", cal: 265, protein: 18, carbs: 1.2, fat: 20 },
  { name: "Whole Eggs (1)", cal: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: "Oats (100g)", cal: 389, protein: 17, carbs: 66, fat: 7 },
];

const WORKOUT_PLANS = {
  Push: [
    { exercise: "Bench Press", sets: "4x8", muscle: "Chest" },
    { exercise: "Overhead Press", sets: "3x10", muscle: "Shoulders" },
  ],
  Pull: [
    { exercise: "Pull-ups", sets: "4x8", muscle: "Back" },
    { exercise: "Barbell Rows", sets: "4x10", muscle: "Lats" },
  ],
  Legs: [
    { exercise: "Squats", sets: "4x8", muscle: "Quads" },
    { exercise: "Lunges", sets: "3x12", muscle: "Glutes" },
  ],
};

const WEEK_PLAN = ["Push", "Pull", "Legs", "Rest", "Push", "Pull", "Legs"];

function calcBMI(w, h) {
  return (w / (h / 100) ** 2).toFixed(1);
}
function calcBMR(w, h, a, g) {
  const base = 10 * w + 6.25 * h - 5 * a;
  return Math.round(g === "male" ? base + 5 : base - 161);
}
function calcCalories(bmr, goal) {
  if (goal === "Fat Loss") return Math.round(bmr * 1.35);
  if (goal === "Muscle Gain") return Math.round(bmr * 1.65);
  return Math.round(bmr * 1.55);
}

// ---------- GENERIC COMPONENTS ----------
const GlassCard = ({ children, style }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 16,
      padding: 16,
      backdropFilter: "blur(8px)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "#00FF88",
        color: "#000",
        padding: "12px 16px",
        borderRadius: 8,
        fontWeight: 600,
      }}
    >
      {message}
    </div>
  );
};

// ---------- SCREENS ----------
function LandingScreen({ onStartUser, onStartGym }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0B1D3A,#000)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: 48, marginBottom: 4 }}>FITCORE AI</h1>
      <p style={{ color: "rgba(255,255,255,0.6)" }}>
        The fitness intelligence platform for users & gyms
      </p>
      <div style={{ marginTop: 40, display: "flex", gap: 16 }}>
        <button
          onClick={onStartUser}
          style={{
            padding: "14px 24px",
            background: "#00FF88",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
        <button
          onClick={onStartGym}
          style={{
            padding: "14px 24px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Gym Owner Portal
        </button>
      </div>
    </div>
  );
}

function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    goal: "",
  });

  const questions = [
    { label: "What's your name?", field: "name", type: "text" },
    { label: "Age", field: "age", type: "number" },
    { label: "Height (cm)", field: "height", type: "number" },
    { label: "Weight (kg)", field: "weight", type: "number" },
  ];
  const isLast = step === questions.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B1D3A",
        color: "#fff",
        padding: 24,
      }}
    >
      <GlassCard style={{ maxWidth: 420, margin: "80px auto" }}>
        {!isLast ? (
          <>
            <h2>{questions[step].label}</h2>
            <input
              type={questions[step].type}
              value={data[questions[step].field]}
              onChange={(e) =>
                setData({ ...data, [questions[step].field]: e.target.value })
              }
              style={{
                width: "100%",
                padding: 12,
                marginTop: 12,
                borderRadius: 8,
                border: "none",
              }}
            />
            <button
              onClick={() => setStep((s) => s + 1)}
              style={{
                marginTop: 20,
                padding: 12,
                borderRadius: 8,
                background: "#00FF88",
                border: "none",
                fontWeight: 700,
              }}
            >
              Continue →
            </button>
          </>
        ) : (
          <>
            <h2>Select Gender</h2>
            <div style={{ display: "flex", gap: 12 }}>
              {["male", "female"].map((g) => (
                <button
                  key={g}
                  onClick={() => setData({ ...data, gender: g })}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 8,
                    background:
                      data.gender === g ? "#00FF88" : "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "#000",
                    fontWeight: 700,
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            <h2 style={{ marginTop: 24 }}>Goal</h2>
            <div style={{ display: "flex", gap: 12 }}>
              {["Fat Loss", "Muscle Gain", "Maintenance"].map((g) => (
                <button
                  key={g}
                  onClick={() => setData({ ...data, goal: g })}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 8,
                    background:
                      data.goal === g ? "#00FF88" : "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "#000",
                    fontWeight: 700,
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            <button
              onClick={() => onComplete(data)}
              style={{
                marginTop: 24,
                width: "100%",
                padding: 14,
                borderRadius: 8,
                background: "#00FF88",
                border: "none",
                fontWeight: 800,
              }}
            >
              Generate My Plan
            </button>
          </>
        )}
      </GlassCard>
    </div>
  );
}

function UserDashboard({ user }) {
  const bmr = calcBMR(+user.weight, +user.height, +user.age, user.gender);
  const targetCal = calcCalories(bmr, user.goal);
  const bmi = calcBMI(+user.weight, +user.height);
  const today = new Date().getDay();
  const todayPlan = WEEK_PLAN[today];

  return (
    <div style={{ color: "#fff", padding: 24 }}>
      <h2>Welcome, {user.name}</h2>
      <p>
        BMI {bmi} BMR {bmr} kcal Goal {user.goal}
      </p>

      <GlassCard style={{ marginBottom: 20 }}>
        <h3>Today's Workout: {todayPlan}</h3>
        {todayPlan !== "Rest" ? (
          <ul>
            {WORKOUT_PLANS[todayPlan].map((x) => (
              <li key={x.exercise}>
                {x.exercise} — {x.sets} ({x.muscle})
              </li>
            ))}
          </ul>
        ) : (
          <p>Rest / Recovery Day</p>
        )}
      </GlassCard>

      <GlassCard>
        <h3>Daily Target Calories</h3>
        <p style={{ fontSize: 32, color: "#00FF88" }}>{targetCal} kcal</p>
      </GlassCard>
    </div>
  );
}

function GymDashboard() {
  const leads = [
    { name: "Arjun Sharma", goal: "Muscle Gain", activity: "High" },
    { name: "Priya Mehta", goal: "Fat Loss", activity: "Medium" },
  ];
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0a1628,#000)",
        color: "#fff",
        padding: 24,
      }}
    >
      <h2>Gym Owner Dashboard</h2>
      {leads.map((l, i) => (
        <GlassCard key={i}>
          <strong>{l.name}</strong> — {l.goal} ({l.activity})
        </GlassCard>
      ))}
    </div>
  );
}

// ---------- ROOT ----------
export default function App() {
  const [mode, setMode] = useState("landing"); // landing | onboarding | user | gym
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  if (mode === "landing")
    return (
      <LandingScreen
        onStartUser={() => setMode("onboarding")}
        onStartGym={() => setMode("gym")}
      />
    );

  if (mode === "onboarding")
    return (
      <OnboardingScreen
        onComplete={(d) => {
          setUser(d);
          setMode("user");
          showToast("Personalized plan generated ✅");
        }}
      />
    );

  if (mode === "gym") return <GymDashboard />;

  if (mode === "user")
    return (
      <>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        <UserDashboard user={user} />
      </>
    );

  return null;
}
