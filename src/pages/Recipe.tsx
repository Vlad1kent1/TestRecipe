import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  [key: string]: string | null;
}

const Recipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchRecipe = async (): Promise<Meal> => {
    const { data } = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    return data.meals[0];
  };

  const { data, error, isLoading } = useQuery<Meal>({
    queryKey: ["recipe", id],
    queryFn: fetchRecipe,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading recipe</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800"
      >
        Go Back
      </button>
  
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{data?.strMeal}</h1>
  
      <img
        src={data?.strMealThumb}
        alt={data?.strMeal}
        className="w-full h-auto rounded-lg shadow-lg mb-6"
      />
  
      <p className="text-lg text-gray-700 mb-2">
        <strong>Category:</strong> {data?.strCategory}
      </p>
      <p className="text-lg text-gray-700 mb-2">
        <strong>Area:</strong> {data?.strArea}
      </p>
      <p className="text-lg text-gray-700 mb-6">
        <strong>Instructions:</strong> {data?.strInstructions}
      </p>
  
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ingredients:</h2>
      <ul className="list-disc list-inside text-lg text-gray-700 space-y-1">
        {Object.keys(data!)
          .filter((key) => key.startsWith("strIngredient") && data![key])
          .map((key, index) => (
            <li key={index}>
              {data![key]} - {data!["strMeasure" + key.slice(13)]}
            </li>
          ))}
      </ul>
  
      {data?.strYoutube && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Video:</h2>
          <a
            href={data.strYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  );  
};

export default Recipe;
