import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

import WorkSansTTF from '../assets/fonts/WorkSans-VariableFont_wght.ttf';

const WorkSans = {
  fontFamily: 'Work Sans Thin',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('Work Sans Thin'),
    local('Work Sans Thin'),
    url(${WorkSansTTF}) format('truetype')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

export const colors = {
  white: "#f2f4f7",
  whiteLight: "#f2f4f78c",
  black: "#000",
  darkBlue: "#2c3b57",
  blue: "#2F80ED",
  gray: "#e1e1e1",
  darkGray: "#828282",
  lightGray: "rgb(247,248,250)",
  lightBlack: "#6a6a6a",
  darkBlack: "#141414",
  green: "#1abc9c",
  red: "#ed4337",
  orange: "orange",
  pink: "#DC6BE5",
  compoundGreen: "#00d395",
  tomato: "#e56b73",
  purple: "#935dff",

  text: "#212529",
  lightBlue: "#2F80ED",
  topaz: "rgba(17,92,242)",
  borderGray: "#9C9DA0",
  borderBlue: "rgb(99,104,247)",
  investGray: "rgb(247,248,250)",
};

const breakpoints = createBreakpoints({
  keys: ["xs", "sm", "md", "lg", "xl", "xxl"],
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1800,
    xxl: 2560
  }
})

const iswapTheme = {
  typography: {
    fontFamily: [
      '"Work Sans Thin"',
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h1: {
      fontSize: "48px",
      fontWeight: "300",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "36px",
      fontWeight: "300",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "22px",
      fontWeight: "300",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "16px",
      fontWeight: "300",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      lineHeight: 1.2,
    },
    h5: {
      fontSize: "14px",
      fontWeight: "300",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      lineHeight: 1.2,
    },
    body1: {
      fontSize: "16px",
      fontWeight: "300",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    body2: {
      fontSize: "16px",
      fontWeight: "300",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
  },
  type: "light",
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [WorkSans],
      },
    },
    MuiSelect: {
      select: {
        padding: "9px",
      },
      selectMenu: {
        minHeight: "30px",
        display: "flex",
        alignItems: "center",
      },
    },
    MuiButton: {
      root: {
        padding: "10px 24px",
      },
      outlined: {
        padding: "10px 24px",
        borderWidth: "2px !important",
      },
      text: {
        padding: "10px 24px",
      },
      label: {
        textTransform: "none",
        fontSize: "1rem",
      },
    },
    MuiInputBase: {
      input: {
        fontSize: "16px",
        fontWeight: "300",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        lineHeight: 1.2,
      },
    },
    MuiOutlinedInput: {
      input: {
        "&::placeholder": {
          color: colors.text,
        },
        color: colors.text,
        padding: "14px",
      },
      root: {
        // border: "none !important"
      },
      notchedOutline: {
        // border: "none !important"
      },
    },
    MuiSnackbar: {
      root: {
        maxWidth: "calc(100vw - 24px)",
      },
      anchorOriginBottomLeft: {
        bottom: "12px",
        left: "12px",
        "@media (min-width: 960px)": {
          bottom: "50px",
          left: "80px",
        },
      },
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: colors.whiteLight,
        padding: "0px",
        minWidth: "auto",
        "@media (min-width: 960px)": {
          minWidth: "500px",
        },
      },
      message: {
        padding: "0px",
      },
      action: {
        marginRight: "0px",
      },
    },
    MuiAccordion: {
      root: {
        border: "1px solid " + colors.borderGray,
        margin: "8px 0px",
        "&:before": {
          //underline color when textfield is inactive
          backgroundColor: colors.whiteLight,
          height: "0px",
        },
      },
    },
    MuiAccordionSummary: {
      root: {
        backgroundColor: colors.whiteLight,
        padding: "12px 24px",
        "@media (min-width: 960px)": {
          padding: "30px 42px",
        },
      },
      content: {
        margin: "0px !important",
      },
      assetSummary: {
        backgroundColor: colors.whiteLight,
      },
      MuiSvgIcon: {
        root: {
          color: "#4147F6",
        },
      },
    },
    MuiAccordionDetails: {
      root: {
        backgroundColor: colors.whiteLight,
        padding: "0 12px 15px 12px",
        "@media (min-width: 960px)": {
          padding: "0 24px 30px 24px",
        },
      },
    },
    MuiToggleButton: {
      root: {
        textTransform: "none",
        minWidth: "100px",
        border: "none",
        background: colors.borderBlue,
        "& > span > h4": {
          color: "#555",
        },
        "&:hover": {
          backgroundColor: colors.whiteLight,
        },
        "&$selected": {
          backgroundColor: colors.whiteLight,
          "& > span > h4": {
            color: "#fff",
          },
          "&:hover": {
            backgroundColor: colors.whiteLight,
            "& > span > h4": {
              color: "#000",
            },
          },
        },
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: "none",
      },
    },
    MuiToggleButtonGroup: {
      root: {
        border: "1px solid " + colors.borderGray,
      },
      groupedSizeSmall: {
        padding: "42px 30px",
      },
    },
    MuiFormControlLabel: {
      label: {
        color: colors.borderBlue,
        fontSize: "14px",
        fontWeight: "300",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        lineHeight: 1.2,
      },
    },
  },
  palette: {
    primary: {
      main: colors.blue,
    },
    secondary: {
      main: colors.topaz,
    },
    text: {
      primary: colors.text,
      secondary: colors.text,
    },
  },
  breakpoints: breakpoints,
};

export default iswapTheme;