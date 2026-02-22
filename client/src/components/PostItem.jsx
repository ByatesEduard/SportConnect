import React from 'react'
import { AiFillEye, AiOutlineMessage } from 'react-icons/ai'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Card } from './Card'

export const PostItem = ({ post }) => {
    if (!post) {
        return (
            <Card className="text-center py-12">
                <div className="text-gray-500">
                    <div className="text-xl">Завантаження...</div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200 group">
            <Link to={`/${post._id}`} className="block">
                <div className="p-6">
                    {/* Post Image */}
                    {post.imgUrl && (
                        <div className="mb-4">
                            <img
                                src={`http://localhost:3001/uploads/${post.imgUrl}`}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                    )}

                    {/* Post Header */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-600 font-medium">
                            {post.username || 'Анонім'}
                        </div>
                        <div className="text-sm text-gray-500">
                            <Moment date={post.createdAt} format="D MMM YYYY" />
                        </div>
                    </div>

                    {/* Post Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {post.title}
                    </h3>

                    {/* Post Content Preview */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.text}
                    </p>

                    {/* Post Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <AiFillEye className="h-4 w-4 mr-1" />
                                {post.views || 0}
                            </span>
                            <span className="flex items-center">
                                <AiOutlineMessage className="h-4 w-4 mr-1" />
                                {post.comments?.length || 0}
                            </span>
                        </div>
                        
                        <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                </div>
            </Link>
        </Card>
    )
}

export default PostItem
