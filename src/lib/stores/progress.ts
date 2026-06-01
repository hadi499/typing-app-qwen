import type { LessonProgress } from '$lib/types';
import { getCurrentUserId, getLessonProgress, saveLessonProgress as saveUserLessonProgress, getTotalStars as getUserTotalStars, getMaxStars } from '$lib/stores/users';

export function getProgress(lessonId: number): LessonProgress {
	const userId = getCurrentUserId();
	if (!userId) return { lessonId, bestWPM: 0, bestAccuracy: 0, completed: false, stars: 0, attempts: 0 };
	
	const map = getLessonProgress(userId);
	return map.get(lessonId) ?? {
		lessonId,
		bestWPM: 0,
		bestAccuracy: 0,
		completed: false,
		stars: 0,
		attempts: 0
	};
}

export function getAllProgress(): LessonProgress[] {
	const userId = getCurrentUserId();
	if (!userId) return [];
	
	const map = getLessonProgress(userId);
	return Array.from(map.values()).sort((a, b) => a.lessonId - b.lessonId);
}

export function saveLessonProgress(progress: LessonProgress) {
	const userId = getCurrentUserId();
	if (!userId) return;
	
	saveUserLessonProgress(userId, progress);
}

export function calculateStars(wpm: number, accuracy: number): number {
	if (accuracy >= 95 && wpm >= 25) return 3;
	if (accuracy >= 85 && wpm >= 15) return 2;
	if (accuracy >= 70 && wpm >= 10) return 1;
	return 0;
}

export function getTotalStars(): number {
	const userId = getCurrentUserId();
	if (!userId) return 0;
	return getUserTotalStars(userId);
}

export { getMaxStars };
