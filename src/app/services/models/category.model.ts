// src/app/services/models/category.model.ts

export interface Category {
    id: number; // Adjust the type based on your backend (number or string)
    name: string;
    imageUrl?: string; // Optional: URL to the category image
    description?: string; // Optional: Description of the category
    // Add other relevant fields as needed
}
