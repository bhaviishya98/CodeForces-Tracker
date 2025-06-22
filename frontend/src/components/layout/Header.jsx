import { useTheme } from "@/components/layout/theme-provider";
import { Trophy, Sun, Moon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import "@/index.css";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");
  const [lastSynced, setLastSynced] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsDark(theme === "dark");

    const saved = localStorage.getItem("lastSynced");
    if (saved) {
      setLastSynced(new Date(saved));
    }
  }, [theme]);

  const toggleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
    setIsDark(checked);
  };

  const handleSyncAllStudents = async () => {
    try {
      setIsSyncing(true);
      toast.loading("🔄 Syncing student data...");

      const res = await fetch("http://localhost:5000/api/sync", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Sync failed");

      await fetch("http://localhost:5000/api/inactivity-check", {
        method: "POST",
      });

      window.dispatchEvent(new Event("studentDataUpdated"));
      
      toast.success("✅ Synced & inactivity check complete!");


      const now = new Date();
      setLastSynced(now);
      localStorage.setItem("lastSynced", now.toISOString());
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to sync Codeforces data.");
    } finally {
      toast.dismiss();
      setIsSyncing(false);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "Not synced yet";
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  return (
    // <div className="flex flex-col space-y-4 mb-6 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 px-8 mt-4">
    <div className="flex max-[454px]:flex-col max-[454px]:space-y-4 flex-row justify-between items-start space-y-0 px-8 mt-4 mb-8 min-[454px]:mb-12 sm:mb-8">
      <div>
        <button
          className="flex items-center gap-2 md:gap-3"
          onClick={() => navigate("/")}
        >
          <Trophy className="h-6 w-6 sm:h-8 md:w-8 text-yellow-500" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            <span className="hidden sm:inline">CodeForces Tracker</span>
            <span className="sm:hidden">CF Tracker</span>
          </h1>
        </button>
        <p className="text-muted-foreground mt-1 max-sm:hidden text-sm md:text-base">
          Track and manage student performance
        </p>
      </div>

      {/* <div className="flex flex-col gap-2 items-end"> */}
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSyncAllStudents}
          disabled={isSyncing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">
            {isSyncing ? "Syncing..." : "Sync"}
          </span>
        </Button>

        <div className="flex items-center space-x-2">
          {/* <div className="relative"> */}
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

      <div className="absolute top-28 min-[454px]:top-16 min-[454px]:right-8 bg-muted text-[0.66rem] sm:text-sm px-4 py-2 rounded-full flex items-center gap-2 font-medium">
        <RefreshCw className="h-4 w-4 text-muted-foreground" />
        Last Sync: {formatDateTime(lastSynced)}
      </div>
      {/* </div> */}
    </div>
  );
}
