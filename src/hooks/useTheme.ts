import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";


const useTheme = () => {
  const context = useContext(ThemeContext);

  return context;
};

export default useTheme;