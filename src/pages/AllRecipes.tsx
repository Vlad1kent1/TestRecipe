import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Card from "../components/Card";
import Dropdown from "../components/Dropdown";
import SearchBox from "../components/SearchBox";
import Pagination from "../components/Pagination";
import RecipesIcon from "../assets/recipes.svg";
import { useNavigate } from "react-router-dom";

interface Meal {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

const AllRecipes: React.FC = () => {
  const [category, setCategory] = useState<string>("Beef");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recipesPerPage, setRecipesPerPage] = useState<number>(10);

  const navigate = useNavigate();

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  const fetchRecipes = async (): Promise<Meal[]> => {
    const { data } = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    return data.meals;
  };

  const { data, error, isLoading } = useQuery<Meal[]>({
    queryKey: ["recipes", category],
    queryFn: fetchRecipes,
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const determineRecipesPerPage = (screenSize: number): number => {
    if (screenSize < 640) return 5;
    if (screenSize < 768) return 10;
    if (screenSize < 1024) return 15;
    if (screenSize < 1280) return 20;
    if (screenSize < 1536) return 25;
    return 30;
  };

  useEffect(() => {
    const updateRecipesPerPage = () => {
      setRecipesPerPage(determineRecipesPerPage(window.innerWidth));
    };

    updateRecipesPerPage();
    window.addEventListener("resize", updateRecipesPerPage);

    return () => {
      window.removeEventListener("resize", updateRecipesPerPage);
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading recipes</div>;

  const filteredRecipes = data?.filter((meal) =>
    meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = filteredRecipes
    ? Math.ceil(filteredRecipes.length / recipesPerPage)
    : 1;

  const displayedRecipes = filteredRecipes?.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  const gridRows = displayedRecipes?.length
    ? Math.ceil(displayedRecipes.length / 5)
    : 1;

  return (
    <div className="p-12 space-y-8">
      <div className="flex flex-row items-center justify-between px-4">
        <div onClick={() => navigate("/selected-recipes")}>
          <img
            src={RecipesIcon}
            className="icon recipes size-[32px] hover:size-[36px]"
            alt="Recipes Icon"
          />
        </div>
        <div className="space-x-4">
          <Dropdown onSelectCategory={handleCategoryChange} />
          <SearchBox onSearch={handleSearch} />
        </div>
      </div>
      <div
        className={`grid grid-rows-${gridRows} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4`}
      >
        {displayedRecipes?.map(
          (meal) => meal.idMeal && <Card key={meal.idMeal} id={meal.idMeal} />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default AllRecipes;
