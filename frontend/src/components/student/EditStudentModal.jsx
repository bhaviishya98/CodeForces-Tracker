// components/EditStudentModal.jsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { fetchCodeforcesInfo } from "@/lib/fetchCodeforcesInfo";
import axios from "@/lib/axios";


export default function EditStudentModal({
  open,
  onOpenChange,
  student,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    handle: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        handle: student.cfHandle || student.handle || "",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const cfData = await fetchCodeforcesInfo(formData.handle);

    

      const updatedStudent = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cfHandle: formData.handle,
        ...cfData, // include full CF data
      };


      const response = await axios.put(
        `/students/${student._id}`,
        updatedStudent
      );

      if (response.status === 200) {
        onSave(response.data); // return the updated student to parent
        onOpenChange(false);
      } else {
        console.error("Failed to update student:", response.data);
        alert("Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Something went wrong while saving.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>Update student information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="phone">Phone No.</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="handle">CF Handle</Label>
            <Input
              id="handle"
              name="handle"
              placeholder="CF Handle"
              value={formData.handle}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
