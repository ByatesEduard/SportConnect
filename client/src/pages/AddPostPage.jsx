import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../redux/features/post/postSlice'
import { Input, Textarea, Button } from '../components/ui'
import { Card } from '../components/Card'
import { toast } from 'react-toastify'

export const AddPostPage = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [image, setImage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // ВИПРАВЛЕНО: async + .unwrap() щоб помилки thunk потрапляли в catch
    const submitHandler = async () => {
        try {
            const data = new FormData()
            data.append('title', title)
            data.append('text', text)
            data.append('image', image)
            await dispatch(createPost(data)).unwrap()
            toast.success('Пост успішно створено!')
            navigate('/home')
        } catch (error) {
            console.log(error)
            toast.error('Помилка при створенні поста')
        }
    }

    const clearFormHandler = () => {
        setText('')
        setTitle('')
        setImage('')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Створити новий пост
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Поділіться своїми думками зі спільнотою
                    </p>
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
                                        {image ? (
                                            <div className="space-y-4">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Preview"
                                                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setImage('')}
                                                    className="text-sm text-red-600 hover:text-red-500"
                                                >
                                                    Видалити зображення
                                                </button>
                                            </div>
                                        ) : (
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
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="image-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                    >
                                                        <span>Завантажити файл</span>
                                                        <input
                                                            id="image-upload"
                                                            name="image-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*"
                                                            onChange={(e) => setImage(e.target.files[0])}
                                                        />
                                                    </label>
                                                    <p className="pl-1">або перетягніть сюди</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF до 10MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Title Input */}
                            <Input
                                name="title"
                                type="text"
                                label="Заголовок"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Введіть заголовок поста"
                                required
                            />

                            {/* Content Textarea */}
                            <Textarea
                                name="text"
                                label="Текст поста"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Напишіть текст вашого поста..."
                                rows={8}
                                required
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={clearFormHandler}
                                >
                                    Очистити
                                </Button>

                                <Button
                                    type="submit"
                                    onClick={submitHandler}
                                    disabled={!title || !text}
                                >
                                    Опублікувати пост
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    )
}
