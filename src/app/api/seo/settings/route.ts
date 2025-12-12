import { type NextRequest, NextResponse } from "next/server"

// Mock global settings
let globalSettings = {
  defaultTitle: "Your Website Name",
  defaultDescription: "Default description for your website pages",
  titleSuffix: " | Your Website",
  defaultCanonical: "https://yourdomain.com",
  defaultNoIndex: false,
  defaultNoFollow: false,
  openGraph: {
    siteName: "Your Website Name",
    defaultImage: "https://yourdomain.com/default-og-image.jpg",
    defaultType: "website",
  },
  twitter: {
    site: "@yourwebsite",
    creator: "@yourcreator",
    defaultCard: "summary_large_image",
  },
  analytics: {
    googleAnalytics: "",
    googleTagManager: "",
    facebookPixel: "",
  },
}

export async function GET() {
  return NextResponse.json(globalSettings)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    globalSettings = { ...globalSettings, ...body }

    return NextResponse.json(globalSettings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
