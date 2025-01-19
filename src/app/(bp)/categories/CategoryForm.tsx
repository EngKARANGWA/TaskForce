"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";

interface Category {
  name?: string;
  description?: string;
  parentId?: number;
}

interface CategoryFormProps {
  category?: Partial<Category>;
  onSubmit: (data: Partial<Category>) => Promise<void>;
}

export default function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: category?.name || "",
    description: category?.description || "",
    parentId: category?.parentId || undefined,
  });

  const [errors, setErrors] = useState({
    name: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? Number(value) : undefined,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name?.trim()) {
      setErrors(prev => ({
        ...prev,
        name: true,
      }));
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {category ? "Edit Category" : "New Category"}
      </h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Category Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">Category name is required</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Parent Category</label>
        <input
          type="number"
          name="parentId"
          value={formData.parentId || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="Parent Category ID (optional)"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        {category ? "Update" : "Create"} Category
      </button>
    </form>
  );
}