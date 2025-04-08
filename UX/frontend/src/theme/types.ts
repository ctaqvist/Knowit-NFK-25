

// Here is where you can add custom Typography variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    // link: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    // link?: React.CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    // link: true;
  }
}
