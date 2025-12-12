import { type NextRequest, NextResponse } from "next/server"

// Mock data - same as in the main route
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const item = seoData.find((item) => item.id === params.id)

  if (!item) {
    return NextResponse.json({ error: "SEO data not found" }, { status: 404 })
  }

  return NextResponse.json(item)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const index = seoData.findIndex((item) => item.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "SEO data not found" }, { status: 404 })
    }

    // Determine status based on required fields
    let status = "completed"
    if (!body.title) {
      status = "missing-title"
    } else if (!body.metaDescription) {
      status = "missing-fields"
    }

    seoData[index] = {
      ...seoData[index],
      ...body,
      status,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(seoData[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update SEO data" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const index = seoData.findIndex((item) => item.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "SEO data not found" }, { status: 404 })
  }

  seoData.splice(index, 1)

  return NextResponse.json({ message: "SEO data deleted successfully" })
}
