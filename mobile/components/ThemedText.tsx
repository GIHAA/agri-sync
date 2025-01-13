import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({
  lightColor,
  darkColor,
  type = 'default',
  className,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const typeClasses = {
    default: 'text-base text-black leading-6',
    defaultSemiBold: 'text-base leading-6 font-semibold',
    title: 'text-2xl font-bold leading-8 text-black mb-4',
    subtitle: 'text-xl font-bold',
    link: 'text-base leading-7 text-blue-500',
  };

  return (
    <Text
      className={`${typeClasses[type]} ${className}`}
      {...rest}
    />
  );
}