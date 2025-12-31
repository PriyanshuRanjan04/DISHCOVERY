import axios, { InternalAxiosRequestConfig } from 'axios'

// In production, we use the Vercel rewrite proxy to avoid CORS issues
// However, we maintain the ability to use the direct URL if needed via environment variables
const API_URL = process.env.NODE_ENV === 'production'
    ? '/api/proxy'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 90000, // Increased to 90 seconds to handle slow cold starts and AI generation
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add auth token to requests
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    // We'll add Clerk token here later
    return config
})

// Recipe API calls
export const recipeAPI = {
    search: async (query: string, servings?: number, userId?: string) => {
        const response = await apiClient.post('/api/recipes/search', { query, servings, user_id: userId })
        return response.data
    },

    getPopular: async () => {
        const response = await apiClient.get('/api/recipes/popular')
        return response.data
    },

    getStatus: async (query: string) => {
        const response = await apiClient.get(`/api/recipes/status/${encodeURIComponent(query)}`)
        return response.data
    },

    getAlternatives: async (ingredient: string, recipe_context: string) => {
        const response = await apiClient.post('/api/recipes/alternatives', {
            ingredient,
            recipe_context,
        })
        return response.data
    },

    adjustServings: async (recipe: any, newServings: number) => {
        const response = await apiClient.post('/api/recipes/adjust-servings', {
            recipe,
            newServings,
        })
        return response.data
    },

    downloadPDF: async (recipe: any) => {
        const response = await apiClient.post('/api/recipes/download', { recipe }, {
            responseType: 'blob',
        })
        return response.data
    },

    emailRecipe: async (recipe: any, email: string) => {
        const response = await apiClient.post('/api/recipes/email', { recipe, email })
        return response.data
    },
}

// User API calls
export const userAPI = {
    getProfile: async (userId: string) => {
        const response = await apiClient.get('/api/users/me', {
            params: { user_id: userId }
        })
        return response.data
    },

    getHistory: async (userId: string) => {
        const response = await apiClient.get('/api/users/history', {
            params: { user_id: userId }
        })
        return response.data
    },

    deleteHistoryItem: async (userId: string, historyId: string) => {
        const response = await apiClient.delete(`/api/users/history/${historyId}`, {
            params: { user_id: userId }
        })
        return response.data
    },

    clearHistory: async (userId: string) => {
        const response = await apiClient.delete('/api/users/history/clear', {
            params: { user_id: userId }
        })
        return response.data
    },

    saveRecipe: async (userId: string, recipe: any) => {
        const response = await apiClient.post('/api/users/save-recipe', {
            user_id: userId,
            recipe
        })
        return response.data
    },

    getSavedRecipes: async (userId: string) => {
        const response = await apiClient.get('/api/users/saved-recipes', {
            params: { user_id: userId }
        })
        return response.data
    },

    deleteSavedRecipe: async (userId: string, recipeId: string) => {
        const response = await apiClient.delete(`/api/users/saved-recipes/${recipeId}`, {
            params: { user_id: userId }
        })
        return response.data
    },
}

// Cuisine Explorer API calls
export const explorerAPI = {
    getPosts: async (limit?: number, skip?: number) => {
        const response = await apiClient.get('/api/blog/posts', {
            params: { limit, skip },
        })
        return response.data
    },

    getPost: async (id: string) => {
        const response = await apiClient.get(`/api/blog/posts/${id}`)
        return response.data
    },

    createPost: async (post: { title: string; content: string; tags: string[] }) => {
        const response = await apiClient.post('/api/blog/posts', post)
        return response.data
    },

    addComment: async (postId: string, comment: string) => {
        const response = await apiClient.post(`/api/blog/posts/${postId}/comments`, { comment })
        return response.data
    },

    explore: async (params: { country?: string; state?: string; festival?: string; taste?: string; query?: string; diet?: string }) => {
        const response = await apiClient.get('/api/blog/explore', {
            params,
        })
        return response.data
    },
}

export default apiClient
