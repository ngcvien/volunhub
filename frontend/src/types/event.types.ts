// Kiểu dữ liệu cho thông tin người tạo rút gọn trả về từ API
interface EventCreator {
    id: number
    username: string
    avatarUrl?: string | null
    fullName?: string | null
    bio?: string | null
    location?: string | null
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
    imageUrl?: string || null
  }
  
  // Kiểu dữ liệu cho response từ API get all events
  export interface GetAllEventsResponse {
    message: string
    events: EventType[]
  }
  