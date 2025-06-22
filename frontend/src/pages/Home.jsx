  import React from "react";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Users, TrendingUp, Award, Clock, Target } from "lucide-react";
  import StudentTable from "@/components/student/StudentTable";
  import { useEffect, useState } from "react";
  import axios from "@/lib/axios";

  const SkeletonCard = () => (
    <div className="animate-pulse rounded-xl border p-4 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-2/3 bg-muted rounded" />
        <div className="h-6 w-6 bg-muted rounded-full" />
      </div>
      <div className="h-8 w-1/2 bg-muted rounded" />
      <div className="h-4 w-2/3 bg-muted rounded" />
    </div>
  );

  const Home = () => {
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);

    const fetchStatsFromLocalStorage = () => {
      const stored = localStorage.getItem("studentData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setStudents(parsed);

        const totalStudents = parsed.length;
        const averageRating =
          totalStudents > 0
            ? Math.round(
                parsed.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
                  totalStudents
              )
            : 0;

        const topPerformers = [...parsed]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);

        const inactiveStudents = parsed.filter(
          (s) => s.status === "inactive"
        ).length;

        const totalContributions = parsed.reduce(
          (acc, curr) => acc + (curr.contribution || 0),
          0
        );

        setStats([
          {
            title: "Total Students",
            value: totalStudents,
            description: `+${totalStudents - inactiveStudents} active this week`,
            icon: <Users className="text-muted-foreground max-[450px]:w-4" />,
          },
          {
            title: "Average Rating",
            value: averageRating,
            description: averageRating,
            icon: (
              <TrendingUp className="text-muted-foreground max-[450px]:w-4" />
            ),
            valueClass: "text-black dark:text-white",
            descriptionClass: "text-green-600",
          },
          {
            title: "Top Performer",
            value: topPerformers[0]?.rating || 0,
            description: topPerformers[0]?.name || "-",
            icon: <Award className="text-muted-foreground max-[450px]:w-4" />,
          },
          {
            title: "Inactive Students",
            value: inactiveStudents,
            description: "Need attention",
            icon: <Clock className="text-muted-foreground max-[450px]:w-4" />,
            valueClass: "text-red-600",
            descriptionClass: "text-muted-foreground",
          },
          {
            title: "Contributions",
            value: totalContributions,
            description: "Total submissions",
            icon: <Target className="text-muted-foreground max-[450px]:w-4" />,
            descriptionClass: "text-green-600 bottom-0 top-0",
            CardClass: "col-span-2 md:col-span-1 ",
          },
        ]);
        setLoadingStats(false);
      }
    };


    useEffect(() => {
      fetchStatsFromLocalStorage();

      const handleCustomUpdate = () => {
        fetchStatsFromLocalStorage();
      };

      const handleStorageEvent = (event) => {
        if (event.key === "studentData") {
          fetchStatsFromLocalStorage();
        }
      };

      window.addEventListener("storage", handleStorageEvent); // sync across tabs
      window.addEventListener("studentDataUpdated", handleCustomUpdate); // sync in same tab

      return () => {
        window.removeEventListener("storage", handleStorageEvent);
        window.removeEventListener("studentDataUpdated", handleCustomUpdate);
      };
    }, []);



    return (
      <main className="flex flex-col bg-background">
        {loadingStats ? (
          // 💡 Show 5 skeleton cards just like real ones
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-8">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className={`rounded-xl border flex flex-col justify-between h-full transition-shadow hover:shadow-lg dark:hover:shadow-xl hover:cursor-pointer ${
                    stat.CardClass ?? ""
                  }`}
                >
                  <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                    <CardTitle className="text-[0.65rem] min-[375px]:text-[0.8rem] min-[450px]:text-[1rem] sm:text-[1.1rem] md:text-[1.25rem] font-medium leading-snug">
                      {stat.title}
                    </CardTitle>
                    <div className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5 sm:w-6 sm:h-6">
                      {stat.icon}
                    </div>
                  </CardHeader>

                  <CardContent className="relative botom-0  ">
                    <div
                      className={`sm:text-[1.2rem] md:text-[1.4rem] font-bold ${
                        stat.valueClass ?? ""
                      }`}
                    >
                      {stat.value}
                    </div>
                    <p
                      className={`text-[0.45rem] min-[450px]:text-[0.8rem] sm:text-[1rem] ${
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
