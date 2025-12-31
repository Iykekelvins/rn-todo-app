import { useMutation, useQuery } from 'convex/react';
import { useTheme } from '@/hooks/useTheme';
import { api } from '@/convex/_generated/api';
import { createHomeStyles } from '@/assets/styles/home.styles';
import { LinearGradient } from 'expo-linear-gradient';
import {
	Alert,
	FlatList,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/Header';
import TodoInput from '@/components/TodoInput';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

type Todo = Doc<'todos'>;

export default function Index() {
	const { colors } = useTheme();

	const styles = createHomeStyles(colors);

	const todos = useQuery(api.todos.getTodos);
	const toggleTodo = useMutation(api.todos.toggleTodo);

	const isLoading = todos === undefined;

	if (isLoading) return <LoadingSpinner />;

	const handleToggleTodo = async (id: Id<'todos'>) => {
		try {
			await toggleTodo({ id });
		} catch (error) {
			console.log(error);
			Alert.alert('Error', 'Failed to toggle todo');
		}
	};

	const renderTodoItem = ({ item }: { item: Todo }) => {
		return (
			<View style={styles.todoItemWrapper}>
				<LinearGradient
					colors={colors.gradients.surface}
					style={styles.todoItem}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}>
					{/* checkbox container */}
					<TouchableOpacity
						style={styles.checkbox}
						activeOpacity={0.7}
						onPress={() => handleToggleTodo(item._id)}>
						<LinearGradient
							colors={
								item.isCompleted ? colors.gradients.success : colors.gradients.muted
							}
							style={[
								styles.checkboxInner,
								{ borderColor: item.isCompleted ? 'transparent' : colors.border },
							]}>
							{item.isCompleted && (
								<Ionicons name='checkmark' size={18} color='#fff' />
							)}
						</LinearGradient>
					</TouchableOpacity>

					<View style={styles.todoTextContainer}>
						<Text
							style={[
								styles.todoText,
								item.isCompleted && {
									textDecorationLine: 'line-through',
									color: colors.textMuted,
									opacity: 0.6,
								},
							]}>
							{item.text}
						</Text>

						<View style={styles.todoActions}>
							<TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
								<LinearGradient
									colors={colors.gradients.warning}
									style={styles.actionButton}>
									<Ionicons name='pencil' size={14} color='#fff' />
								</LinearGradient>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
								<LinearGradient
									colors={colors.gradients.danger}
									style={styles.actionButton}>
									<Ionicons name='trash' size={14} color='#fff' />
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</View>
				</LinearGradient>
			</View>
		);
	};

	return (
		<LinearGradient colors={colors.gradients.background} style={styles.container}>
			<StatusBar barStyle={colors.statusBarStyle} />
			<SafeAreaView style={styles.safeArea}>
				<Header />
				<TodoInput />
				<FlatList
					data={todos}
					renderItem={renderTodoItem}
					keyExtractor={(item) => item._id}
					style={styles.todoList}
					contentContainerStyle={styles.todoListContent}
					ListEmptyComponent={<EmptyState />}
				/>
			</SafeAreaView>
		</LinearGradient>
	);
}
