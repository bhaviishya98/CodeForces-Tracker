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
} from "lucide-react";
import { useState, useEffect } from "react";
import AddStudentModal from "@/components/student/AddStudentModal"; // adjust path as needed
import axios from "@/lib/axios"; // adjust path as needed
import EditStudentModal from "@/components/student/EditStudentModal"; // adjust path as needed
import { useNavigate } from "react-router-dom";

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

  // const handleSaveEdit = async (updatedData) => {
  //   try {
  //     const res = await axios.put(
  //       `/students/${selectedStudent._id}`,
  //       {
  //         ...updatedData,
  //         cfHandle: updatedData.handle,
  //       }
  //     );
  //     setStudentList((prev) =>
  //       prev.map((s) => (s._id === selectedStudent._id ? res.data : s))
  //     );
  //   } catch (err) {
  //     console.error("Failed to edit student:", err);
  //   }
  // };

  const handleRemoveStudent = async (id) => {
    try {
      await axios.delete(`students/${id}`);
      const updatedList = studentList.filter((student) => student._id !== id);
      setStudentList(updatedList);
      saveToLocalStorage(updatedList); // Save after 
      window.dispatchEvent(new Event("studentDataUpdated"));
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  };

  const confirmDelete = (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      handleRemoveStudent(id);
      window.dispatchEvent(new Event("studentDataUpdated"));

    }
  };

  return (
    <main className={`flex flex-col bg-background p-8 ${className}`}>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-3xl">
              <span>👥 Student Management</span>
            </CardTitle>
            <p className="text-[1.15rem] text-muted-foreground">
              Manage enrolled students and their progress
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="text-[1.15rem]"
              size="lg"
              onClick={exportData}
            >
              <Download className="!w-5 !h-5 mr-2" />
              Export
            </Button>
            <Button
              className="text-[1.15rem]"
              size="lg"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="!w-5 !h-5 mr-2" />
              Add Student
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 justify-between">
              <Input
                placeholder="Search students..."
                className="w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      {statusFilter} Status
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

                <Button variant="outline" size="sm" onClick={sortByName}>
                  Sort by Name
                </Button>

                <Button variant="outline" size="icon" onClick={sortByName}>
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-md overflow-x-auto my-4">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xl">
                  <tr className="border-b">
                    <th className="p-3">
                      <input type="checkbox" />
                    </th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">CF Handle</th>
                    <th className="p-3">Current Rating</th>
                    <th className="p-3">Max Rating</th>
                    <th className="p-3">Streak</th>
                    <th className="p-3">Contribution</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-[1.25rem]">
                  {filteredStudents.map((student, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3">
                        <input type="checkbox" />
                      </td>
                      <td className="p-3">
                        {student.status === "active" ? (
                          <CheckCircle2 className="text-green-500 w-4 h-4" />
                        ) : (
                          <XCircle className="text-red-500 w-4 h-4" />
                        )}
                      </td>
                      <td className="p-3 font-medium flex items-center gap-1">
                        {student.favorite && (
                          <Heart className="text-red-500 w-4 h-4" />
                        )}
                        {student.name}
                      </td>
                      <td className="p-3">{student.email}</td>
                      <td className="p-3">{student.phone}</td>
                      <td className="p-3">
                        <button
                          className="px-2 py-1 rounded bg-muted text-xs font-mono hover:underline text-blue-600"
                          onClick={() =>
                            navigate(`/students/${student.cfHandle}`, {
                              state: { student },
                            })
                          }
                        >
                          {student.cfHandle}
                        </button>
                      </td>

                      <td
                        className="p-3 font-semibold"
                        style={{
                          color:
                            student.rating >= 1600
                              ? "#a855f7"
                              : student.rating >= 1400
                              ? "#3b82f6"
                              : "#22c55e",
                        }}
                      >
                        {student.rating}
                      </td>
                      <td className="p-3 font-semibold">{student.maxRating}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-2 rounded-full text-xs ${
                            student.streak > 0
                              ? "bg-black text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {student.streak} days
                        </span>
                      </td>
                      <td className="p-3 font-medium">
                        {student.contribution}
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditStudent(student);
                                setEditModalOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => confirmDelete(student._id)}
                            >
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
