import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ContestHistory from "@/components/ContestHistory/index";
import ProblemSolving from "../ProblemSolving/index";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";


const StudentProfile = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(location.state?.student || null);
  const [loading, setLoading] = useState(!student);
  const [error, setError] = useState(null);

  const contests = [];

  useEffect(() => {
    if (!student) {
      // Fallback: Fetch student from backend using handle
      const fetchStudent = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`/students/${handle}`);
          setStudent(res.data);
        } catch (err) {
          console.error("Failed to fetch student:", err);
          setError("Failed to load student profile.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchStudent();
    }
  }, [handle, student]);
  
  if (loading) return <div>Loading student profile...</div>;
  if (error) return <div>{error}</div>;
  if (!student) return <div>No student data available</div>;

  
  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 ">
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-semibold">Student Profile</h1>

          <p className="text-muted-foreground text-sm">
            Codeforces Handle:{" "}
            <span className="font-medium text-foreground">
              {student?.cfHandle || handle}
            </span>
          </p>

          {student?.name && (
            <p className="text-muted-foreground text-sm">
              Name:{" "}
              <span className="font-medium text-foreground">
                {student.name}
              </span>
            </p>
          )}

          {student?.email && (
            <p className="text-muted-foreground text-sm">
              Email:{" "}
              <span className="font-medium text-foreground">
                {student.email}
              </span>
            </p>
          )}

          <p className="text-muted-foreground text-sm">
            Total Contribution:{" "}
            <span className="font-medium text-foreground">
              {student?.contribution ?? 0}
            </span>
          </p>

          <p className="text-muted-foreground text-sm">
            Current Rating:{" "}
            <span className="font-medium text-foreground">
              {student?.rating ?? "N/A"}
            </span>
          </p>

          <p className="text-muted-foreground text-sm">
            Max Rating:{" "}
            <span className="font-medium text-foreground">
              {student?.maxRating ?? "N/A"}
            </span>
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate("/")}>
          ← Back
        </Button>
      </div>

      <Tabs defaultValue="contest" className="w-full">
        <TabsList className="w-full flex justify-start mb-4">
          <TabsTrigger value="contest">Contest History</TabsTrigger>
          <TabsTrigger value="problems">Problem Solving</TabsTrigger>
        </TabsList>

        <TabsContent value="contest">
          <div className="bg-card p-4 rounded-xl shadow-sm">
            <ContestHistory studentId={student._id} />
          </div>
        </TabsContent>

        <TabsContent value="problems">
          <div className="bg-card p-4 rounded-xl shadow-sm">
            <ProblemSolving studentId={student._id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfile;
