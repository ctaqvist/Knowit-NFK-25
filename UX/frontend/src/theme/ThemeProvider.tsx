import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";
import { createTheme } from '@mui/material';
import { theme as customTheme } from './theme';


interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const theme = createTheme(customTheme)

  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
}