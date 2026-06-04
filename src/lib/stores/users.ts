import type { LessonProgress } from '$lib/types';

export interface UserProfile {
	id: string;
	name: string;
	avatar: string;
	createdAt: number;
}

export interface UserData {
	profile: UserProfile;
	lessonProgress: Map<number, LessonProgress>;
	gameHighScores: {
		left: number;
		right: number;
		both: number;
		all: number;
	};
}

const USERS_KEY = 'typing-app-users';
const CURRENT_USER_KEY = 'typing-app-current-user';

const avatars = ['🦁', '🐯', '🐻', '🐼', '🐨', '🐸', '🦊', '🐰', '🐱', '🐶', '🦄', '🐲'];

export function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getRandomAvatar(): string {
	return avatars[Math.floor(Math.random() * avatars.length)];
}

export function getUsers(): UserProfile[] {
	if (typeof window === 'undefined') return [];
	const raw = localStorage.getItem(USERS_KEY);
	if (!raw) return [];
	return JSON.parse(raw);
}

export function saveUsers(users: UserProfile[]) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUserId(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserId(userId: string) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(CURRENT_USER_KEY, userId);
}

export function clearCurrentUserId() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(CURRENT_USER_KEY);
}

export function createUser(name: string, avatar?: string): UserProfile {
	const users = getUsers();
	const newUser: UserProfile = {
		id: generateId(),
		name,
		avatar: avatar || getRandomAvatar(),
		createdAt: Date.now()
	};
	users.push(newUser);
	saveUsers(users);
	return newUser;
}

export function deleteUser(userId: string) {
	const users = getUsers().filter(u => u.id !== userId);
	saveUsers(users);
	
	// Hapus data user
	if (typeof window !== 'undefined') {
		localStorage.removeItem(`typing-app-progress-${userId}`);
		localStorage.removeItem(`typing-app-highscores-${userId}`);
	}
	
	// Clear current user jika yang dihapus adalah current user
	if (getCurrentUserId() === userId) {
		clearCurrentUserId();
	}
}

export function updateUser(userId: string, updates: Partial<UserProfile>) {
	const users = getUsers();
	const index = users.findIndex(u => u.id === userId);
	if (index !== -1) {
		users[index] = { ...users[index], ...updates };
		saveUsers(users);
	}
}

export function getLessonProgress(userId: string): Map<number, LessonProgress> {
	if (typeof window === 'undefined') return new Map();
	const raw = localStorage.getItem(`typing-app-progress-${userId}`);
	if (!raw) return new Map();
	const arr: LessonProgress[] = JSON.parse(raw);
	const map = new Map<number, LessonProgress>();
	for (const p of arr) {
		map.set(p.lessonId, p);
	}
	return map;
}

export function saveLessonProgress(userId: string, progress: LessonProgress) {
	const map = getLessonProgress(userId);
	const existing = map.get(progress.lessonId);
	if (existing) {
		existing.bestWPM = Math.max(existing.bestWPM, progress.bestWPM);
		existing.bestAccuracy = Math.max(existing.bestAccuracy, progress.bestAccuracy);
		existing.completed = existing.completed || progress.completed;
		existing.stars = Math.max(existing.stars, progress.stars);
		existing.attempts += 1;
		map.set(progress.lessonId, existing);
	} else {
		progress.attempts = 1;
		map.set(progress.lessonId, progress);
	}
	const arr = Array.from(map.values());
	localStorage.setItem(`typing-app-progress-${userId}`, JSON.stringify(arr));
}

export function getGameHighScores(userId: string): { left: number; right: number; both: number; letters: number; all: number } {
	if (typeof window === 'undefined') return { left: 0, right: 0, both: 0, letters: 0, all: 0 };
	const raw = localStorage.getItem(`typing-app-highscores-${userId}`);
	if (!raw) return { left: 0, right: 0, both: 0, letters: 0, all: 0 };
	return JSON.parse(raw);
}

export function saveGameHighScore(userId: string, mode: 'left' | 'right' | 'both' | 'letters' | 'all', score: number) {
	const scores = getGameHighScores(userId);
	if (score > scores[mode]) {
		scores[mode] = score;
		localStorage.setItem(`typing-app-highscores-${userId}`, JSON.stringify(scores));
	}
}

export function getTotalStars(userId: string): number {
	const progress = getLessonProgress(userId);
	return Array.from(progress.values()).reduce((sum, p) => sum + p.stars, 0);
}

export function getMaxStars(): number {
	return 36;
}
