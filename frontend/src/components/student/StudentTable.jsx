"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Heart,
  AtSign,
  Phone,
  Zap,
  Edit,
  Trash2,
  Eye,
  Send,
  Bell,
  BellOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import AddStudentModal from "@/components/student/AddStudentModal"; // adjust path as needed
import axios from "@/lib/axios"; // adjust path as needed
import EditStudentModal from "@/components/student/EditStudentModal"; // adjust path as needed
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const getStatusIcon = (status) =>
  status === "active" ? (
    <CheckCircle2 className="text-green-500 w-4 h-4" />
  ) : (
    <XCircle className="text-red-500 w-4 h-4" />
  );

const getRatingColor = (rating) => {
  if (rating >= 1600) return "text-purple-500";
  if (rating >= 1400) return "text-blue-500";
  return "text-green-500";
};

export default function StudentTable({ className }) {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const saveToLocalStorage = (students) => {
    localStorage.setItem("studentData", JSON.stringify(students));
  };

  // const exportData = () => {
  //   const choice = window.prompt("Type 'csv' or 'excel' to export:");

  //   if (choice === "csv") {
  //     exportToCSV();
  //   } else if (choice === "excel") {
  //     exportToExcel();
  //   } else {
  //     alert("Invalid choice. Please type 'csv' or 'excel'.");
  //   }
  // };

  const exportData = async () => {
    const choice = prompt("Type 'csv' or 'json' to export:");

    if (!choice || (choice !== "csv" && choice !== "json")) {
      alert("Please enter either 'csv' or 'json'");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/export?format=${choice}`
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `students.${choice === "csv" ? "csv" : "json"}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export data.");
    }
  };

  const filteredStudents = studentList.filter((student) => {
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      (student?.name?.toLowerCase?.() ?? "").includes(q) ||
      (student?.cfHandle?.toLowerCase?.() ?? "").includes(q);

    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const sortByName = () => {
    const sorted = [...studentList].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setStudentList(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // toggle order
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/students"); // Update port if different

        setStudentList(res.data);
        saveToLocalStorage(res.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();

    // Listen to refresh trigger
    const listener = () => fetchStudents();
    window.addEventListener("studentDataUpdated", listener);

    return () => {
      window.removeEventListener("studentDataUpdated", listener);
    };
  }, []);

  const handleAddStudent = async () => {
    try {
      const res = await axios.get("/students");
      setStudentList(res.data);
      saveToLocalStorage(res.data);
      window.dispatchEvent(new Event("studentDataUpdated"));
    } catch (err) {
      console.error("Failed to refresh student list:", err);
    }
  };

  const handleEditSave = async (updatedData) => {
    const updatedList = studentList.map((student) =>
      student.email === editStudent.email
        ? { ...student, ...updatedData }
        : student
    );
    setStudentList(updatedList);
    saveToLocalStorage(updatedList); // Save updated list
    window.dispatchEvent(new Event("studentDataUpdated"));

    setEditStudent(null);
    setEditModalOpen(false);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleRemoveStudent = async (id) => {
    try {
      await axios.delete(`students/${id}`);
      const updatedList = studentList.filter((student) => student._id !== id);
      setStudentList(updatedList);
      saveToLocalStorage(updatedList);
      window.dispatchEvent(new Event("studentDataUpdated"));
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  };

  const handleRemoveSelectedStudents = async () => {
    if (
      selectedStudentIds.length === 0 ||
      !confirm(`Delete ${selectedStudentIds.length} selected students?`)
    ) {
      return;
    }

    try {
      // Optionally: send batch delete to backend if supported
      await Promise.all(
        selectedStudentIds.map((id) => axios.delete(`students/${id}`))
      );

      const updatedList = studentList.filter(
        (student) => !selectedStudentIds.includes(student._id)
      );

      setStudentList(updatedList);
      setSelectedStudentIds([]);
      saveToLocalStorage(updatedList);
      window.dispatchEvent(new Event("studentDataUpdated"));
    } catch (err) {
      console.error("Failed to delete selected students:", err);
      alert("An error occurred while deleting students.");
    }
  };

  const confirmDelete = (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      handleRemoveStudent(id);
      window.dispatchEvent(new Event("studentDataUpdated"));
    }
  };

  const toggleAutoEmail = async (student) => {
    const updated = {
      ...student,
      autoEmailDisabled: !student.autoEmailDisabled,
    };

    try {
      const res = await axios.put(`/students/${student._id}`, updated);

      // Update local list
      const updatedList = studentList.map((s) =>
        s._id === student._id ? res.data : s
      );
      setStudentList(updatedList);
      saveToLocalStorage(updatedList);
      window.dispatchEvent(new Event("studentDataUpdated"));
    } catch (err) {
      console.error("Failed to update autoEmailDisabled:", err);
      alert("Failed to toggle auto email status.");
    }
  };

  return (
    <main className={`flex flex-col bg-background p-8 ${className}`}>
      <Card className="my-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl min-[450px]:text-2xl sm:text-3xl">
              <span>👥 Student Management</span>
            </CardTitle>
            <p className="text-[0.8rem] sm:text-[1.15rem] text-muted-foreground">
              Manage enrolled students and their progress
            </p>
          </div>

          <div className="flex max-md:justify-between max-md:w-full  items-center gap-2">
            <Button
              variant="outline"
              className="text-[1.15rem]"
              // size="lg"
              onClick={exportData}
            >
              <Download className="!w-5 !h-5 md:mr-2" />
              <span className="max-md:hidden">Export</span>
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              className="px-3 py-2 text-sm md:text-base lg:text-lg flex items-center"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
              <span className=" md:inline">Add Student</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row w-full gap-2 justify-between space-y-2 md:space-y-0">
              <Input
                placeholder="Search students..."
                className="w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="flex items-center max-md:justify-between gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 min-[450px]:mr-2" />
                      <span className="hidden min-[450px]:inline">
                        {statusFilter} Status
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("All")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("Inactive")}
                    >
                      Inactive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={sortByName}>
                    <ArrowUpDown className="w-4 h-4 min-[450px]:hidden" />
                    <span className="hidden min-[450px]:inline">
                      Sort by Name
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRemoveSelectedStudents}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-4"> */}
            <div>
              {filteredStudents.map((student) => (
                <Card
                  key={student._id}
                  className="rounded-xl p-4 transition-shadow hover:shadow-lg dark:hover:shadow-xl hover:cursor-pointer "
                >
                  <CardContent className="px-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="accent-purple-600"
                          checked={selectedStudentIds.includes(student._id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectedStudentIds((prev) =>
                              checked
                                ? [...prev, student._id]
                                : prev.filter((id) => id !== student._id)
                            );
                          }}
                        />
                        {student.favorite && (
                          <Heart className="text-red-500 w-4 h-4" />
                        )}
                        <h3 className="text-xl font-semibold">
                          {student.name}
                        </h3>
                        {student.status === "active" ? (
                          <CheckCircle2 className="text-green-500 w-4 h-4" />
                        ) : (
                          <XCircle className="text-red-500 w-4 h-4" />
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/students/${student.cfHandle}`, {
                                state: { student },
                              })
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditStudent(student);
                              setEditModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleAutoEmail(student)}
                          >
                            {student.autoEmailDisabled ? (
                              <>
                                <BellOff className="h-4 w-4 mr-2" />
                                Auto Email
                              </>
                            ) : (
                              <>
                                <Bell className="h-4 w-4 mr-2" />
                                Auto Email
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => confirmDelete(student._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-col-reverse min-[450px]:grid  min-[450px]:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2 ">
                        <div className="flex items-center gap-2">
                          <AtSign className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{student.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-2 max-[450px]:flex max-[450px]:flex-row max-[450px]:justify-between">
                        <div>
                          <Badge variant="outline" className="text-sm">
                            {student.cfHandle}
                          </Badge>
                        </div>
                        <div
                          className={`font-bold  text-lg ${getRatingColor(
                            student.rating
                          )}`}
                        >
                          {student.rating}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <div className="flex flex-col sm:flex-row sm:space-x-6 md:space-x-8 text-[0.75rem] min-[450px]:text-sm space-y-1">
                        {/* <p>
                          <strong>Current Rating: </strong>
                          <span
                            className={`font-semibold ${
                              student.rating >= 1600
                                ? "text-purple-500"
                                : student.rating >= 1400
                                ? "text-blue-500"
                                : "text-green-500"
                            }`}
                          >
                            {student.rating}
                          </span>
                        </p> */}
                        {/* <p>
                          <strong>Max Rating:</strong> {student.maxRating}
                        </p> */}
                        <p>
                          <strong>Contribution:</strong> {student.contribution}
                        </p>
                        <p>
                          <strong>Reminders:</strong>{" "}
                          {student.inactivityReminderCount || "-"}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-[0.65rem] min-[450px]:text-xs ${
                            student.streak > 0
                              ? "bg-black text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {student.streak}d streak
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <AddStudentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddStudent}
      />
      <EditStudentModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        student={editStudent}
        onSave={handleEditSave}
      />
    </main>
  );
}
