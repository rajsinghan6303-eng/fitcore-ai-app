/* eslint-disable */
import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
 bg: "#080E1A",
 card: "rgba(255,255,255,0.04)",
 border: "rgba(255,255,255,0.07)",
 borderGlow: "rgba(0,255,136,0.2)",
 accent: "#00FF88",
 accentDim: "rgba(0,255,136,0.15)",
 blue: "#4A9EFF",
 orange: "#FF6B35",
 yellow: "#FBBF24",
 red: "#F87171",
 purple: "#A78BFA",
 text: "#FFFFFF",
 textDim: "rgba(255,255,255,0.45)",
 textFaint: "rgba(255,255,255,0.2)",
};

const GLOBAL_STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
 *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 body { background: ${C.bg}; font-family: 'Outfit', sans-serif; color: ${C.text}; overflow-x: hidden; }
 ::-webkit-scrollbar { width: 4px; }
 ::-webkit-scrollbar-track { background: transparent; }
 ::-webkit-scrollbar-thumb { background: rgba(0,255,136,0.3); border-radius: 4px; }
 input, button { font-family: 'Outfit', sans-serif; }
 input::placeholder { color: rgba(255,255,255,0.25); }
 @keyframes float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.02)} }
 @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
 @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
 @keyframes slideUp { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
 @keyframes slideIn { from{transform:translateX(-20px);opacity:0} to{transform:translateX(0);opacity:1} }
 @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(0,255,136,0.2)} 50%{box-shadow:0 0 40px rgba(0,255,136,0.5)} }
 @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
 @keyframes confettiFall { from{transform:translateY(-20px) rotate(0deg);opacity:1} to{transform:translateY(110vh) rotate(720deg);opacity:0} }
 @keyframes countUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
 @keyframes ripple { 0%{transform:scale(0);opacity:1} 100%{transform:scale(4);opacity:0} }
 @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
 .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
 .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
 .hover-glow:hover { border-color: rgba(0,255,136,0.4) !important; box-shadow: 0 0 30px rgba(0,255,136,0.1) !important; }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const FOOD_DB = [
 { name: "Chicken Breast (100g)", cal: 165, protein: 31, carbs: 0, fat: 3.6, category: "Protein" },
 { name: "Brown Rice (100g)", cal: 111, protein: 2.6, carbs: 23, fat: 0.9, category: "Carbs" },
 { name: "Paneer (100g)", cal: 265, protein: 18, carbs: 1.2, fat: 20, category: "Protein" },
 { name: "Whole Eggs (1 egg)", cal: 78, protein: 6, carbs: 0.6, fat: 5, category: "Protein" },
 { name: "Oats (100g)", cal: 389, protein: 17, carbs: 66, fat: 7, category: "Carbs" },
 { name: "Dal (100g cooked)", cal: 116, protein: 9, carbs: 20, fat: 0.4, category: "Protein" },
 { name: "Banana (1 medium)", cal: 89, protein: 1.1, carbs: 23, fat: 0.3, category: "Fruit" },
 { name: "Greek Yogurt (100g)", cal: 59, protein: 10, carbs: 3.6, fat: 0.4, category: "Dairy" },
 { name: "Almonds (30g)", cal: 174, protein: 6, carbs: 6, fat: 15, category: "Fats" },
 { name: "Sweet Potato (100g)", cal: 86, protein: 1.6, carbs: 20, fat: 0.1, category: "Carbs" },
 { name: "Whey Protein (1 scoop)", cal: 120, protein: 25, carbs: 3, fat: 1.5, category: "Supplement" },
 { name: "Chapati (1 piece)", cal: 104, protein: 3, carbs: 18, fat: 2.5, category: "Carbs" },
 { name: "Salmon (100g)", cal: 208, protein: 20, carbs: 0, fat: 13, category: "Protein" },
 { name: "Avocado (100g)", cal: 160, protein: 2, carbs: 9, fat: 15, category: "Fats" },
 { name: "Milk (200ml)", cal: 122, protein: 6.4, carbs: 9.6, fat: 6.6, category: "Dairy" },
];

const BADGES = [
 { id: "streak7", icon: " ", label: "7-Day Streak", xp: 100, earned: true, desc: "Train 7 days straight" },
 { id: "streak30", icon: " ", label: "30-Day Streak", xp: 500, earned: false, desc: "Train 30 days straight" },
 { id: "firstlog", icon: " ", label: "First Log", xp: 50, earned: true, desc: "Log your first meal" },
 { id: "lostkg", icon: " ", label: "Lost 5kg", xp: 300, earned: false, desc: "Lose 5kg from start" },
 { id: "social", icon: " ", label: "Social Share", xp: 75, earned: true, desc: "Share your progress" },
 { id: "scan10", icon: " ", label: "10 Food Scans", xp: 150, earned: false, desc: "Scan 10 different foods" },
 { id: "perfect", icon: " ", label: "Perfect Week", xp: 200, earned: false, desc: "Hit all goals for 7 days" },
 { id: "early", icon: " ", label: "Early Bird", xp: 80, earned: true, desc: "Log breakfast before 8am" },
 { id: "hydro", icon: " ", label: "Hydration Hero", xp: 60, earned: false, desc: "Hit water goal 5 days" },
];

const GYM_LEADS = [
 { id: 1, name: "Arjun Sharma", goal: "Muscle Gain", activity: "High", score: "Hot", status: "New", age: 24, phone: "+91 98765 43210", joined: "Today" },
 { id: 2, name: "Priya Mehta", goal: "Fat Loss", activity: "Medium", score: "Warm", status: "Contacted", age: 29, phone: "+91 87654 32109", joined: "Yesterday" },
 { id: 3, name: "Rohit Verma", goal: "Maintenance", activity: "Low", score: "Cold", status: "New", age: 35, phone: "+91 76543 21098", joined: "2 days ago" },
 { id: 4, name: "Sneha Patel", goal: "Fat Loss", activity: "High", score: "Hot", status: "Converted", age: 22, phone: "+91 65432 10987", joined: "3 days ago" },
 { id: 5, name: "Karan Joshi", goal: "Muscle Gain", activity: "Medium", score: "Warm", status: "Contacted", age: 27, phone: "+91 54321 09876", joined: "4 days ago" },
 { id: 6, name: "Anita Singh", goal: "Fat Loss", activity: "High", score: "Hot", status: "New", age: 31, phone: "+91 43210 98765", joined: "Today" },
];

const WORKOUT_PLANS = {
 push: [
 { exercise: "Bench Press", sets: "4×8", rest: "90s", muscle: "Chest", intensity: "Heavy" },
 { exercise: "Overhead Press", sets: "3×10", rest: "75s", muscle: "Shoulders", intensity: "Moderate" },
 { exercise: "Incline DB Press", sets: "3×12", rest: "60s", muscle: "Upper Chest", intensity: "Moderate" },
 { exercise: "Cable Flyes", sets: "3×15", rest: "45s", muscle: "Chest", intensity: "Light" },
 { exercise: "Tricep Dips", sets: "3×15", rest: "60s", muscle: "Triceps", intensity: "Moderate" },
 { exercise: "Lateral Raises", sets: "4×15", rest: "45s", muscle: "Shoulders", intensity: "Light" },
 ],
 pull: [
 { exercise: "Pull-ups", sets: "4×8", rest: "90s", muscle: "Back", intensity: "Heavy" },
 { exercise: "Barbell Rows", sets: "4×10", rest: "75s", muscle: "Lats", intensity: "Heavy" },
 { exercise: "Cable Rows", sets: "3×12", rest: "60s", muscle: "Mid Back", intensity: "Moderate" },
 { exercise: "Face Pulls", sets: "3×15", rest: "45s", muscle: "Rear Delts", intensity: "Light" },
 { exercise: "Hammer Curls", sets: "3×12", rest: "60s", muscle: "Biceps", intensity: "Moderate" },
 { exercise: "Reverse Flyes", sets: "3×15", rest: "45s", muscle: "Rear Delts", intensity: "Light" },
 ],
 legs: [
 { exercise: "Squats", sets: "4×8", rest: "120s", muscle: "Quads", intensity: "Heavy" },
 { exercise: "Romanian Deadlift", sets: "3×10", rest: "90s", muscle: "Hamstrings", intensity: "Heavy" },
 { exercise: "Leg Press", sets: "3×12", rest: "75s", muscle: "Quads", intensity: "Moderate" },
 { exercise: "Walking Lunges", sets: "3×20", rest: "60s", muscle: "Glutes", intensity: "Moderate" },
 { exercise: "Leg Curls", sets: "3×15", rest: "45s", muscle: "Hamstrings", intensity: "Light" },
 { exercise: "Calf Raises", sets: "4×20", rest: "45s", muscle: "Calves", intensity: "Light" },
 ],
};

const WEEK_PLAN = ["Push", "Pull", "Legs", "Rest", "Push", "Pull", "Legs"];

const SUPPLEMENTS = {
 "Fat Loss": [
 { name: "Whey Protein", dose: "20g as meal replacement", icon: " ", timing: "Post-workout", benefit: "Preserve muscle while cutting" },
 { name: "L-Carnitine", dose: "1g before cardio", icon: " ", timing: "Pre-workout", benefit: "Enhanced fat oxidation" },
 { name: "CLA", dose: "3g with meals", icon: " ", timing: "With meals", benefit: "Body composition support" },
 { name: "Multivitamin", dose: "1 tablet with breakfast", icon: " ", timing: "Morning", benefit: "Fill nutritional gaps" },
 ],
 "Muscle Gain": [
 { name: "Whey Protein", dose: "25g post-workout", icon: " ", timing: "Post-workout", benefit: "Muscle protein synthesis" },
 { name: "Creatine", dose: "5g daily with water", icon: " ", timing: "Any time", benefit: "Strength & power output" },
 { name: "Beta-Alanine", dose: "3.2g pre-workout", icon: " ", timing: "Pre-workout", benefit: "Endurance & muscle buffering" },
 { name: "Multivitamin", dose: "1 tablet with breakfast", icon: " ", timing: "Morning", benefit: "Recovery support" },
 ],
 "Maintenance": [
 { name: "Whey Protein", dose: "20g as needed", icon: " ", timing: "As needed", benefit: "Meet protein targets" },
 { name: "Omega-3", dose: "2g with meals", icon: " ", timing: "With meals", benefit: "Heart & joint health" },
 { name: "Vitamin D3", dose: "2000 IU daily", icon: " ", timing: "Morning", benefit: "Immune & bone health" },
 { name: "Multivitamin", dose: "1 tablet with breakfast", icon: " ", timing: "Morning", benefit: "Overall wellness" },
 ],
};

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const calcBMI = (w, h) => (w / ((h / 100) ** 2)).toFixed(1);
const calcBMR = (w, h, a, g) => g === "male"
 ? Math.round(10 * w + 6.25 * h - 5 * a + 5)
 : Math.round(10 * w + 6.25 * h - 5 * a - 161);
const calcCalories = (bmr, goal) => {
 if (goal === "Fat Loss") return Math.round(bmr * 1.55 * 0.82);
 if (goal === "Muscle Gain") return Math.round(bmr * 1.55 * 1.12);
 return Math.round(bmr * 1.55);
};
const getBMICategory = (bmi) => {
 if (bmi < 18.5) return { label: "Underweight", color: C.blue };
 if (bmi < 25) return { label: "Healthy", color: C.accent };
 if (bmi < 30) return { label: "Overweight", color: C.yellow };
 return { label: "Obese", color: C.red };
};

// ─── BASE COMPONENTS ──────────────────────────────────────────────────────────
const Card = ({ children, style = {}, glow = false, onClick }) => (
 <div onClick={onClick}
 className={`hover-glow ${onClick ? "hover-lift" : ""}`}
 style={{
 background: C.card,
 backdropFilter: "blur(24px)",
 border: `1px solid ${glow ? C.borderGlow : C.border}`,
 borderRadius: 20,
 padding: 20,
 boxShadow: glow ? "0 0 40px rgba(0,255,136,0.06), 0 8px 40px rgba(0,0,0,0.5)" : "0 4px 24px rgba(0,0,0,0.4)",
 transition: "all 0.25s ease",
 cursor: onClick ? "pointer" : "default",
 ...style,
 }}>
 {children}
 </div>
);

const Pill = ({ label, color = C.accent, size = "sm" }) => (
 <span style={{
 background: `${color}18`,
 border: `1px solid ${color}44`,
 color,
 borderRadius: 30,
 padding: size === "sm" ? "3px 10px" : "5px 14px",
 fontSize: size === "sm" ? 11 : 13,
 fontWeight: 600,
 letterSpacing: 0.3,
 display: "inline-flex",
 alignItems: "center",
 gap: 4,
 }}>{label}</span>
);

const Button = ({ children, onClick, variant = "primary", style = {}, disabled = false }) => {
 const variants = {
 primary: { background: `linear-gradient(135deg, ${C.accent}, #00cc6a)`, color: "#080E1A", border: "none" },
 secondary: { background: "rgba(255,255,255,0.06)", color: C.text, border: `1px solid ${C.border}` },
 danger: { background: "rgba(248,113,113,0.12)", color: C.red, border: "1px solid rgba(248,113,113,0.25)" },
 ghost: { background: "transparent", color: C.textDim, border: "none" },
 };
 return (
 <button onClick={onClick} disabled={disabled}
 style={{
 ...variants[variant],
 padding: "13px 20px",
 borderRadius: 14,
 fontWeight: 700,
 fontSize: 14,
 cursor: disabled ? "not-allowed" : "pointer",
 opacity: disabled ? 0.5 : 1,
 transition: "all 0.2s ease",
 width: "100%",
 letterSpacing: 0.4,
 boxShadow: variant === "primary" ? "0 8px 24px rgba(0,255,136,0.25)" : "none",
 ...style,
 }}>
 {children}
 </button>
 );
};

const ProgressBar = ({ value, max, color = C.accent, height = 6 }) => {
 const pct = Math.min((value / max) * 100, 100);
 return (
 <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: height, overflow: "hidden" }}>
 <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: height, transition: "width 1s ease", boxShadow: `0 0 8px ${color}66` }} />
 </div>
 );
};

const CircleProgress = ({ value, max, color = C.accent, size = 80, label, sub }) => {
 const r = 30, c = 2 * Math.PI * r, pct = Math.min(value / max, 1);
 return (
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
 <div style={{ position: "relative", width: size, height: size }}>
 <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
 <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
 <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
 strokeDasharray={c} strokeDashoffset={c - pct * c} strokeLinecap="round"
 style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${color})` }} />
 </svg>
 <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
 <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{Math.round(pct * 100)}%</span>
 </div>
 </div>
 <div style={{ textAlign: "center" }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{label}</div>
 {sub && <div style={{ fontSize: 10, color: C.textFaint, marginTop: 2 }}>{sub}</div>}
 </div>
 </div>
 );
};

const Toast = ({ msg, type = "success", onClose }) => {
 useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
 const colors = { success: C.accent, error: C.red, info: C.blue };
 const icons = { success: " ", error: " ", info: " " };
 return (
 <div style={{
 position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
 background: `linear-gradient(135deg, rgba(8,14,26,0.95), rgba(8,14,26,0.9))`,
 border: `1px solid ${colors[type]}44`,
 borderRadius: 14, padding: "12px 20px", zIndex: 9999,
 boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${colors[type]}22`,
 animation: "slideUp 0.3s ease",
 display: "flex", alignItems: "center", gap: 10, minWidth: 220,
 }}>
 <span style={{ fontSize: 18 }}>{icons[type]}</span>
 <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{msg}</span>
 </div>
 );
};

const Skeleton = ({ width = "100%", height = 16, radius = 8 }) => (
 <div style={{
 width, height, borderRadius: radius,
 background: "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 100%)",
 backgroundSize: "200% 100%",
 animation: "shimmer 1.5s ease-in-out infinite",
 }} />
);

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
 const [step, setStep] = useState(0);
 const [data, setData] = useState({ name: "", age: "", height: "", weight: "", gender: "male", goal: "Fat Loss", activityLevel: "moderate" });

 const steps = [
 { field: "name", label: "What should we call you?", type: "text", placeholder: "Your name", icon: " " },
 { field: "age", label: "How old are you?", type: "number", placeholder: "Age in years", icon: " " },
 { field: "height", label: "Your height", type: "number", placeholder: "Height in cm (e.g. 175)", icon: " " },
 { field: "weight", label: "Your current weight", type: "number", placeholder: "Weight in kg (e.g. 72)", icon: " " },
 ];

 const isDetails = step === steps.length;
 const isActivity = step === steps.length + 1;
 const isLast = isActivity;

 const canProceed = () => {
 if (isDetails || isActivity) return true;
 return data[steps[step].field]?.trim() !== "";
 };

 return (
 <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 20% 50%, rgba(0,255,136,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(74,158,255,0.06) 0%, transparent 50%), ${C.bg}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>

 {/* Floating orbs */}
 {[0,1,2].map(i => (
 <div key={i} style={{ position: "absolute", borderRadius: "50%", background: `radial-gradient(circle, ${i === 0 ? "rgba(0,255,136,0.08)" : i === 1 ? "rgba(74,158,255,0.06)" : "rgba(167,139,250,0.06)"} 0%, transparent 70%)`, width: [300,200,250][i], height: [300,200,250][i], top: ["-10%","60%","30%"][i], left: ["-5%","70%","-10%"][i], animation: `float ${[7,9,11][i]}s ease-in-out infinite`, animationDelay: `${i * 2}s`, pointerEvents: "none" }} />
 ))}

 <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
 {/* Logo */}
 <div style={{ textAlign: "center", marginBottom: 40 }}>
 <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700, background: "linear-gradient(90deg, #fff 30%, #00FF88)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -1 }}>FITCORE AI</div>
 <div style={{ fontSize: 13, color: C.textDim, marginTop: 6 }}>Your intelligent fitness partner</div>
 </div>

 {/* Step indicators */}
 <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 32 }}>
 {Array.from({ length: steps.length + 2 }, (_, i) => (
 <div key={i} style={{ height: 4, width: i === step ? 28 : 8, borderRadius: 4, background: i <= step ? C.accent : "rgba(255,255,255,0.12)", transition: "all 0.3s ease", boxShadow: i === step ? `0 0 8px ${C.accent}` : "none" }} />
 ))}
 </div>

 {/* Card */}
 <Card glow style={{ animation: "slideUp 0.4s ease" }}>
 {!isDetails && !isActivity ? (
 <>
 <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>{steps[step].icon}</div>
 <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 6, textAlign: "center" }}>{steps[step].label}</div>
 <div style={{ fontSize: 13, color: C.textDim, textAlign: "center", marginBottom: 24 }}>Step {step + 1} of {steps.length + 2}</div>
 <input
 type={steps[step].type}
 placeholder={steps[step].placeholder}
 value={data[steps[step].field]}
 onChange={e => setData({ ...data, [steps[step].field]: e.target.value })}
 autoFocus
 style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "15px 18px", color: C.text, fontSize: 16, outline: "none", marginBottom: 20, transition: "border-color 0.2s", fontFamily: "Outfit, sans-serif" }}
 onFocus={e => e.target.style.borderColor = C.accent}
 onBlur={e => e.target.style.borderColor = C.border}
 onKeyDown={e => e.key === "Enter" && canProceed() && setStep(s => s + 1)}
 />
 </>
 ) : isDetails ? (
 <>
 <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 6 }}>Almost there! </div>
 <div style={{ fontSize: 13, color: C.textDim, marginBottom: 24 }}>Tell us about your body & goals</div>
 <div style={{ marginBottom: 20 }}>
 <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Biological Sex</div>
 <div style={{ display: "flex", gap: 10 }}>
 {[["male", " ", "Male"], ["female", " ", "Female"]].map(([val, sym, lbl]) => (
 <button key={val} onClick={() => setData({ ...data, gender: val })}
 style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${data.gender === val ? C.accent : C.border}`, background: data.gender === val ? C.accentDim : "transparent", color: data.gender === val ? C.accent : C.textDim, fontWeight: 700, cursor: "pointer", fontSize: 14, transition: "all 0.2s", fontFamily: "Outfit" }}>
 {sym} {lbl}
 </button>
 ))}
 </div>
 </div>
 <div style={{ marginBottom: 20 }}>
 <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Primary Goal</div>
 {[["Fat Loss", " ", "Burn fat, reveal muscle"], ["Muscle Gain", " ", "Build strength & size"], ["Maintenance", " ", "Stay fit & healthy"]].map(([g, emoji, desc]) => (
 <button key={g} onClick={() => setData({ ...data, goal: g })}
 style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: `1px solid ${data.goal === g ? C.accent : C.border}`, background: data.goal === g ? C.accentDim : "transparent", color: data.goal === g ? C.accent : C.textDim, fontWeight: 600, cursor: "pointer", textAlign: "left", fontSize: 14, marginBottom: 8, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12, fontFamily: "Outfit" }}>
 <span style={{ fontSize: 18 }}>{emoji}</span>
 <div>
 <div style={{ fontWeight: 700 }}>{g}</div>
 <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 400 }}>{desc}</div>
 </div>
 </button>
 ))}
 </div>
 </>
 ) : (
 <>
 <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 6 }}>Activity Level </div>
 <div style={{ fontSize: 13, color: C.textDim, marginBottom: 24 }}>How active are you outside the gym?</div>
 {[["sedentary", " ", "Sedentary", "Little or no exercise"], ["light", " ", "Lightly Active", "1-3 days/week"], ["moderate", " ", "Moderately Active", "3-5 days/week"], ["very", " ", "Very Active", "6-7 days/week"]].map(([val, emoji, label, desc]) => (
 <button key={val} onClick={() => setData({ ...data, activityLevel: val })}
 style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: `1px solid ${data.activityLevel === val ? C.accent : C.border}`, background: data.activityLevel === val ? C.accentDim : "transparent", color: data.activityLevel === val ? C.accent : C.textDim, fontWeight: 600, cursor: "pointer", textAlign: "left", fontSize: 14, marginBottom: 8, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12, fontFamily: "Outfit" }}>
 <span style={{ fontSize: 20 }}>{emoji}</span>
 <div>
 <div style={{ fontWeight: 700 }}>{label}</div>
 <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 400 }}>{desc}</div>
 </div>
 </button>
 ))}
 </>
 )}

 <Button onClick={() => isLast ? onComplete(data) : setStep(s => s + 1)} disabled={!canProceed()}>
 {isLast ? " Generate My Plan" : "Continue →"}
 </Button>
 </Card>
 </div>
 </div>
 );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing({ onUser, onGym }) {
 return (
 <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 30% 40%, rgba(0,255,136,0.07) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(74,158,255,0.06) 0%, transparent 50%), ${C.bg}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, position: "relative", overflow: "hidden" }}>
 {/* Background elements */}
 <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
 {[0,1,2,3].map(i => (
 <div key={i} style={{ position: "absolute", borderRadius: "50%", background: `radial-gradient(circle, ${["rgba(0,255,136,0.09)","rgba(74,158,255,0.07)","rgba(167,139,250,0.06)","rgba(0,255,136,0.05)"][i]} 0%, transparent 70%)`, width: [400,300,250,200][i], height: [400,300,250,200][i], top: ["-15%","55%","20%","70%"][i], left: ["-10%","65%","-5%","80%"][i], animation: `float ${[8,10,12,9][i]}s ease-in-out infinite`, animationDelay: `${i * 2.5}s`, pointerEvents: "none" }} />
 ))}

 <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400, textAlign: "center" }}>
 {/* Badge */}
 <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)", borderRadius: 30, padding: "6px 14px", fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1, marginBottom: 24, textTransform: "uppercase" }}>
 <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, display: "inline-block", animation: "pulse 2s infinite" }} />
 AI-Powered Fitness Platform
 </div>

 {/* Logo */}
 <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 52, fontWeight: 700, lineHeight: 1, marginBottom: 16 }}>
 <span style={{ background: "linear-gradient(135deg, #ffffff 40%, #00FF88)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FIT</span>
 <span style={{ background: "linear-gradient(135deg, #00FF88, #4AFFB4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CORE</span>
 <div style={{ fontSize: 16, fontWeight: 400, color: C.textDim, letterSpacing: 8, marginTop: 4 }}>AI</div>
 </div>

 <p style={{ fontSize: 16, color: C.textDim, lineHeight: 1.6, marginBottom: 40, maxWidth: 320, margin: "0 auto 40px" }}>
 Premium fitness intelligence for users and gym owners. Personalized plans, smart tracking, and B2B growth tools.
 </p>

 {/* Stats */}
 <div style={{ display: "flex", gap: 0, marginBottom: 40, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
 {[["50K+", "Active Users"], ["300+", "Partner Gyms"], ["4.9★", "App Rating"]].map(([val, lbl], i) => (
 <div key={i} style={{ flex: 1, padding: "14px 8px", textAlign: "center", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
 <div style={{ fontSize: 18, fontWeight: 900, color: C.accent }}>{val}</div>
 <div style={{ fontSize: 10, color: C.textFaint, marginTop: 2 }}>{lbl}</div>
 </div>
 ))}
 </div>

 {/* CTAs */}
 <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
 <Button onClick={onUser}> Get Started — It's Free</Button>
 <Button onClick={onGym} variant="secondary"> Gym Owner Portal →</Button>
 </div>
 </div>
 </div>
 );
}

// ─── USER DASHBOARD ───────────────────────────────────────────────────────────
function Dashboard({ user }) {
 const bmr = calcBMR(+user.weight, +user.height, +user.age, user.gender);
 const targetCal = calcCalories(bmr, user.goal);
 const bmi = calcBMI(+user.weight, +user.height);
 const bmiInfo = getBMICategory(+bmi);
 const todayIdx = new Date().getDay();
 const todayPlan = WEEK_PLAN[todayIdx];
 const caloriesEaten = Math.round(targetCal * 0.72);
 const protein = Math.round((targetCal * 0.3 / 4) * 0.8);
 const targetProtein = Math.round(targetCal * 0.3 / 4);
 const waterConsumed = 1.8;
 const weekData = [1820, 2100, 1950, 2200, Math.round(targetCal * 0.9), caloriesEaten, 0];
 const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
 const maxBar = Math.max(...weekData, targetCal);
 const hour = new Date().getHours();
 const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

 return (
 <div style={{ paddingBottom: 24 }}>
 {/* Hero greeting */}
 <div style={{ background: "linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(74,158,255,0.06) 100%)", borderRadius: 20, padding: "20px 20px 16px", marginBottom: 16, border: `1px solid rgba(0,255,136,0.12)`, position: "relative", overflow: "hidden" }}>
 <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 70%)" }} />
 <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>{greeting} </div>
 <div style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 12 }}>{user.name}</div>
 <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
 <Pill label={`BMI ${bmi} · ${bmiInfo.label}`} color={bmiInfo.color} />
 <Pill label={` ${user.goal}`} color={C.blue} />
 <Pill label=" 12-Day Streak" color={C.orange} />
 </div>
 </div>

 {/* Progress rings */}
 <Card style={{ marginBottom: 16 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: C.textDim, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Today's Progress</div>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
 <CircleProgress value={caloriesEaten} max={targetCal} color={C.accent} size={76} label="Calories" sub={`${caloriesEaten}/${targetCal}`} />
 <CircleProgress value={protein} max={targetProtein} color={C.blue} size={76} label="Protein" sub={`${protein}/${targetProtein}g`} />
 <CircleProgress value={waterConsumed} max={3} color={C.purple} size={76} label="Water" sub={`${waterConsumed}/3L`} />
 </div>
 </Card>

 {/* Macro detail bars */}
 <Card style={{ marginBottom: 16 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: C.textDim, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Macro Breakdown</div>
 {[
 { label: "Calories", val: caloriesEaten, max: targetCal, color: C.accent, unit: "kcal" },
 { label: "Protein", val: protein, max: targetProtein, color: C.blue, unit: "g" },
 { label: "Carbs", val: Math.round(targetCal * 0.45 / 4 * 0.7), max: Math.round(targetCal * 0.45 / 4), color: C.yellow, unit: "g" },
 { label: "Fats", val: Math.round(targetCal * 0.25 / 9 * 0.6), max: Math.round(targetCal * 0.25 / 9), color: C.red, unit: "g" },
 ].map(m => (
 <div key={m.label} style={{ marginBottom: 14 }}>
 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
 <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{m.label}</span>
 <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.val} / {m.max}{m.unit}</span>
 </div>
 <ProgressBar value={m.val} max={m.max} color={m.color} />
 </div>
 ))}
 </Card>

 {/* Today's workout */}
 <Card glow style={{ marginBottom: 16 }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
 <div>
 <div style={{ fontSize: 11, color: C.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 1 }}>Today's Session</div>
 <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{todayPlan} Day {todayPlan !== "Rest" ? " " : " "}</div>
 </div>
 <div style={{ background: C.accentDim, border: `1px solid ${C.borderGlow}`, borderRadius: 12, padding: "8px 14px", color: C.accent, fontSize: 12, fontWeight: 700 }}>
 {todayPlan === "Rest" ? "Recovery" : " Start"}
 </div>
 </div>
 {todayPlan !== "Rest" && (WORKOUT_PLANS[todayPlan.toLowerCase()] || []).slice(0, 3).map((ex, i) => (
 <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 10, marginBottom: 6, border: `1px solid ${C.border}` }}>
 <div>
 <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{ex.exercise}</div>
 <div style={{ fontSize: 11, color: C.textDim }}>{ex.muscle} · Rest {ex.rest}</div>
 </div>
 <div style={{ textAlign: "right" }}>
 <div style={{ fontSize: 13, fontWeight: 800, color: C.accent }}>{ex.sets}</div>
 <div style={{ fontSize: 10, color: C.textFaint }}>{ex.intensity}</div>
 </div>
 </div>
 ))}
 {todayPlan !== "Rest" && <div style={{ textAlign: "center", fontSize: 12, color: C.textFaint, marginTop: 8 }}>+3 more in Plan tab</div>}
 </Card>

 {/* Weekly chart */}
 <Card>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Weekly Calories</div>
 <div style={{ fontSize: 12, color: C.textDim }}>Target: {targetCal} kcal</div>
 </div>
 <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
 {weekData.map((v, i) => {
 const isToday = i === (todayIdx === 0 ? 6 : todayIdx - 1);
 return (
 <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
 <div style={{ width: "100%", height: Math.round((v / maxBar) * 76), background: isToday ? `linear-gradient(180deg, ${C.accent}, #00cc6a)` : "rgba(255,255,255,0.09)", borderRadius: "4px 4px 0 0", minHeight: v > 0 ? 4 : 0, transition: "height 1s ease", boxShadow: isToday ? `0 0 12px ${C.accent}55` : "none" }} />
 <div style={{ fontSize: 9, color: isToday ? C.accent : C.textFaint, fontWeight: isToday ? 700 : 400 }}>{days[i].slice(0,1)}</div>
 </div>
 );
 })}
 </div>
 <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
 <div style={{ flex: 1, background: "rgba(0,255,136,0.06)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
 <div style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>{caloriesEaten}</div>
 <div style={{ fontSize: 10, color: C.textFaint }}>Today</div>
 </div>
 <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
 <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{Math.round(weekData.slice(0,6).filter(v=>v>0).reduce((a,b)=>a+b,0) / weekData.slice(0,6).filter(v=>v>0).length)}</div>
 <div style={{ fontSize: 10, color: C.textFaint }}>Avg/day</div>
 </div>
 <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
 <div style={{ fontSize: 14, fontWeight: 800, color: C.blue }}>{targetCal}</div>
 <div style={{ fontSize: 10, color: C.textFaint }}>Target</div>
 </div>
 </div>
 </Card>
 </div>
 );
}

// ─── PLAN SCREEN ──────────────────────────────────────────────────────────────
function PlanScreen({ user }) {
 const bmr = calcBMR(+user.weight, +user.height, +user.age, user.gender);
 const targetCal = calcCalories(bmr, user.goal);
 const [activeDay, setActiveDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
 const [activeTab, setActiveTab] = useState("workout");
 const todayWorkout = WORKOUT_PLANS[WEEK_PLAN[activeDay].toLowerCase()];

 const DIET = [
 { meal: "Breakfast", time: "7:30 AM", emoji: " ", items: ["4 Egg Whites + 1 Whole Egg", "2 Chapati", "1 Cup Oats", "Green Tea"], cal: Math.round(targetCal * 0.25) },
 { meal: "Mid-Morning", time: "10:30 AM", emoji: " ", items: ["Handful Almonds (30g)", "1 Banana", "Greek Yogurt (100g)"], cal: Math.round(targetCal * 0.12) },
 { meal: "Lunch", time: "1:00 PM", emoji: " ", items: ["200g Chicken Breast", "1 Cup Brown Rice", "Mixed Salad", "Dal (1 cup)"], cal: Math.round(targetCal * 0.32) },
 { meal: "Pre-Workout", time: "4:30 PM", emoji: " ", items: ["1 Scoop Whey Protein", "1 Banana", "Black Coffee"], cal: Math.round(targetCal * 0.1) },
 { meal: "Dinner", time: "7:30 PM", emoji: " ", items: ["200g Paneer or Fish", "Sweet Potato (150g)", "Steamed Vegetables"], cal: Math.round(targetCal * 0.21) },
 ];

 const intensityColors = { Heavy: C.red, Moderate: C.yellow, Light: C.accent };

 return (
 <div style={{ paddingBottom: 24 }}>
 <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Your Plan</div>
 <div style={{ fontSize: 13, color: C.textDim, marginBottom: 20 }}>Personalized for {user.goal}</div>

 {/* Macro targets */}
 <Card glow style={{ marginBottom: 16 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Daily Targets</div>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
 {[
 { label: "Calories", val: targetCal, unit: "kcal", color: C.accent },
 { label: "Protein", val: Math.round(targetCal * 0.3 / 4), unit: "g", color: C.blue },
 { label: "Carbs", val: Math.round(targetCal * 0.45 / 4), unit: "g", color: C.yellow },
 { label: "Fats", val: Math.round(targetCal * 0.25 / 9), unit: "g", color: C.red },
 ].map(m => (
 <div key={m.label} style={{ textAlign: "center", padding: "10px 4px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
 <div style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{m.val}</div>
 <div style={{ fontSize: 9, color: C.textFaint, marginTop: 1 }}>{m.unit}</div>
 <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{m.label}</div>
 </div>
 ))}
 </div>
 </Card>

 {/* Tab switcher */}
 <div style={{ display: "flex", gap: 8, marginBottom: 16, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 4 }}>
 {[["workout", " Workout"], ["diet", " Diet"]].map(([tab, label]) => (
 <button key={tab} onClick={() => setActiveTab(tab)}
 style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: activeTab === tab ? C.accentDim : "transparent", color: activeTab === tab ? C.accent : C.textDim, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s", fontFamily: "Outfit" }}>
 {label}
 </button>
 ))}
 </div>

 {activeTab === "workout" ? (
 <>
 {/* Day selector */}
 <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
 {WEEK_PLAN.map((day, i) => {
 const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
 return (
 <button key={i} onClick={() => setActiveDay(i)}
 style={{ minWidth: 56, padding: "8px 6px", borderRadius: 12, border: `1px solid ${activeDay === i ? C.accent : C.border}`, background: activeDay === i ? C.accentDim : "transparent", color: activeDay === i ? C.accent : C.textDim, fontSize: 11, fontWeight: 700, cursor: "pointer", textAlign: "center", position: "relative", fontFamily: "Outfit", transition: "all 0.2s" }}>
 {isToday && <div style={{ position: "absolute", top: 3, right: 3, width: 5, height: 5, borderRadius: "50%", background: C.accent }} />}
 <div>D{i + 1}</div>
 <div style={{ fontSize: 9, marginTop: 2, opacity: 0.8 }}>{day}</div>
 </button>
 );
 })}
 </div>

 {todayWorkout ? (
 <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
 {todayWorkout.map((ex, i) => (
 <Card key={i} style={{ padding: "14px 16px", animation: `slideIn 0.3s ease ${i * 0.05}s both` }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 3 }}>{ex.exercise}</div>
 <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
 <span style={{ fontSize: 11, color: C.textDim }}>{ex.muscle}</span>
 <span style={{ fontSize: 10, color: C.textFaint }}>·</span>
 <span style={{ fontSize: 11, color: C.textDim }}>Rest {ex.rest}</span>
 <Pill label={ex.intensity} color={intensityColors[ex.intensity]} size="xs" />
 </div>
 </div>
 <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700, color: C.accent }}>{ex.sets}</div>
 </div>
 </Card>
 ))}
 </div>
 ) : (
 <Card style={{ textAlign: "center", padding: 40 }}>
 <div style={{ fontSize: 48, marginBottom: 12 }}> </div>
 <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>Rest Day</div>
 <div style={{ fontSize: 14, color: C.textDim }}>Recovery is where growth happens. Stay hydrated and sleep well!</div>
 </Card>
 )}
 </>
 ) : (
 <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
 {DIET.map((meal, i) => (
 <Card key={i} style={{ padding: 16, animation: `slideIn 0.3s ease ${i * 0.06}s both` }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{meal.emoji}</div>
 <div>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{meal.meal}</div>
 <div style={{ fontSize: 11, color: C.textDim }}>{meal.time}</div>
 </div>
 </div>
 <div style={{ textAlign: "right" }}>
 <div style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>{meal.cal}</div>
 <div style={{ fontSize: 10, color: C.textFaint }}>kcal</div>
 </div>
 </div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
 {meal.items.map((item, j) => (
 <span key={j} style={{ fontSize: 11, color: C.textDim, background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "3px 9px", border: `1px solid ${C.border}` }}>{item}</span>
 ))}
 </div>
 </Card>
 ))}
 </div>
 )}
 </div>
 );
}

// ─── FOOD SCANNER ─────────────────────────────────────────────────────────────
function ScanScreen({ showToast }) {
 const [query, setQuery] = useState("");
 const [log, setLog] = useState([]);
 const [qty, setQty] = useState(1);
 const [activeFilter, setActiveFilter] = useState("All");
 const filters = ["All", "Protein", "Carbs", "Fats", "Dairy", "Fruit", "Supplement"];

 const results = FOOD_DB.filter(f => {
 const matchQuery = f.name.toLowerCase().includes(query.toLowerCase()) && query.length > 0;
 const matchFilter = activeFilter === "All" || f.category === activeFilter;
 return query.length > 0 ? matchQuery && matchFilter : false;
 });

 const totals = log.reduce((a, b) => ({ cal: a.cal + b.cal, protein: a.protein + b.protein, carbs: a.carbs + b.carbs, fat: a.fat + b.fat }), { cal: 0, protein: 0, carbs: 0, fat: 0 });

 const addFood = (food) => {
 setLog(l => [...l, { ...food, cal: Math.round(food.cal * qty), protein: +(food.protein * qty).toFixed(1), carbs: +(food.carbs * qty).toFixed(1), fat: +(food.fat * qty).toFixed(1), qty, id: Date.now() }]);
 setQuery("");
 showToast("Food logged! ", "success");
 };

 const removeFood = (id) => setLog(l => l.filter(x => x.id !== id));

 return (
 <div style={{ paddingBottom: 24 }}>
 <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Food Scanner</div>
 <div style={{ fontSize: 13, color: C.textDim, marginBottom: 20 }}>Log your nutrition with precision</div>

 {/* Summary card */}
 <Card glow style={{ marginBottom: 16 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Today's Intake</div>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
 {[["Calories", totals.cal, C.accent, "kcal"], ["Protein", `${totals.protein}g`, C.blue, ""], ["Carbs", `${totals.carbs}g`, C.yellow, ""], ["Fats", `${totals.fat}g`, C.red, ""]].map(([l, v, c]) => (
 <div key={l} style={{ textAlign: "center", padding: "8px 4px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
 <div style={{ fontSize: 16, fontWeight: 900, color: c }}>{v}</div>
 <div style={{ fontSize: 10, color: C.textFaint, marginTop: 2 }}>{l}</div>
 </div>
 ))}
 </div>
 </Card>

 {/* Search */}
 <Card style={{ marginBottom: 16 }}>
 <div style={{ position: "relative", marginBottom: 12 }}>
 <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}> </span>
 <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search food (e.g. chicken, rice...)"
 style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px 13px 42px", color: C.text, fontSize: 14, outline: "none", fontFamily: "Outfit", transition: "border-color 0.2s" }}
 onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
 </div>

 <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: query.length > 0 ? 12 : 0 }}>
 <span style={{ fontSize: 13, color: C.textDim, whiteSpace: "nowrap" }}>Qty:</span>
 <input type="number" value={qty} min={0.5} max={10} step={0.5} onChange={e => setQty(+e.target.value)}
 style={{ width: 64, background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", color: C.text, fontSize: 14, outline: "none", fontFamily: "Outfit" }} />
 <span style={{ fontSize: 12, color: C.textFaint }}>servings</span>
 </div>

 {results.length > 0 && (
 <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
 {results.slice(0, 6).map((f, i) => (
 <div key={i} onClick={() => addFood(f)}
 style={{ padding: "11px 14px", borderBottom: i < results.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.15s" }}
 onMouseOver={e => e.currentTarget.style.background = "rgba(0,255,136,0.06)"}
 onMouseOut={e => e.currentTarget.style.background = "transparent"}>
 <div>
 <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.name}</div>
 <div style={{ fontSize: 11, color: C.textDim, marginTop: 1 }}>P:{f.protein}g · C:{f.carbs}g · F:{f.fat}g</div>
 </div>
 <div style={{ textAlign: "right" }}>
 <div style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>{Math.round(f.cal * qty)}</div>
 <div style={{ fontSize: 10, color: C.textFaint }}>kcal</div>
 </div>
 </div>
 ))}
 </div>
 )}

 {query.length > 0 && results.length === 0 && (
 <div style={{ textAlign: "center", padding: "20px", color: C.textFaint, fontSize: 13 }}>No results found for "{query}"</div>
 )}
 </Card>

 {/* Logged foods */}
 {log.length > 0 && (
 <>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Logged Today ({log.length})</div>
 <button onClick={() => setLog([])} style={{ fontSize: 12, color: C.red, background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit" }}>Clear all</button>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
 {log.map((item) => (
 <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, animation: "slideIn 0.2s ease" }}>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.name}</div>
 <div style={{ fontSize: 11, color: C.textDim, marginTop: 1 }}>×{item.qty} · P:{item.protein}g C:{item.carbs}g F:{item.fat}g</div>
 </div>
 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 <div style={{ textAlign: "right" }}>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{item.cal} kcal</div>
 </div>
 <button onClick={() => removeFood(item.id)} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(248,113,113,0.15)", border: "none", color: C.red, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
 </div>
 </div>
 ))}
 </div>
 </>
 )}

 {log.length === 0 && query.length === 0 && (
 <div style={{ textAlign: "center", padding: "40px 20px" }}>
 <div style={{ fontSize: 56, marginBottom: 16 }}> </div>
 <div style={{ fontSize: 16, fontWeight: 700, color: C.textDim, marginBottom: 8 }}>Nothing logged yet</div>
 <div style={{ fontSize: 13, color: C.textFaint }}>Search for a food above to start tracking</div>
 </div>
 )}
 </div>
 );
}

// ─── REWARDS SCREEN ───────────────────────────────────────────────────────────
function RewardsScreen({ user, showToast }) {
 const totalXP = BADGES.filter(b => b.earned).reduce((a, b) => a + b.xp, 0);
 const level = Math.min(Math.floor(totalXP / 200) + 1, 10);
 const nextLevelXP = level * 200;
 const [confetti, setConfetti] = useState([]);

 const celebrate = () => {
 const c = Array.from({ length: 40 }, (_, i) => ({
 id: i, x: Math.random() * 100, size: Math.random() * 8 + 6,
 color: [C.accent, C.blue, C.yellow, C.red, C.purple, "#fff"][i % 6],
 delay: Math.random() * 0.5, duration: Math.random() * 2 + 2,
 }));
 setConfetti(c);
 setTimeout(() => setConfetti([]), 3500);
 showToast("Level up celebration! ", "success");
 };

 const levelTitles = ["Rookie", "Beginner", "Trainee", "Athlete", "Warrior", "Champion", "Elite", "Legend", "Master", "God Mode"];

 return (
 <div style={{ paddingBottom: 24, position: "relative" }}>
 {confetti.map(p => (
 <div key={p.id} style={{ position: "fixed", top: -20, left: `${p.x}%`, width: p.size, height: p.size, background: p.color, borderRadius: Math.random() > 0.5 ? "50%" : "2px", animation: `confettiFall ${p.duration}s ease ${p.delay}s forwards`, zIndex: 9998, transform: `rotate(${Math.random() * 360}deg)` }} />
 ))}

 <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Rewards</div>
 <div style={{ fontSize: 13, color: C.textDim, marginBottom: 20 }}>Your achievements & progress</div>

 {/* Level card */}
 <Card glow style={{ marginBottom: 16, background: "linear-gradient(135deg, rgba(0,255,136,0.08), rgba(74,158,255,0.05))" }}>
 <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
 <div onClick={celebrate} style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, #00cc6a)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, cursor: "pointer", boxShadow: `0 0 30px rgba(0,255,136,0.4)`, animation: "breathe 3s ease-in-out infinite", flexShrink: 0 }}> </div>
 <div>
 <div style={{ fontSize: 12, color: C.textDim }}>Current Level</div>
 <div style={{ fontSize: 32, fontWeight: 900, color: C.text, lineHeight: 1 }}>Lv. {level}</div>
 <div style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>{levelTitles[level - 1]}</div>
 </div>
 <div style={{ marginLeft: "auto", textAlign: "right" }}>
 <div style={{ fontSize: 20, fontWeight: 900, color: C.text }}>{totalXP}</div>
 <div style={{ fontSize: 11, color: C.textFaint }}>Total XP</div>
 </div>
 </div>
 <div style={{ marginBottom: 8 }}>
 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
 <span style={{ fontSize: 12, color: C.textDim }}>{totalXP} / {nextLevelXP} XP</span>
 <span style={{ fontSize: 12, color: C.accent }}>{nextLevelXP - totalXP} XP to Level {level + 1}</span>
 </div>
 <ProgressBar value={totalXP} max={nextLevelXP} />
 </div>
 </Card>

 {/* Streak */}
 <Card style={{ marginBottom: 16, textAlign: "center" }}>
 <div style={{ fontSize: 44, marginBottom: 6, animation: "breathe 2s ease-in-out infinite" }}> </div>
 <div style={{ fontSize: 36, fontWeight: 900, color: C.orange }}>12</div>
 <div style={{ fontSize: 14, color: C.textDim, marginBottom: 16 }}>Day Streak — Keep going!</div>
 <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
 {Array.from({ length: 7 }, (_, i) => (
 <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: i < 5 ? "rgba(255,107,53,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${i < 5 ? "rgba(255,107,53,0.4)" : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
 {i < 5 ? " " : ""}
 </div>
 ))}
 </div>
 </Card>

 {/* Badges */}
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Badges ({BADGES.filter(b => b.earned).length}/{BADGES.length})</div>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
 {BADGES.map(b => (
 <div key={b.id} className="hover-lift"
 style={{ background: b.earned ? "linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,255,136,0.04))" : "rgba(255,255,255,0.02)", border: `1px solid ${b.earned ? "rgba(0,255,136,0.25)" : C.border}`, borderRadius: 16, padding: "16px 10px", textAlign: "center", opacity: b.earned ? 1 : 0.45, transition: "all 0.3s ease", cursor: "pointer" }}>
 <div style={{ fontSize: 26, marginBottom: 6 }}>{b.icon}</div>
 <div style={{ fontSize: 11, fontWeight: 700, color: b.earned ? C.accent : "#888", marginBottom: 3 }}>{b.label}</div>
 <div style={{ fontSize: 10, color: C.textFaint, marginBottom: 4 }}>{b.desc}</div>
 <div style={{ fontSize: 10, fontWeight: 600, color: b.earned ? C.accent : "#555" }}>+{b.xp} XP</div>
 </div>
 ))}
 </div>

 {/* Leaderboard */}
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}> Leaderboard</div>
 <Card>
 {[
 { rank: 1, name: "Arjun K.", xp: 3200, badge: " ", streak: 28 },
 { rank: 2, name: user.name, xp: totalXP, badge: " ", streak: 12, isYou: true },
 { rank: 3, name: "Priya M.", xp: 1800, badge: " ", streak: 9 },
 { rank: 4, name: "Rohit V.", xp: 1200, badge: "4.", streak: 5 },
 { rank: 5, name: "Sneha P.", xp: 950, badge: "5.", streak: 3 },
 ].map((e, i) => (
 <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", borderBottom: i < 4 ? `1px solid ${C.border}` : "none", background: e.isYou ? "rgba(0,255,136,0.04)" : "transparent", borderRadius: e.isYou ? 8 : 0 }}>
 <div style={{ fontSize: 18, width: 28, textAlign: "center", flexShrink: 0 }}>{e.badge}</div>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: 14, fontWeight: e.isYou ? 800 : 600, color: e.isYou ? C.accent : C.text }}>{e.name} {e.isYou && <span style={{ fontSize: 11, opacity: 0.7 }}>(You)</span>}</div>
 <div style={{ fontSize: 11, color: C.textFaint }}> {e.streak}-day streak</div>
 </div>
 <div style={{ fontSize: 14, fontWeight: 700, color: e.isYou ? C.accent : C.textDim }}>{e.xp} XP</div>
 </div>
 ))}
 </Card>
 </div>
 );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ user, onSignOut, showToast }) {
 const bmr = calcBMR(+user.weight, +user.height, +user.age, user.gender);
 const bmi = calcBMI(+user.weight, +user.height);
 const bmiInfo = getBMICategory(+bmi);
 const targetCal = calcCalories(bmr, user.goal);
 const supps = SUPPLEMENTS[user.goal] || SUPPLEMENTS["Maintenance"];
 const [shareExpanded, setShareExpanded] = useState(false);

 return (
 <div style={{ paddingBottom: 24 }}>
 <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 20 }}>Profile</div>

 {/* Avatar card */}
 <Card glow style={{ textAlign: "center", marginBottom: 16 }}>
 <div style={{ width: 76, height: 76, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, margin: "0 auto 14px", boxShadow: `0 0 32px rgba(0,255,136,0.3)`, color: "#080E1A" }}>
 {user.name?.[0]?.toUpperCase() || "U"}
 </div>
 <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>{user.name}</div>
 <div style={{ fontSize: 13, color: C.textDim, marginBottom: 14 }}>{user.goal} · Level 3 · 12-day streak </div>
 <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
 <Pill label={`${user.age} yrs`} color={C.accent} />
 <Pill label={`${user.weight} kg`} color={C.blue} />
 <Pill label={`${user.height} cm`} color={C.purple} />
 <Pill label={user.gender === "male" ? " Male" : " Female"} color={C.textDim} />
 </div>
 </Card>

 {/* Stats grid */}
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
 {[
 { label: "BMI", val: bmi, sub: bmiInfo.label, color: bmiInfo.color, icon: " " },
 { label: "BMR", val: `${bmr}`, sub: "kcal/day base", color: C.blue, icon: " " },
 { label: "Daily Target", val: `${targetCal}`, sub: "kcal/day", color: C.yellow, icon: " " },
 { label: "Ideal Weight", val: `${Math.round(22 * ((+user.height / 100) ** 2))}`, sub: "kg (BMI 22)", color: C.accent, icon: " " },
 ].map(s => (
 <Card key={s.label} style={{ padding: 16 }} className="hover-lift">
 <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
 <div style={{ fontSize: 20, fontWeight: 900, color: s.color, marginBottom: 2, fontFamily: "'Space Mono', monospace" }}>{s.val}</div>
 <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 2 }}>{s.sub}</div>
 <div style={{ fontSize: 12, color: C.textDim, fontWeight: 600 }}>{s.label}</div>
 </Card>
 ))}
 </div>

 {/* Supplement guide */}
 <Card style={{ marginBottom: 16 }}>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}> Supplement Stack — {user.goal}</div>
 {supps.map((s, i) => (
 <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < supps.length - 1 ? `1px solid ${C.border}` : "none" }}>
 <div style={{ width: 40, height: 40, borderRadius: 12, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{s.name}</div>
 <div style={{ fontSize: 11, color: C.textDim }}>{s.dose} · {s.timing}</div>
 </div>
 <div style={{ fontSize: 10, color: C.accent, background: C.accentDim, borderRadius: 20, padding: "3px 8px", textAlign: "right", maxWidth: 80, lineHeight: 1.3 }}>{s.benefit}</div>
 </div>
 ))}
 </Card>

 {/* Share card */}
 <Card style={{ marginBottom: 16, background: "linear-gradient(135deg, rgba(0,255,136,0.07), rgba(74,158,255,0.04))", border: `1px solid rgba(0,255,136,0.18)` }}>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}> Share Your Journey</div>
 <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 14, padding: 20, marginBottom: 14, textAlign: "center", border: `1px solid rgba(0,255,136,0.12)` }}>
 <div style={{ fontSize: 10, color: C.textFaint, letterSpacing: 3, marginBottom: 8 }}>POWERED BY</div>
 <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: C.accent, marginBottom: 10 }}>FITCORE AI</div>
 <div style={{ fontSize: 20, fontWeight: 900, color: C.text, margin: "10px 0" }}>Crushing my {user.goal} goal! </div>
 <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
 <Pill label="12-day streak " color={C.orange} />
 <Pill label="Level 3 " color={C.accent} />
 <Pill label={`${targetCal} kcal target`} color={C.blue} />
 </div>
 </div>
 <Button onClick={() => { showToast("Share card copied to clipboard! ", "success"); }}>
 Share My Progress
 </Button>
 </Card>

 <Button onClick={onSignOut} variant="danger">Sign Out</Button>
 </div>
 );
}

// ─── GYM PANEL ────────────────────────────────────────────────────────────────
function GymPanel({ onBack }) {
 const [leads, setLeads] = useState(GYM_LEADS);
 const [activeTab, setActiveTab] = useState("dashboard");
 const [toastData, setToastData] = useState(null);
 const [selectedLead, setSelectedLead] = useState(null);
 const showToast = (msg, type = "success") => { setToastData({ msg, type }); setTimeout(() => setToastData(null), 3200); };

 const converted = leads.filter(l => l.status === "Converted").length;
 const hot = leads.filter(l => l.score === "Hot").length;
 const revenueData = [42, 58, 51, 67, 73, 89, 95];
 const leadData = [12, 18, 14, 22, 19, 28, 31];
 const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
 const scoreColors = { Hot: C.orange, Warm: C.yellow, Cold: C.blue };
 const statusColors = { Converted: C.accent, Contacted: C.blue, New: C.textDim };

 return (
 <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 20% 20%, rgba(74,158,255,0.06) 0%, transparent 50%), ${C.bg}`, fontFamily: "Outfit, sans-serif" }}>
 {toastData && <Toast msg={toastData.msg} type={toastData.type} onClose={() => setToastData(null)} />}

 {/* Header */}
 <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
 <div>
 <div style={{ fontSize: 9, color: C.textFaint, letterSpacing: 3, marginBottom: 3, textTransform: "uppercase" }}>B2B Portal</div>
 <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, color: C.text }}>FITCORE <span style={{ color: C.accent }}>GYM</span></div>
 </div>
 <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
 <Pill label=" Elite Plan" color={C.accent} size="sm" />
 <button onClick={onBack} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 12px", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: "Outfit" }}>← Exit</button>
 </div>
 </div>

 {/* Nav tabs */}
 <div style={{ display: "flex", gap: 6, padding: "0 20px", marginBottom: 20, overflowX: "auto" }}>
 {[["dashboard", " Dashboard"], ["leads", " Leads"], ["analytics", " Analytics"]].map(([tab, label]) => (
 <button key={tab} onClick={() => setActiveTab(tab)}
 style={{ padding: "9px 16px", borderRadius: 20, border: `1px solid ${activeTab === tab ? C.accent : C.border}`, background: activeTab === tab ? C.accentDim : "transparent", color: activeTab === tab ? C.accent : C.textDim, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "Outfit", transition: "all 0.2s" }}>
 {label}
 </button>
 ))}
 </div>

 <div style={{ padding: "0 20px 100px" }}>
 {activeTab === "dashboard" && (
 <>
 {/* KPI grid */}
 <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 16 }}>
 {[
 { label: "Total Leads", val: leads.length, icon: " ", color: C.blue, change: "+18%", sub: "this month" },
 { label: "Converted", val: converted, icon: " ", color: C.accent, change: "+8%", sub: "this month" },
 { label: "Hot Leads", val: hot, icon: " ", color: C.orange, change: "+33%", sub: "ready to close" },
 { label: "Revenue", val: "₹95K", icon: " ", color: C.yellow, change: "+12%", sub: "this month" },
 ].map(s => (
 <Card key={s.label} style={{ padding: 16 }} className="hover-lift">
 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
 <span style={{ fontSize: 22 }}>{s.icon}</span>
 <span style={{ fontSize: 11, color: C.accent, background: "rgba(0,255,136,0.1)", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>{s.change}</span>
 </div>
 <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontFamily: "'Space Mono', monospace" }}>{s.val}</div>
 <div style={{ fontSize: 12, color: C.textFaint }}>{s.label}</div>
 <div style={{ fontSize: 10, color: C.textFaint, marginTop: 1 }}>{s.sub}</div>
 </Card>
 ))}
 </div>

 {/* Revenue chart */}
 <Card style={{ marginBottom: 16 }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
 <div>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Revenue Trend</div>
 <div style={{ fontSize: 11, color: C.textFaint }}>Last 7 months (₹000s)</div>
 </div>
 <Pill label="↑ 12% MoM" color={C.accent} />
 </div>
 <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
 {revenueData.map((v, i) => (
 <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
 <div style={{ fontSize: 8, color: C.textFaint }}>₹{v}K</div>
 <div style={{ width: "100%", height: Math.round((v / Math.max(...revenueData)) * 60), background: i === 6 ? `linear-gradient(180deg, ${C.accent}, #00cc6a)` : "rgba(74,158,255,0.25)", borderRadius: "4px 4px 0 0", boxShadow: i === 6 ? `0 0 12px rgba(0,255,136,0.4)` : "none" }} />
 <div style={{ fontSize: 9, color: i === 6 ? C.accent : C.textFaint }}>{months[i].slice(0,1)}</div>
 </div>
 ))}
 </div>
 </Card>

 {/* Recent leads */}
 <Card>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Recent Leads</div>
 {leads.slice(0, 4).map((lead, i) => (
 <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
 <div style={{ width: 36, height: 36, borderRadius: 10, background: `${scoreColors[lead.score]}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, border: `1px solid ${scoreColors[lead.score]}44`, flexShrink: 0 }}>
 {lead.score === "Hot" ? " " : lead.score === "Warm" ? " " : " "}
 </div>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{lead.name}</div>
 <div style={{ fontSize: 11, color: C.textFaint }}>{lead.goal} · {lead.joined}</div>
 </div>
 <Pill label={lead.status} color={statusColors[lead.status]} size="sm" />
 </div>
 ))}
 </Card>
 </>
 )}

 {activeTab === "leads" && (
 <>
 <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 16 }}>Lead Management</div>
 <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
 {leads.map(lead => (
 <Card key={lead.id} style={{ padding: 16 }} className="hover-lift">
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
 <div style={{ flex: 1 }}>
 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
 <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{lead.name}</div>
 <Pill label={lead.score} color={scoreColors[lead.score]} size="sm" />
 </div>
 <div style={{ fontSize: 12, color: C.textDim }}>{lead.age} yrs · {lead.goal} · {lead.activity} activity</div>
 <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{lead.phone} · {lead.joined}</div>
 </div>
 <Pill label={lead.status} color={statusColors[lead.status]} size="sm" />
 </div>
 <div style={{ display: "flex", gap: 8 }}>
 <button onClick={() => showToast(`WhatsApp opened for ${lead.name} `, "info")}
 style={{ flex: 1, padding: "9px", borderRadius: 10, background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25D366", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit" }}>
 WhatsApp
 </button>
 {lead.status !== "Converted" && (
 <button onClick={() => { setLeads(l => l.map(x => x.id === lead.id ? { ...x, status: "Converted" } : x)); showToast(`${lead.name} converted! `, "success"); }}
 style={{ flex: 1, padding: "9px", borderRadius: 10, background: C.accentDim, border: `1px solid rgba(0,255,136,0.3)`, color: C.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit" }}>
 Mark Converted
 </button>
 )}
 </div>
 </Card>
 ))}
 </div>
 </>
 )}

 {activeTab === "analytics" && (
 <>
 <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 16 }}>Analytics</div>

 {/* Conversion funnel */}
 <Card style={{ marginBottom: 14 }}>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Conversion Funnel</div>
 {[
 { label: "Total Leads", val: leads.length, max: leads.length, color: C.blue },
 { label: "Contacted", val: leads.filter(l => l.status === "Contacted" || l.status === "Converted").length, max: leads.length, color: C.yellow },
 { label: "Converted", val: converted, max: leads.length, color: C.accent },
 ].map((s, i) => (
 <div key={i} style={{ marginBottom: 14 }}>
 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
 <span style={{ fontSize: 13, color: C.text }}>{s.label}</span>
 <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.val} ({Math.round(s.val / leads.length * 100)}%)</span>
 </div>
 <ProgressBar value={s.val} max={s.max} color={s.color} />
 </div>
 ))}
 </Card>

 {/* Lead trends chart */}
 <Card style={{ marginBottom: 14 }}>
 <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Lead Growth</div>
 <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 70 }}>
 {leadData.map((v, i) => (
 <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
 <div style={{ width: "100%", height: Math.round((v / Math.max(...leadData)) * 58), background: i === 6 ? `linear-gradient(180deg, ${C.blue}, #3b82f6)` : "rgba(74,158,255,0.2)", borderRadius: "4px 4px 0 0", boxShadow: i === 6 ? "0 0 12px rgba(74,158,255,0.4)" : "none" }} />
 <div style={{ fontSize: 9, color: C.textFaint }}>{months[i].slice(0,1)}</div>
 </div>
 ))}
 </div>
 </Card>

 {/* Metric cards */}
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
 {[
 { label: "Conversion Rate", val: `${Math.round(converted / leads.length * 100)}%`, color: C.accent },
 { label: "Retention Rate", val: "78%", color: C.blue },
 { label: "Avg. Lead Score", val: "6.4/10", color: C.yellow },
 { label: "Best Day", val: "Tuesday", color: C.purple },
 { label: "Avg. Deal Time", val: "4.2 days", color: C.orange },
 { label: "LTV per Member", val: "₹8,400", color: C.accent },
 ].map(s => (
 <Card key={s.label} style={{ padding: 16, textAlign: "center" }}>
 <div style={{ fontSize: 20, fontWeight: 900, color: s.color, fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>{s.val}</div>
 <div style={{ fontSize: 11, color: C.textFaint }}>{s.label}</div>
 </Card>
 ))}
 </div>
 </>
 )}
 </div>
 </div>
 );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen() {
 const [progress, setProgress] = useState(0);
 const [step, setStep] = useState(0);
 const steps = ["Calculating BMI & BMR...", "Generating workout plan...", "Building diet schedule...", "Personalizing your experience..."];

 useEffect(() => {
 const t = setInterval(() => {
 setProgress(p => {
 if (p >= 100) { clearInterval(t); return 100; }
 return p + 2;
 });
 }, 36);
 const s = setInterval(() => setStep(x => Math.min(x + 1, steps.length - 1)), 900);
 return () => { clearInterval(t); clearInterval(s); };
 }, []);

 return (
 <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
 <div style={{ fontSize: 48, marginBottom: 20, animation: "breathe 1.5s ease-in-out infinite" }}> </div>
 <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700, color: C.accent, marginBottom: 8 }}>FITCORE AI</div>
 <div style={{ fontSize: 14, color: C.textDim, marginBottom: 32 }}>Building your plan...</div>
 <div style={{ width: 260, height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
 <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.blue})`, borderRadius: 6, transition: "width 0.1s linear", boxShadow: `0 0 10px ${C.accent}66` }} />
 </div>
 <div style={{ fontSize: 13, color: C.textDim, animation: "pulse 1.5s ease infinite" }}>{steps[step]}</div>
 </div>
 );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
 const [mode, setMode] = useState("landing");
 const [user, setUser] = useState(null);
 const [activeTab, setActiveTab] = useState("home");
 const [toastData, setToastData] = useState(null);
 const [loading, setLoading] = useState(false);

 const showToast = (msg, type = "success") => {
 setToastData({ msg, type });
 setTimeout(() => setToastData(null), 3200);
 };

 const handleOnboard = (data) => {
 setLoading(true);
 setTimeout(() => { setUser(data); setMode("user"); setLoading(false); showToast(`Welcome, ${data.name}! Your plan is ready `, "success"); }, 3600);
 };

 const tabs = [
 { id: "home", icon: " ", label: "Home" },
 { id: "plan", icon: " ", label: "Plan" },
 { id: "scan", icon: " ", label: "Scan" },
 { id: "rewards", icon: " ", label: "Rewards" },
 { id: "profile", icon: " ", label: "Profile" },
 ];

 if (mode === "gym") {
 return (
 <>
 <style>{GLOBAL_STYLES}</style>
 <GymPanel onBack={() => setMode("landing")} />
 </>
 );
 }

 if (mode === "onboarding") {
 return (
 <>
 <style>{GLOBAL_STYLES}</style>
 {loading ? <LoadingScreen /> : <Onboarding onComplete={handleOnboard} />}
 </>
 );
 }

 if (mode === "landing") {
 return (
 <>
 <style>{GLOBAL_STYLES}</style>
 <Landing onUser={() => setMode("onboarding")} onGym={() => setMode("gym")} />
 </>
 );
 }

 // User panel
 return (
 <>
 <style>{GLOBAL_STYLES}</style>
 {toastData && <Toast msg={toastData.msg} type={toastData.type} onClose={() => setToastData(null)} />}

 {/* Top bar */}
 <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,14,26,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
 <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700 }}>
 <span style={{ color: C.text }}>FIT</span><span style={{ color: C.accent }}>CORE</span>
 </div>
 <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
 <div style={{ fontSize: 12, color: C.textDim, background: C.accentDim, borderRadius: 20, padding: "4px 10px", border: `1px solid ${C.borderGlow}` }}> 12d streak</div>
 <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#080E1A" }}>
 {user?.name?.[0]?.toUpperCase()}
 </div>
 </div>
 </div>

 {/* Page content */}
 <div style={{ padding: "16px 20px", paddingBottom: 90 }}>
 {activeTab === "home" && <Dashboard user={user} />}
 {activeTab === "plan" && <PlanScreen user={user} />}
 {activeTab === "scan" && <ScanScreen showToast={showToast} />}
 {activeTab === "rewards" && <RewardsScreen user={user} showToast={showToast} />}
 {activeTab === "profile" && <ProfileScreen user={user} onSignOut={() => { setMode("landing"); setUser(null); }} showToast={showToast} />}
 </div>

 {/* Bottom nav */}
 <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,14,26,0.96)", backdropFilter: "blur(24px)", borderTop: `1px solid ${C.border}`, padding: "8px 4px 20px", display: "flex", justifyContent: "space-around", zIndex: 100 }}>
 {tabs.map(t => {
 const active = activeTab === t.id;
 return (
 <button key={t.id} onClick={() => setActiveTab(t.id)}
 style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "6px 14px", borderRadius: 12, transition: "all 0.2s", position: "relative" }}>
 {active && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 24, height: 3, borderRadius: 3, background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />}
 <div style={{ fontSize: 20, filter: active ? `drop-shadow(0 0 8px ${C.accent})` : "none", transform: active ? "scale(1.15)" : "scale(1)", transition: "all 0.2s" }}>{t.icon}</div>
 <div style={{ fontSize: 10, color: active ? C.accent : C.textFaint, fontWeight: active ? 700 : 400, transition: "color 0.2s" }}>{t.label}</div>
 </button>
 );
 })}
 </div>
 </>
 );
}