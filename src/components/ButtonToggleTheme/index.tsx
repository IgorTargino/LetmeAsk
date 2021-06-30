import React from "react";
import useTheme from "../../hooks/useTheme";

import { FaMoon, FaSun } from "react-icons/fa";

import styles from './styles.module.scss';

const ButtonToggleTheme = () => {
  const { toggleDarkMode, isDark } = useTheme();

  return (
    <button className={styles.toggleTheme} type="button" onClick={toggleDarkMode}>
      {isDark ? <FaMoon size={20} /> : <FaSun size={20} />}
    </button>
  );
};

export default ButtonToggleTheme;
