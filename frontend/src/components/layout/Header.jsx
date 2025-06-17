// components/Header.jsx
import { useTheme } from "@/components/layout/theme-provider";
import { Switch } from "@/components/ui/switch";
import { Trophy, Sun, Moon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import "@/index.css"; // ensure you load Tailwind
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");
  const [studentList, setStudentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const toggleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
    setIsDark(checked);
  };

  const handleSyncAllStudents = async () => {
    const updatedList = await Promise.all(
      studentList.map(async (student) => {
        const cfData = await fetchCodeforcesInfo(student.handle);
        return { ...student, ...cfData };
      })
    );

    setStudentList(updatedList);
  };

  return (
    <div className="flex flex-row justify-between items-center gap-2 mt-4 px-8 py-2">
      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-2" onClick={() => navigate("/")}>
          <Trophy className="h-[2.3rem] w-[2.3rem] text-yellow-500" />
          <h1 className="text-5xl font-bold">Codeforces Tracker</h1>
        </button>
        <h2 className="text-muted-foreground font-normal text-base">
          Track and manage student performance on Codeforces
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center text-xl "
          onClick={handleSyncAllStudents}
        >
          <RefreshCw className="!h-5 !w-5 mr-2" />
          Sync Data
        </Button>
        <div className="relative">
          <input
            type="checkbox"
            id="theme-toggle"
            className="sr-only"
            checked={isDark}
            onChange={(e) => toggleTheme(e.target.checked)}
          />
          <label
            htmlFor="theme-toggle"
            className="block w-14 h-8 bg-muted rounded-full shadow-inner relative cursor-pointer transition-colors"
          >
            <span
              className={`absolute top-1 left-1 h-6 w-6 bg-background rounded-full flex items-center justify-center transition-all ${
                isDark ? "translate-x-6" : "translate-x-0"
              }`}
            >
              {isDark ? (
                <Moon className="h-4 w-4 text-white" />
              ) : (
                <Sun className="h-4 w-4 text-black" />
              )}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
