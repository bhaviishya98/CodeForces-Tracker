import { useTheme } from "@/components/layout/theme-provider";
import { Trophy, Sun, Moon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
    <div className="flex flex-row justify-between items-center gap-2 mt-4 px-8 py-2">
      <div className="flex flex-col gap-2">
        <button
          className="flex items-center gap-2"
          onClick={() => navigate("/")}
        >
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
          className="flex items-center text-xl"
          onClick={handleSyncAllStudents}
          disabled={isSyncing}
        >
          <RefreshCw
            className={`!h-5 !w-5 mr-2 ${isSyncing ? "animate-spin" : ""}`}
          />
          {isSyncing ? "Syncing..." : "Sync Now"}
        </Button>

        <div className="bg-muted text-[1rem] px-4 py-2 rounded-full flex items-center gap-2 font-medium">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
          Last Sync: {formatDateTime(lastSynced)}
        </div>

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
