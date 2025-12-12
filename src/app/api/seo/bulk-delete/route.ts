import { type NextRequest, NextResponse } from "next/server"

// Mock data - same as in other routes
let seoData = [
  {
    id: "1",
    urlPath: "/",
    title: "Home - Your Website",
    metaDescription: "Welcome to our website. Discover amazing products and services.",
    status: "completed",
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    urlPath: "/about",
    title: "About Us",
    metaDescription: "",
    status: "missing-fields",
    lastUpdated: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    urlPath: "/blog/getting-started",
    title: "",
    metaDescription: "Learn how to get started with our platform in this comprehensive guide.",
    status: "missing-title",
    lastUpdated: "2024-01-12T09:15:00Z",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Remove items with matching IDs
    seoData = seoData.filter((item) => !ids.includes(item.id))

    return NextResponse.json({
      message: `Successfully deleted ${ids.length} items`,
      deletedCount: ids.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete items" }, { status: 500 })
  }
}
