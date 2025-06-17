import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Adjust path if needed
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const RatingGraph = ({ data }) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(
      theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }, [theme]);

  const labels = data.map((contest) => contest.contestId);
  const ratings = data.map((contest) => contest.newRating);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Rating",
        data: ratings,
        borderColor: "#4f46e5", // indigo-600
        backgroundColor: "#6366f1", // yellow-200 or indigo-200
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          // color: isDark ? "#e4e4e7" : "#1f2937",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Contest Id" },
        ticks: {
          color: isDark ? "#d4d4d8" : "#a1a1aa", // gray-300 or gray-600
        },
        grid: {
          color: isDark ? "#27272a" : "#e5e7eb", // zinc-800 or gray-200
        },
      },
      y: {
        title: { display: true, text: "Rating" },
        ticks: {
          color: isDark ? "#d4d4d8" : "#a1a1aa",
        },
        grid: {
          color: isDark ? "#27272a" : "#e5e7ec",
        },
      },
    },
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Rating Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

export default RatingGraph;

