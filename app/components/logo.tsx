import darkLargeLogo from '@/assets/logos/dark-large-logo.png';
import whiteLargeLogo from '@/assets/logos/white-large-logo.png';
import { Image } from '@/components/ui/image';

const Logo = () => {
    const colorScheme = 'dark'

    return (
        <Image
            source={colorScheme === 'dark' ? whiteLargeLogo : darkLargeLogo}
            alt="Tidy List"
            className="h-8 w-auto"
            resizeMode="contain"
        />
    );
};

export default Logo;
