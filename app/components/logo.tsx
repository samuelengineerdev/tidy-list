import darkLargeLogo from '@/assets/logos/dark-large-logo.png';
import whiteLargeLogo from '@/assets/logos/white-large-logo.png';
import { Image } from '@/components/ui/image';

type Props = {
    size?: number;
}

const Logo = ({ size = 24 }: Props) => {
    const colorScheme = 'dark'

    return (
        <Image
            source={colorScheme === 'dark' ? whiteLargeLogo : darkLargeLogo}
            alt="Tidy List"
            className={`w-${size}`}
            resizeMode="contain"
        />
    );
};

export default Logo;
