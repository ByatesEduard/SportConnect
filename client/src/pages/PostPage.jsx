import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    AiFillEye,
    AiOutlineMessage,
    AiTwotoneEdit,
    AiFillDelete,
} from 'react-icons/ai'
import Moment from 'react-moment'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import axios from '../utils/axios'
import { removePost } from '../redux/features/post/postSlice'
import {
    createComment,
    getPostComments,
} from '../redux/features/comment/commentSlice'
import { CommentItem } from '../components/CommentItem'
import { Card } from '../components/Card'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Textarea, Button } from '../components/ui'

// ВИПРАВЛЕНО: уніфікований базовий URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'

export const PostPage = () => {
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState('')

    const { user } = useSelector((state) => state.auth)
    const { comments } = useSelector((state) => state.comment)
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()

    // ВИПРАВЛЕНО: async + .unwrap() — помилки thunk тепер потрапляють у catch
    const removePostHandler = async () => {
        try {
            await dispatch(removePost(params.id)).unwrap()
            toast.success('Пост видалено')
            navigate('/posts')
        } catch (error) {
            console.log(error)
            toast.error('Помилка при видаленні поста')
        }
    }

    // ВИПРАВЛЕНО: async + .unwrap()
    const handleSubmit = async () => {
        if (!comment.trim()) return
        try {
            const postId = params.id
            await dispatch(createComment({ postId, comment })).unwrap()
            setComment('')
        } catch (error) {
            console.log(error)
            toast.error('Помилка при додаванні коментаря')
        }
    }

    const fetchComments = useCallback(async () => {
        try {
            dispatch(getPostComments(params.id))
        } catch (error) {
            console.log(error)
        }
    }, [params.id, dispatch])

    const fetchPost = useCallback(async () => {
        try {
            const { data } = await axios.get(`/posts/${params.id}`)
            setPost(data)
        } catch (error) {
            console.log(error)
            toast.error('Помилка при завантаженні поста')
        }
    }, [params.id])

    useEffect(() => {
        fetchPost()
    }, [fetchPost])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8">
                <div className="flex flex-col gap-8">
                    {/* Back Button */}
                    <div>
                        <button
                            onClick={() => navigate('/posts')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-500 transition duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7z" />
                            </svg>
                            Назад
                        </button>
                    </div>

                    {/* Post Content */}
                    <Card>
                        <div className="p-6">
                            {/* Post Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {post.title}
                                    </h1>
                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <AiFillEye className="h-4 w-4 mr-1" />
                                            {post.views || 0}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span className="flex items-center">
                                            <AiOutlineMessage className="h-4 w-4 mr-1" />
                                            {comments?.length || 0}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-1">
                                        <Moment date={post.createdAt} format="D MMMM YYYY" />
                                    </p>
                                </div>

                                {/* Actions — тільки для автора */}
                                {user?._id === post.author && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/${params.id}/edit`)}
                                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-500 transition duration-200"
                                        >
                                            <AiTwotoneEdit className="h-4 w-4 mr-1" />
                                            Редагувати
                                        </button>
                                        <button
                                            onClick={removePostHandler}
                                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-500 transition duration-200"
                                        >
                                            <AiFillDelete className="h-4 w-4 mr-1" />
                                            Видалити
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Post Image */}
                            {post.imgUrl && (
                                <div className="mt-6">
                                    <img
                                        src={`${API_BASE_URL}/uploads/${post.imgUrl}`}
                                        alt={post.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            {/* Post Content
                                ВИПРАВЛЕНО: замість dangerouslySetInnerHTML використовуємо
                                whitespace-pre-wrap для безпечного рендеру plain-text.
                                Якщо text є HTML — підключіть DOMPurify:
                                import DOMPurify from 'dompurify'
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.text) }}
                            */}
                            <div className="mt-6 prose max-w-none text-gray-700 whitespace-pre-wrap">
                                {post.text}
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-8 border-t pt-8 px-6 pb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Коментарі ({comments?.length || 0})
                            </h3>

                            {/* Add Comment Form */}
                            <Card className="bg-gray-50 mb-6">
                                <div className="p-6">
                                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                                        <Textarea
                                            name="comment"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Напишіть коментар..."
                                            rows={3}
                                            required
                                        />
                                        <Button
                                            type="submit"
                                            onClick={handleSubmit}
                                            disabled={!comment.trim()}
                                        >
                                            Додати коментар
                                        </Button>
                                    </form>
                                </div>
                            </Card>

                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments?.map((cmt) => (
                                    <CommentItem key={cmt._id} cmt={cmt} />
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
