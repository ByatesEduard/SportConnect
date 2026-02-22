import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card } from './Card'

export const PopularPosts = () => {
    const { posts } = useSelector((state) => state.data) || {}
    
    // Get popular posts (sorted by views)
    const popularPosts = posts?.items 
        ? [...posts.items]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
        : []

    if (!popularPosts.length) {
        return (
            <Card>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Популярні пости
                    </h2>
                    <div className="text-center py-8">
                        <div className="text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 6h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 012-2h2a2 2 0 01.414-.91L10.586 7.414a2 2 0 01-.414-.91L7 2H6a2 2 0 00-2 2v2a2 2 0 00 2 2z" />
                            </svg>
                            <p className="mt-4 text-gray-500">
                                Популярні пости відсутні
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Популярні пости
                </h2>
                
                <div className="space-y-3">
                    {popularPosts.map((post, index) => (
                        <Link
                            key={post._id}
                            to={`/${post._id}`}
                            className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {post.title}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="text-xs">{post.views || 0}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link
                        to="/posts"
                        className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                        Переглянути всі пости →
                    </Link>
                </div>
            </div>
        </Card>
    )
}

export default PopularPosts
