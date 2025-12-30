import { createHomeStyles } from '@/assets/styles/home.styles';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/Header';
import TodoInput from '@/components/TodoInput';

export default function Index() {
	const { colors } = useTheme();

	const styles = createHomeStyles(colors);

	return (
		<LinearGradient colors={colors.gradients.background} style={styles.container}>
			<StatusBar barStyle={colors.statusBarStyle} />
			<SafeAreaView style={styles.safeArea}>
				<Header />
				<TodoInput />
			</SafeAreaView>
		</LinearGradient>
	);
}
