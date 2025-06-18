import { useState, useEffect } from "react";
import FilterSelector from "./FilterSelector";
import RatingGraph from "./RatingGraph";
import ContestTable from "./ContestTable";
import axios from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";

const ContestHistory = ({ studentId }) => {
  const [filter, setFilter] = useState(30);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
   
        await new Promise((res) => setTimeout(res, 300)); // optional delay

        const res = await axios.get(`/contests/${studentId}?days=${filter}`);
        setContests(res.data);
      } catch (err) {
        console.error("Error fetching contest data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [studentId, filter]);

  return (
    <div className="bg-card p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Contest History</h2>
        <FilterSelector selected={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-[200px] rounded-lg" />
          <Skeleton className="w-full h-[300px] rounded-lg" />
        </div>
      ) : contests.length === 0 ? (
        <p className="text-muted-foreground mt-4">
          No contests found in the selected duration.
        </p>
      ) : (
        <>
          <RatingGraph data={contests} />
          <div className="mt-6">
            <ContestTable contests={contests} />
          </div>
        </>
      )}
    </div>
  );
};

export default ContestHistory;
