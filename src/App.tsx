import { Routes, Route } from 'react-router-dom';
import AllRecipes from './pages/AllRecipes';
import Recipe from './pages/Recipe';
import SelectedRecipes from './pages/SelectedRecipes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AllRecipes />} />
      <Route path="/recipe/:id" element={<Recipe />} />
      <Route path="/selected-recipes" element={<SelectedRecipes />} />
    </Routes>
  );
}

export default App;
