import api from "./index"
import type { User } from "../types/user.types"

// Kiểu dữ liệu cho response từ API lấy thông tin người dùng
interface GetUserProfileResponse {
  user: User
}

/**
 * Lấy thông tin profile của một người dùng theo ID
 * @param userId ID của người dùng cần lấy thông tin
 * @returns Promise chứa thông tin người dùng
 */
export const getUserProfileApi = async (userId: number): Promise<GetUserProfileResponse> => {
  try {
    const response = await api.get<GetUserProfileResponse>(`/users/${userId}`)
    return response.data
  } catch (error: any) {
    console.error("Lỗi API Get User Profile:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Không thể tải thông tin người dùng.")
  }
}

// Xuất các API khác đã có
export * from "./auth.api"
