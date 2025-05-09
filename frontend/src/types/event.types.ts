// Kiểu dữ liệu cho thông tin người tạo rút gọn trả về từ API
import {User} from './user.types';
import { EventPostCommentType } from './comment.types'; // Có thể import sau

interface EventCreator {
    id: number
    username: string
    avatarUrl?: string | null
    fullName?: string | null
    bio?: string | null
    location?: string | null
    isVerified?: boolean
  }

  export interface EventPostType {
    id: number;
    eventId: number;
    userId: number;
    content: string;
    imageUrl?: string | null;
    createdAt: string; 
    updatedAt: string; 
    author: BasicUser; 
    commentCount?: number;
    comments?: EventPostCommentType[]; // Mảng các bình luận cho bài viết
}
  
  // Kiểu dữ liệu chính cho một sự kiện trả về từ API list events
  export interface EventType {
    id: number
    creatorId: number
    title: string
    description: string | null
    location: string | null
    eventTime: string 
    createdAt: string
    updatedAt: string
    creator: EventCreator 
    isParticipating?: boolean
    isLiked?: boolean 
    likeCount?: number
    imageUrl?: string | null
    // isVerified?: boolean 
    participants?: BasicUser[]; // Dùng BasicUser
    posts?: EventPostType[]; 
  }
  
  // Kiểu dữ liệu cho response từ API get all events
  export interface GetAllEventsResponse {
    message: string
    events: EventType[]
  }

  export interface GetEventByIdResponse {
    message: string;
    event: EventType; 
}
  