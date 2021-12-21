import {
  createMuiTheme as baseCreateMuiTheme,
  ThemeOptions as BaseThemeOptions
} from '@material-ui/core/styles';

export interface StatusLabelColor {
  background?: string;
  color?: string;
}

export type ThemeOptions = BaseThemeOptions & {
  pageTemplate?: {
    headerBackground?: string;
    background?: string;
    headerText?: string;
    headerLink?: string;
    headerHoverLink?: string;
  };
  cardContent?: {
    background?: {
      primary?: string;
      secondary?: string;
    };
  };
  statusLabel?: {
    draft?: StatusLabelColor;
    inProgress?: StatusLabelColor;
    error?: StatusLabelColor;
    completed?: StatusLabelColor;
  };
};

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    pageTemplate?: {
      headerBackground?: string;
      background?: string;
      headerText?: string;
      headerLink?: string;
      headerHoverLink?: string;
    };
    cardContent?: {
      background?: {
        primary?: string;
        secondary?: string;
      };
    };
    statusLabel?: {
      draft?: StatusLabelColor;
      inProgress?: StatusLabelColor;
      error?: StatusLabelColor;
      completed?: StatusLabelColor;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    pageTemplate?: {
      headerBackground?: string;
      background?: string;
      headerText?: string;
      headerLink?: string;
      headerHoverLink?: string;
    };
    cardContent?: {
      background?: {
        primary?: string;
        secondary?: string;
      };
    };
    statusLabel?: {
      draft?: StatusLabelColor;
      inProgress?: StatusLabelColor;
      error?: StatusLabelColor;
      completed?: StatusLabelColor;
    };
  }
}

export const createMuiTheme = baseCreateMuiTheme;
