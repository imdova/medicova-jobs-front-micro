import { NextResponse } from "next/server"

// Mock data for export
const seoData = [
  {
    id: "1",
    urlPath: "/",
    title: "Home - Your Website",
    metaDescription: "Welcome to our website. Discover amazing products and services.",
    metaKeywords: "home, website, products, services",
    canonicalUrl: "https://example.com/",
    noIndex: false,
    noFollow: false,
    customMeta: [],
    openGraph: {
      title: "Home - Your Website",
      description: "Welcome to our website. Discover amazing products and services.",
      image: "https://example.com/og-home.jpg",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Home - Your Website",
      description: "Welcome to our website. Discover amazing products and services.",
      image: "https://example.com/twitter-home.jpg",
    },
    schema: "",
    language: "en",
    status: "completed",
    lastUpdated: "2024-01-15T10:30:00Z",
  },
]

export async function GET() {
  try {
    const jsonData = JSON.stringify(seoData, null, 2)

    return new NextResponse(jsonData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="seo-data.json"',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
