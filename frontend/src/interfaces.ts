/**
 * Contains TypeScript interfaces and types used throughout the project.
 */

interface Task {
    id: number,
    createdAt: string,
    name: string,
    complete: boolean
}

export type {
	Task
};