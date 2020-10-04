import React from 'react';
import { ThemeProvider } from 'styled-components';

import lightblue from '@material-ui/core/colors/lightBlue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import {
  createMuiTheme,
  MuiThemeProvider,
  StylesProvider,
  ThemeOptions
} from '@material-ui/core/styles';

export interface AppThemeProviderProps {
  theme?: ThemeOptions;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = props => {
  const { theme: themeOptions, children } = props;
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#2196f3',
        light: lightblue[50]
      },
      secondary: {
        light: '#f1f3f3',
        main: '#fff'
      },
      error: {
        main: deepOrange['A400']
      }
    },
    typography: {
      overline: {
        letterSpacing: 1,
        fontWeight: 500
      }
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 768,
        lg: 960,
        xl: 1024
      }
    },
    overrides: {
      MuiInputBase: {
        input: {
          fontSize: 14
        }
      },
      MuiInputLabel: {
        outlined: {
          transform: 'translate(14px, 18px) scale(1)'
        }
      },
      MuiOutlinedInput: {
        input: {
          padding: '16px 14px'
        }
      },
      MuiFormControlLabel: {
        label: {
          fontSize: 13
        }
      },
      MuiTableContainer: {
        root: {
          overflow: 'auto'
        }
      },
      MuiTable: {
        root: {
          whiteSpace: 'nowrap'
        }
      },
      MuiTableRow: {
        hover: {
          cursor: 'pointer'
        },
        root: {
          '&$selected, &$selected:hover': { backgroundColor: lightblue[50] }
        }
      },
      MuiDialog: {
        paper: {
          width: '80%'
        }
      },
      MuiDialogActions: {
        root: {
          padding: '8px 24px'
        }
      }
    },
    ...themeOptions
  });
  return (
    //Make sure the Material stylesheet is placed above your own
    //styles so you can overwrite them
    <StylesProvider injectFirst>
      {/* Use the theme in the ThemeProvider for Material-UI so //styles are
      applied to the Material-UI components */}
      <MuiThemeProvider theme={theme}>
        {/* Use also the ThemeProvider for Styled-Components so //you can access
        the theme in your own css */}
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
};

export default AppThemeProvider;
