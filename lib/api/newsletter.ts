import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export interface NewsletterSubscribeData {
  email: string
  fullName?: string
  companyName?: string
  frequency?: "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY"
  emailSubscribed?: boolean
  whatsappSubscribed?: boolean
  smsSubscribed?: boolean
  phoneNumber?: string
}

export interface NewsletterSubscribeResponse {
  success: boolean
  message: string
  subscriber?: any
}

export const subscribeNewsletter = async (
  data: NewsletterSubscribeData
): Promise<NewsletterSubscribeResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/newsletter/subscribe`, {
      email: data.email.trim(),
      fullName: data.fullName?.trim() || "",
      companyName: data.companyName?.trim() || "",
      frequency: data.frequency || "MONTHLY",
      emailSubscribed: data.emailSubscribed ?? true,
      whatsappSubscribed: data.whatsappSubscribed ?? false,
      smsSubscribed: data.smsSubscribed ?? false,
      phoneNumber: data.phoneNumber?.trim() || "",
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error(
          error.response?.data?.error || "You are already subscribed to our newsletter."
        )
      }
      throw new Error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to subscribe to newsletter. Please try again."
      )
    }
    throw new Error("An unexpected error occurred while subscribing.")
  }
}
