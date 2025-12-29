// chartjs-setup.ts (GLOBAL setup)
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register EVERYTHING you need globally
ChartJS.register(
  ArcElement,      // <-- Required for Pie/Donut charts
  BarElement,      // <-- Bar charts
  LineElement,     // <-- Line charts
  PointElement,    // <-- Time series points
  CategoryScale,   // X axis
  LinearScale,     // Y axis
  TimeScale,       // Time series
  Tooltip,
  Legend,
  Filler
);
