// components/AddStudentModal.jsx
"use client";
import axios from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { fetchCodeforcesInfo } from "@/lib/fetchCodeforcesInfo";


export default function AddStudentModal({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    handle: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleAdd = () => {
  //   onSubmit(formData);
  //   setFormData({ name: "", email: "", phone: "", handle: "" });
  //   onOpenChange(false);
  // };

  const handleAdd = async () => {
    try {
      const { name, email, phone, handle } = formData;

      // 1. Fetch from Codeforces
      const cfData = await fetchCodeforcesInfo(handle);
      
      // 2. Compose full student object
      const fullStudent = {
        name,
        email,
        phone,
        cfHandle: handle,
        rating: cfData.rating || 0,
        maxRating: cfData.maxRating || 0,
        rank: cfData.rank || "unrated",
        maxRank: cfData.maxRank || "unrated",
        streak: cfData.streak || 0,
        contribution: cfData.contribution || 0,
        status: "active",
      };
      console.log("full student:", fullStudent);

      // 3. Send to backend
      const response = await axios.post("/students", fullStudent);
      
      if (response.status === 201) {
        onSubmit(response.data);
        setFormData({ name: "", email: "", phone: "", handle: "" });
        onOpenChange(false);
      } else if (response.status === 400) {
        alert("Student already exists. Please try a different handle.");
        setFormData({ name: "", email: "", phone: "", handle: "" });
        onOpenChange(false);
      } else {
        console.error("Failed to add student:", response.data);
      }
    } catch (error) {
      console.error("Error adding student:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Student already exists"
      ) {
        alert("CF Handle already exists. Please use a different one.");
      } else {
        alert("Failed to add student. Please try again.");
      }
      setFormData({ name: "", email: "", phone: "", handle: "" });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter student details to add them to the system
          </DialogDescription>
        </DialogHeader>

        <Input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          name="handle"
          placeholder="CF Handle"
          value={formData.handle}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Student</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
