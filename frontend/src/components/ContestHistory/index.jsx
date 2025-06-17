import { useState, useEffect } from "react";
import FilterSelector from "./FilterSelector";
import RatingGraph from "./RatingGraph";
import ContestTable from "./ContestTable";
import { useParams } from "react-router-dom";
import axios from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";

const ContestHistory = () => {
  const [filter, setFilter] = useState(30);
  const [allContests, setAllContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const { handle } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [contestRes, unsolvedRes] = await Promise.all([
          axios.get(`/contests/${handle}`),
          axios.get(`/contests/unsolvedProblem/${handle}`),
        ]);

        const contests = contestRes.data;
        const unsolved = unsolvedRes.data;

        const merged = contests.map((contest) => {
          const match = unsolved.find((u) => u.contestId === contest.contestId);
          return {
            ...contest,
            unsolvedProblems: match ? match.unsolvedProblems : "-",
          };
        });

        setAllContests(merged);
      } catch (err) {
        console.error("Error fetching contest or unsolved data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [handle]);

  useEffect(() => {
    const cutoff = Date.now() - filter * 24 * 60 * 60 * 1000;
    const filtered = allContests.filter(
      (c) => new Date(c.date).getTime() >= cutoff
    );
    setFilteredContests(filtered);
  }, [filter, allContests]);

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
      ) : (
        <>
          <RatingGraph data={filteredContests} />
          <div className="mt-6">
            <ContestTable contests={filteredContests} />
          </div>
        </>
      )}
    </div>
  );
};

export default ContestHistory;
