import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { createHomeStyles } from '@/assets/styles/home.styles';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const TodoInput = () => {
	const { colors } = useTheme();
	const styles = createHomeStyles(colors);

	const [newTodo, setNewTodo] = useState('');
	const addTodo = useMutation(api.todos.addTodo);

	const handleAddTodo = async () => {
		if (newTodo.trim()) {
			try {
				await addTodo({ text: newTodo.trim() });
				setNewTodo('');
			} catch (error) {
				Alert.alert('Error', 'Failed to add todo');
				console.log(error);
			}
		}
	};

	return (
		<View style={styles.inputSection}>
			<View style={styles.inputWrapper}>
				<TextInput
					style={styles.input}
					placeholder='What needs to be done?'
					value={newTodo}
					onChangeText={setNewTodo}
					onSubmitEditing={handleAddTodo}
					// multiline
					placeholderTextColor={colors.textMuted}
				/>
				<TouchableOpacity
					onPress={handleAddTodo}
					activeOpacity={0.8}
					disabled={!newTodo.trim()}>
					<LinearGradient
						colors={
							newTodo.trim() ? colors.gradients.primary : colors.gradients.muted
						}
						style={[styles.addButton, !newTodo.trim() && styles.addButtonDisabled]}>
						<Ionicons name='add' size={24} color='#fff' />
					</LinearGradient>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default TodoInput;
