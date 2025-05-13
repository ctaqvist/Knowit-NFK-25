// Here is where you can add custom Typography variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    headerlink: React.CSSProperties;
    footerlabel: React.CSSProperties;
    body3: React.CSSProperties;
    subheading: React.CSSProperties;
    subheading2: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    headerlink?: React.CSSProperties;
    footerlabel?: React.CSSProperties;
    body3?: React.CSSProperties;
    subheading?: React.CSSProperties;
    subheading2?: React.CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headerlink: true;
    footerlabel: true;
    body3: true;
    subheading: true;
    subheading2: true;
  }
}

// Custom  Components

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    text_contained: true;
  }
}

declare module '@mui/material/Button' {
  export interface ButtonPropsColorOverrides {
    grey: true;
  }
}
declare module '@mui/material/Button' {
  export interface ButtonPropsSizeOverrides  {
    xsmall: true;
  }
}