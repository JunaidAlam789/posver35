"use server"

import { put, del, list } from "@vercel/blob"

export async function uploadProductImage(formData: FormData) {
  const file = formData.get("file") as File

  if (!file) {
    return { error: "No file provided" }
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!validTypes.includes(file.type)) {
    return { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are supported." }
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size exceeds 5MB limit." }
  }

  try {
    // Generate a unique filename with timestamp and original extension
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `product-${timestamp}.${extension}`

    // Upload to Vercel Blob Store
    const blob = await put(filename, file, {
      access: "public",
    })

    return {
      success: true,
      url: blob.url,
      filename: blob.pathname,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      error: "Failed to upload image. Please try again.",
    }
  }
}

export async function deleteProductImage(url: string) {
  if (!url) return { success: true }

  try {
    // Extract the pathname from the URL
    const pathname = new URL(url).pathname.split("/").pop()

    if (!pathname) {
      return { error: "Invalid image URL" }
    }

    // Delete the blob
    await del(pathname)

    return { success: true }
  } catch (error) {
    console.error("Error deleting image:", error)
    return {
      error: "Failed to delete image. Please try again.",
    }
  }
}

export async function listProductImages(prefix = "product-") {
  try {
    const { blobs } = await list({ prefix })
    return {
      success: true,
      blobs,
    }
  } catch (error) {
    console.error("Error listing images:", error)
    return {
      error: "Failed to list images. Please try again.",
    }
  }
}
