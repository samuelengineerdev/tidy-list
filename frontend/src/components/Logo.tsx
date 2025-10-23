import darkLargeLogo from "@/assets/dark-large-logo.png"
import darkLogo from "@/assets/dark-logo.png"
import whiteLargeLogo from "@/assets/white-large-logo.png"
import whiteLogo from "@/assets/white-logo.png"
import { useTheme } from "@/contexts/ThemeContext";

const Logo = () => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center">
      <img src={theme === 'dark' ? whiteLargeLogo : darkLargeLogo} alt="Tidy List" className="h-8" />
    </div>
  );
};

export default Logo;
