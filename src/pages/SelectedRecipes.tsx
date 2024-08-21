import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: string | null;
}

const SelectedRecipes: React.FC = () => {
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [ingredients, setIngredients] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedRecipeIds = JSON.parse(
      localStorage.getItem("selectedRecipes") || "[]"
    );
    setSelectedRecipeIds(storedRecipeIds);
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (selectedRecipeIds.length === 0) return;

      const fetchedRecipes: Meal[] = [];
      const fetchedIngredients: { [key: string]: string } = {};

      for (const id of selectedRecipeIds) {
        const { data } = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const meal = data.meals[0];
        fetchedRecipes.push(meal);

        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ingredient && measure) {
            fetchedIngredients[ingredient] = measure;
          }
        }
      }

      setRecipes(fetchedRecipes);
      setIngredients(fetchedIngredients);
    };

    fetchRecipes();
  }, [selectedRecipeIds]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
  
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Combined Ingredients</h2>
        <ul className="list-disc pl-5 inline-block text-left">
          {Object.entries(ingredients).map(([ingredient], index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
  
        <h2 className="text-2xl font-bold mt-8 mb-4">Selected Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {recipes.map((recipe) => (
            <div key={recipe.idMeal} className="border p-4 rounded-lg shadow-lg">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="mt-2 text-lg font-semibold">{recipe.strMeal}</h3>
              <p className="mt-2">{recipe.strInstructions}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );   
};

export default SelectedRecipes;
