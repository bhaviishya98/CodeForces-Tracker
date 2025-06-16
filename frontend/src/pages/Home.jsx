import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, TrendingUp, Award, Clock, Target } from "lucide-react";
import StudentTable from "@/components/StudentTable";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";


const stats = [
  {
    title: "Total Students",
    value: 3,
    description: "+2 active this week",
    icon: <Users className="  text-muted-foreground" />,
  },
  {
    title: "Average Rating",
    value: 1443,
    description: "+12 from last month",
    icon: <TrendingUp className="  text-muted-foreground" />,
    valueClass: "text-black dark:text-white",
    descriptionClass: "text-green-600",
  },
  {
    title: "Top Performer",
    value: 1680,
    description: "Jane Smith",
    icon: <Award className="  text-muted-foreground" />,
  },
  {
    title: "Inactive Students",
    value: 1,
    description: "Need attention",
    icon: <Clock className="  text-muted-foreground" />,
    valueClass: "text-red-600",
    descriptionClass: "text-muted-foreground",
  },
  {
    title: "Contributions",
    value: 520,
    description: "+45 this week",
    icon: <Target className="  text-muted-foreground" />,
    descriptionClass: "text-green-600",
  },
];

const Loader = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
    <p className="mt-4 text-lg text-muted-foreground">Loading Dashboard...</p>
  </div>
);


const Home = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/students");
        const data = res.data;
        setStudents(data);

        const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;

        const fetchRecentContributions = async (handle) => {
          try {
            const cfRes = await fetch(
              `https://codeforces.com/api/user.status?handle=${handle}`
            );
            const cfData = await cfRes.json();
            if (cfData.status !== "OK") return 0;

            const recentSubs = cfData.result.filter(
              (s) => s.creationTimeSeconds >= sevenDaysAgo && s.verdict === "OK"
            );

            return recentSubs.length;
          } catch (err) {
            console.error("Error fetching CF data for", handle, err);
            return 0;
          }
        };

        // Calculate contributions for each student
        const contributionsArray = await Promise.all(
          data.map(async (s) => {
            if (!s.cfHandle) return 0;
            return await fetchRecentContributions(s.cfHandle);
          })
        );

        // Add those contributions to student objects temporarily
        const updatedData = data.map((s, i) => ({
          ...s,
          recentContribution: contributionsArray[i],
        }));

        const total = updatedData.length;
        const averageRating = total
          ? Math.round(
              updatedData.reduce((sum, s) => sum + (s.rating || 0), 0) / total
            )
          : 0;
        const topPerformer = updatedData.reduce(
          (top, s) => (s.rating > (top.rating || 0) ? s : top),
          {}
        );
        const inactive = updatedData.filter(
          (s) => s.status === "inactive"
        ).length;
        const contributions = updatedData.reduce(
          (sum, s) => sum + (s.recentContribution || 0),
          0
        );

        let ratingDescription = "";
        if (averageRating >= 2000) {
          ratingDescription = "Excellent performance";
        } else if (averageRating >= 1600) {
          ratingDescription = "Strong performers";
        } else if (averageRating >= 1200) {
          ratingDescription = "Room to improve";
        } else {
          ratingDescription = "Needs focused effort";
        }

        setStats([
          {
            title: "Total Students",
            value: total,
            description: `+${total - inactive} active this week`,
            icon: <Users className="text-muted-foreground" />,
          },
          {
            title: "Average Rating",
            value: averageRating,
            description: ratingDescription,
            icon: <TrendingUp className="text-muted-foreground" />,
            valueClass: "text-black dark:text-white",
            descriptionClass: "text-green-600",
          },
          {
            title: "Top Performer",
            value: topPerformer.rating || 0,
            description: topPerformer.name || "-",
            icon: <Award className="text-muted-foreground" />,
          },
          {
            title: "Inactive Students",
            value: inactive,
            description: "Need attention",
            icon: <Clock className="text-muted-foreground" />,
            valueClass: "text-red-600",
            descriptionClass: "text-muted-foreground",
          },
          {
            title: "Contributions",
            value: contributions,
            description: "Recent AC submissions",
            icon: <Target className="text-muted-foreground" />,
            descriptionClass: "text-green-600",
          },
        ]);

        setLoadingStats(false);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, []);
  
  
  return (
    <main className="flex flex-col bg-background">
      {loadingStats ? (
        <Loader /> // ✅ Show loader while stats are loading
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-3xl font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-[1.65rem] font-bold ${
                      stat.valueClass ?? ""
                    }`}
                  >
                    {stat.value}
                  </div>
                  <p
                    className={`text-xl ${
                      stat.descriptionClass ?? "text-muted-foreground"
                    }`}
                  >
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <StudentTable className="relative px-8" />
        </>
      )}
    </main>
  );
  
};

export default Home;
