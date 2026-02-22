import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { updatePost } from '../redux/features/post/postSlice'
import { Input, Textarea, Button } from '../components/ui'
import { Card } from '../components/Card'
import { toast } from 'react-toastify'
import axios from '../utils/axios'

export const EditPostPage = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [oldImage, setOldImage] = useState('')
    const [newImage, setNewImage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const fetchPost = useCallback(async () => {
        try {
            const { data } = await axios.get(`/posts/${params.id}`)
            setTitle(data.title)
            setText(data.text)
            setOldImage(data.imgUrl)
        } catch (error) {
            console.log(error)
            toast.error('Помилка при завантаженні поста')
        }
    }, [params.id])

    useEffect(() => {
        fetchPost()
    }, [fetchPost])

    // ВИПРАВЛЕНО: async + .unwrap() + toast
    const submitHandler = async () => {
        try {
            const updatedPost = new FormData()
            updatedPost.append('title', title)
            updatedPost.append('text', text)
            updatedPost.append('id', params.id)
            updatedPost.append('image', newImage)
            await dispatch(updatePost(updatedPost)).unwrap()
            toast.success('Пост успішно оновлено!')
            navigate('/posts')
        } catch (error) {
            console.log(error)
            toast.error('Помилка при оновленні поста')
        }
    }

    // ВИПРАВЛЕНО: скидаємо всі поля включно зі зображеннями
    const clearFormHandler = () => {
        setTitle('')
        setText('')
        setOldImage('')
        setNewImage('')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Редагувати пост
                    </h1>
                </div>

                <Card>
                    <div className="p-6">
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Зображення
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                                    <div className="space-y-1 text-center">
                                        {/* ВИПРАВЛЕНО: використовуємо уніфікований базовий URL */}
                                        {oldImage && !newImage && (
                                            <div className="space-y-4">
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/${oldImage}`}
                                                    alt="Поточне зображення"
                                                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setOldImage('')}
                                                    className="text-sm text-red-600 hover:text-red-500"
                                                >
                                                    Видалити зображення
                                                </button>
                                            </div>
                                        )}
                                        {newImage && (
                                            <div className="space-y-4">
                                                <img
                                                    src={URL.createObjectURL(newImage)}
                                                    alt="Нове зображення"
                                                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewImage('')}
                                                    className="text-sm text-red-600 hover:text-red-500"
                                                >
                                                    Скасувати нове зображення
                                                </button>
                                            </div>
                                        )}
                                        {!oldImage && !newImage && (
                                            <div>
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label
                                                        htmlFor="image-upload-edit"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                                                    >
                                                        <span>Завантажити файл</span>
                                                        <input
                                                            id="image-upload-edit"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                setNewImage(e.target.files[0])
                                                                setOldImage('')
                                                            }}
                                                        />
                                                    </label>
                                                    <p className="pl-1">або перетягніть сюди</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Input
                                name="title"
                                type="text"
                                label="Заголовок"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Введіть заголовок поста"
                                required
                            />

                            <Textarea
                                name="text"
                                label="Текст поста"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Напишіть текст вашого поста..."
                                rows={8}
                                required
                            />

                            <div className="flex gap-4 justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={clearFormHandler}
                                >
                                    Скасувати
                                </Button>

                                <Button
                                    type="submit"
                                    onClick={submitHandler}
                                    disabled={!title || !text}
                                >
                                    Оновити пост
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    )
}
