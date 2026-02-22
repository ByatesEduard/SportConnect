import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { LoadingSpinner } from '../components/LoadingSpinner'
// ВИПРАВЛЕНО: використовуємо Button з ui замість FormButton (уніфікація компонентів)
import { Button } from '../components/ui'
import axios from '../utils/axios'

// ВИПРАВЛЕНО: уніфікований базовий URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'

export const PostsPage = () => {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchMyPosts = async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get('/posts/user/me')
            setPosts(data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMyPosts()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Мої пости
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Керуйте своїми публікаціями
                            </p>
                        </div>
                        <Link to="/new">
                            <Button variant="primary">
                                Створити новий пост
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="flex flex-col md:flex-row md:flex-wrap gap-6">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post, idx) => (
                            <Card key={idx} className="hover:shadow-lg transition-shadow duration-200">
                                <div className="p-6">
                                    {/* Post Image */}
                                    {post.imgUrl && (
                                        <div className="mb-4">
                                            <img
                                                src={`${API_BASE_URL}/uploads/${post.imgUrl}`}
                                                alt={post.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}

                                    {/* Post Title */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>

                                    {/* Post Content Preview */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {post.text}
                                    </p>

                                    {/* Post Meta */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>
                                            {new Date(post.createdAt).toLocaleDateString('uk-UA')}
                                        </span>
                                        <div className="flex items-center space-x-3">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {post.views || 0}
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                {post.comments?.length || 0}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 flex gap-2">
                                        <Link
                                            to={`/${post._id}`}
                                            className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition duration-200"
                                        >
                                            Переглянути
                                        </Link>
                                        <Link
                                            to={`/${post._id}/edit`}
                                            className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
                                        >
                                            Редагувати
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full w-full">
                            <Card className="text-center py-12">
                                <div className="text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        Немає постів
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Почніть з створення вашого першого поста
                                    </p>
                                    <div className="mt-6">
                                        <Link to="/new">
                                            <Button variant="primary">
                                                Створити пост
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
