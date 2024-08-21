import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

interface DropdownProps {
  onSelectCategory: (category: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onSelectCategory }) => {
  const { data, error, isLoading } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      return response.data.categories;
    },
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (data && data.length > 0 && !selectedCategory) {
      setSelectedCategory(data[0].strCategory);
    }
  }, [data, selectedCategory]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const category = event.target.value;
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="relative inline-block text-gray-700">
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded appearance-none shadow focus:outline-none focus:shadow-outline"
      >
        {data?.map((category) => (
          <option key={category.idCategory} value={category.strCategory}>
            {category.strCategory}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.5 8l4.5 4 4.5-4z" />
        </svg>
      </div>
    </div>
  );
};

export default Dropdown;
