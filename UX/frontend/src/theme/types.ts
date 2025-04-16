

// Here is where you can add custom Typography variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    headerlink: React.CSSProperties;
    footerlabel: React.CSSProperties;
    body3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    headerlink?: React.CSSProperties;
    footerlabel?: React.CSSProperties;
    body3?: React.CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headerlink: true;
    footerlabel: true;
    body3: true;

  }
}
