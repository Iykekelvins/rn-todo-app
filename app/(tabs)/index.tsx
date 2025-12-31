import { useState } from 'react';
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
	TextInput,
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

	const [editingId, setEditingId] = useState<Id<'todos'> | null>(null);
	const [editText, setEditText] = useState('');

	const styles = createHomeStyles(colors);

	const todos = useQuery(api.todos.getTodos);
	const toggleTodo = useMutation(api.todos.toggleTodo);
	const deleteTodo = useMutation(api.todos.deleteTodo);
	const updateTodo = useMutation(api.todos.updateTodo);

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

	const handleDeleteTodo = async (id: Id<'todos'>) => {
		try {
			Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => deleteTodo({ id }),
				},
			]);
		} catch (error) {
			console.log(error);
			Alert.alert('Error', 'Failed to delete todo');
		}
	};

	const handleEditTodo = (todo: Todo) => {
		setEditText(todo.text);
		setEditingId(todo._id);
	};

	const handleSaveEdit = async () => {
		if (editingId) {
			try {
				await updateTodo({ id: editingId, text: editText.trim() });
				setEditingId(null);
				setEditText('');
			} catch (error) {
				console.log(error);
				Alert.alert('Failed to updated todo');
			}
		}
	};

	const handleCancelEdit = () => {
		setEditText('');
		setEditingId(null);
	};

	const renderTodoItem = ({ item }: { item: Todo }) => {
		const isEditing = editingId === item._id;

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

					{isEditing ? (
						<View style={styles.editContainer}>
							<TextInput
								style={styles.editInput}
								value={editText}
								onChangeText={setEditText}
								autoFocus
								multiline
								placeholder='Edit your todo...'
								placeholderTextColor={colors.textMuted}
							/>
							<View style={styles.editButtons}>
								<TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8}>
									<LinearGradient
										colors={colors.gradients.success}
										style={styles.editButton}>
										<Ionicons name='checkmark' size={16} color='#fff' />
										<Text style={styles.editButtonText}>Save</Text>
									</LinearGradient>
								</TouchableOpacity>
								<TouchableOpacity onPress={handleCancelEdit} activeOpacity={0.8}>
									<LinearGradient
										colors={colors.gradients.muted}
										style={styles.editButton}>
										<Ionicons name='close' size={16} color='#fff' />
										<Text style={styles.editButtonText}>Cancel</Text>
									</LinearGradient>
								</TouchableOpacity>
							</View>
						</View>
					) : (
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
								<TouchableOpacity
									onPress={() => handleEditTodo(item)}
									activeOpacity={0.8}>
									<LinearGradient
										colors={colors.gradients.warning}
										style={styles.actionButton}>
										<Ionicons name='pencil' size={14} color='#fff' />
									</LinearGradient>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() => handleDeleteTodo(item._id)}
									activeOpacity={0.8}>
									<LinearGradient
										colors={colors.gradients.danger}
										style={styles.actionButton}>
										<Ionicons name='trash' size={14} color='#fff' />
									</LinearGradient>
								</TouchableOpacity>
							</View>
						</View>
					)}
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
