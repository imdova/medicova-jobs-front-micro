import { type NextRequest, NextResponse } from "next/server"

// Mock data - in a real app, this would come from your database
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
  {
    id: "2",
    urlPath: "/about",
    title: "About Us",
    metaDescription: "",
    metaKeywords: "about, company, team",
    canonicalUrl: "https://example.com/about",
    noIndex: false,
    noFollow: false,
    customMeta: [],
    openGraph: {
      title: "About Us",
      description: "",
      image: "",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "About Us",
      description: "",
      image: "",
    },
    schema: "",
    language: "en",
    status: "missing-fields",
    lastUpdated: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    urlPath: "/blog/getting-started",
    title: "",
    metaDescription: "Learn how to get started with our platform in this comprehensive guide.",
    metaKeywords: "getting started, guide, tutorial",
    canonicalUrl: "https://example.com/blog/getting-started",
    noIndex: false,
    noFollow: false,
    customMeta: [],
    openGraph: {
      title: "",
      description: "Learn how to get started with our platform in this comprehensive guide.",
      image: "https://example.com/og-blog.jpg",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "",
      description: "Learn how to get started with our platform in this comprehensive guide.",
      image: "https://example.com/twitter-blog.jpg",
    },
    schema: '{"@context": "https://schema.org", "@type": "Article", "headline": "Getting Started Guide"}',
    language: "en",
    status: "missing-title",
    lastUpdated: "2024-01-12T09:15:00Z",
  },
]

export async function GET() {
  return NextResponse.json(seoData)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Determine status based on required fields
    let status = "completed"
    if (!body.title) {
      status = "missing-title"
    } else if (!body.metaDescription) {
      status = "missing-fields"
    }

    const newSEOData = {
      id: Date.now().toString(),
      ...body,
      status,
      lastUpdated: new Date().toISOString(),
    }

    seoData.push(newSEOData)

    return NextResponse.json(newSEOData, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create SEO data" }, { status: 500 })
  }
}
