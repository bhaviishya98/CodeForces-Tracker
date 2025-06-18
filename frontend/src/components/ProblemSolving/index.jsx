import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import FilterSelector from "./FilterSelector";
import RatingGraph from "./RatingBarChart";
import SubmissionHeatmap from "./SubmissionHeatmap";
import { Skeleton } from "@/components/ui/skeleton";

const ProblemSolving = ({ studentId }) => {
  const [filter, setFilter] = useState(30);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemSolving = async () => {
      try {
        setLoading(true);

        // Optional: Simulate delay for better skeleton visibility
        await new Promise((res) => setTimeout(res, 300));

        const res = await axios.get(
          `/contests/problemSolving/${studentId}?days=${filter}`
        );
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemSolving();
  }, [studentId, filter]);

  const ratingData = stats?.ratingBuckets
    ? Object.entries(stats.ratingBuckets).map(([rating, count]) => ({
        rating: parseInt(rating),
        count,
      }))
    : [];

  return (
    <div className="bg-card p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Problem Solving Stats</h2>
        <FilterSelector selected={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-[100px] rounded-lg" />
          <Skeleton className="w-full h-[300px] rounded-lg" />
        </div>
      ) : stats?.totalSolved === 0 ? (
        <p className="text-muted-foreground mt-4">
          No problems solved in the selected duration.
        </p>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Overall Stats</h3>
            <p>Total Solved: {stats.totalSolved}</p>
            <p>Average Rating: {stats.averageRating}</p>
            <p>Average per Day: {stats.averagePerDay}</p>
          </div>

          <RatingGraph data={ratingData} />
          <div className="mt-6 max-w-full overflow-x-auto">
            <SubmissionHeatmap heatmapData={stats.heatmap} />
          </div>

          {stats.mostDifficultProblems?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">
                Most Difficult Problem(s)
              </h3>
              <ul className="list-disc list-inside">
                {stats.mostDifficultProblems.map((prob, i) => (
                  <li key={i}>
                    {prob.name} ({prob.rating})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProblemSolving;
