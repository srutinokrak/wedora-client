export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEYS
  if (!apiKey) {
    throw new Error("ImgBB API key is not configured.")
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image file to upload.")
  }
  if (file.size > 32 * 1024 * 1024) {
    throw new Error("Image must be smaller than 32 MB.")
  }

  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body: formData,
    },
  )

  const result = (await response.json().catch(() => null)) as {
    success?: boolean
    data?: { url?: string }
    error?: { message?: string }
  } | null

  if (!response.ok || !result?.success || !result.data?.url) {
    throw new Error(result?.error?.message || "Image upload failed. Please try again.")
  }

  return result.data.url
}
