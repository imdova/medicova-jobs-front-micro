export interface GeneralData {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
}

export interface AssetsData {
  primaryLogo: string;
  secondaryLogo: string;
  footerIcon: string;
  invoiceIcon: string;
  favicon: string;
  appIcon: string;
}

export interface ColorsData {
  primary: string;
  "primary-100": string;
  "primary-900": string;
  "primary-foreground": string;
  background: string;
  "light-primary": string;
  "light-primary-transparent": string;
  "primary-transparent": string;
  "text-main": string;
  "text-muted-foreground": string;
  warning: string;
  "warning-100": string;
  error: string;
}

export interface BrandingData {
  generalData: GeneralData;
  assetsData: AssetsData;
  colorsData: ColorsData;
}
