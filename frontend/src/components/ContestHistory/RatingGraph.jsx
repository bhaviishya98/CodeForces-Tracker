import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
        backgroundColor: "#6366f1",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // crucial for resizing height dynamically
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#e4e4e7" : "#1f2937",
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
          color: isDark ? "#d4d4d8" : "#a1a1aa",
        },
        grid: {
          color: isDark ? "#27272a" : "#e5e7eb",
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
    <Card className="mt-4 w-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Rating Progress</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] sm:h-[400px] md:h-[500px]">
        <div className="relative w-full h-full">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingGraph;
