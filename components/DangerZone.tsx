import { createSettingsStyles } from '@/assets/styles/settings.styles';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Alert, TouchableOpacity } from 'react-native';

const DangerZone = () => {
	const { colors } = useTheme();

	const styles = createSettingsStyles(colors);

	const clearAllTodos = useMutation(api.todos.clearAllTodos);

	const handleResetApp = async () => {
		Alert.alert(
			'Reset App',
			'This will delete ALL your todos permanently. This Action cannot be undone.',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Delete All',
					style: 'destructive',
					onPress: async () => {
						try {
							const result = await clearAllTodos();
							Alert.alert(
								'App Reset',
								`Successfully deleted ${result.deletedCount} todo${result.deletedCount === 1 ? '' : 's'}. Your app has been reset
                `
							);
						} catch (error) {
							console.log(error);
							Alert.alert('Error', 'Failed to reset app');
						}
					},
				},
			]
		);
	};
	return (
		<LinearGradient colors={colors.gradients.surface} style={styles.section}>
			<Text style={styles.sectionTitleDanger}>Danger Zone</Text>

			<TouchableOpacity
				style={[styles.actionButton, { borderBottomWidth: 0 }]}
				onPress={handleResetApp}
				activeOpacity={0.7}>
				<View style={styles.actionLeft}>
					<LinearGradient colors={colors.gradients.danger} style={styles.actionIcon}>
						<Ionicons name='trash' size={18} color='#fff' />
					</LinearGradient>
					<Text style={styles.actionTextDanger}>Reset App</Text>
				</View>
				<Ionicons name='chevron-forward' size={18} color={colors.textMuted} />
			</TouchableOpacity>
		</LinearGradient>
	);
};

export default DangerZone;
