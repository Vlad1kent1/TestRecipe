import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface CardProps {
  id: string;
}

const Card: React.FC<CardProps> = ({ id }) => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleClick = () => {
    navigate(`/recipe/${id}`);
  };

  useEffect(() => {
    const selectedRecipes = JSON.parse(
      localStorage.getItem("selectedRecipes") || "[]"
    ) as string[];
    setIsChecked(selectedRecipes.includes(id));
  }, [id]);

  const toggleSelection = () => {
    const selectedRecipes = JSON.parse(
      localStorage.getItem("selectedRecipes") || "[]"
    ) as string[];

    if (selectedRecipes.includes(id)) {
      const updatedRecipes = selectedRecipes.filter(
        (recipeId: string) => recipeId !== id
      );
      localStorage.setItem("selectedRecipes", JSON.stringify(updatedRecipes));
      setIsChecked(false);
    } else {
      selectedRecipes.push(id);
      localStorage.setItem("selectedRecipes", JSON.stringify(selectedRecipes));
      setIsChecked(true);
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !data?.meals?.[0]) return <div>Error loading data</div>;

  const meal = data.meals[0];

  return (
    <div className="relative bg-[#fffade] rounded-3xl shadow-lg overflow-hidden cursor-pointer">
      <div onClick={handleClick}>
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-auto"
        />
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold">{meal.strMeal}</h3>
          <p className="text-gray-700">{meal.strCategory}</p>
          <p className="text-gray-500">{meal.strArea}</p>
        </div>
      </div>{" "}
      <div className="absolute top-2 right-2 rounded-3xl">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={toggleSelection}
          className="w-6 h-6 rounded-3xl"
        />
      </div>
    </div>
  );
};

export default Card;
