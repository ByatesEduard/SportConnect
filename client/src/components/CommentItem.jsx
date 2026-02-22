import React from 'react'
import Moment from 'react-moment'
import { Card } from './Card'

export const CommentItem = ({ cmt }) => {
    const avatar = cmt.comment?.trim().toUpperCase().split('').slice(0, 2) || 'AN'
    const username = cmt.username || 'Анонімний користувач'
    
    return (
        <Card className="bg-gray-50">
            <div className="p-4">
                <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {avatar}
                        </div>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                                {username}
                            </h4>
                            {cmt.createdAt && (
                                <span className="text-xs text-gray-500">
                                    <Moment date={cmt.createdAt} format="D MMM YYYY, HH:mm" />
                                </span>
                            )}
                        </div>
                        
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {cmt.comment}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CommentItem
