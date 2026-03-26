// MyScribe Wallet color palette — navy + gold

const palette = {
    white: '#ffffff',
    white_muted: 'rgba(255, 255, 255, 0.5)',
    black: '#0A1628',
    black_muted: 'rgba(0, 0, 0, 0.5)',
    black_muted2: 'rgba(0, 0, 0, 0.)',

    dark: '#0d1f35',
    grey: '#495361',
    light: '#A2A4AA',

    black_dark: '#0A1628',

    green_dark2: '#2D7E24',
    green_dark: '#379a29',
    green: '#41B530',
    green_light: '#5ec04f',

    yellow_dark: '#a67c1a',
    yellow: '#C49A3C',
    yellow_light: '#e8c547',

    red_dark: '#c92b40',
    red: '#ED334B',
    red_light: '#f05266',

    blue_dark: '#003366',
    blue: '#0066CC',
    blue_light: '#3399FF',

    orange_dark: '#a67c1a',
    orange: '#C49A3C',
    orange_light: '#e8c547',

    purple_dark: '#7748e2',
    purple: '#8b5cf6',
    purple_light: '#9f7af6',

    gold: '#C49A3C'
};

export const colors = Object.assign({}, palette, {
    transparent: 'rgba(0, 0, 0, 0)',

    text: palette.white,

    textDim: palette.white_muted,

    background: '#0A1628',

    error: '#e52937',

    danger: 'rgba(245, 84, 84, 0.90)',

    card: '#0A1628',
    warning: palette.orange,
    primary: palette.yellow,

    bg2: '#122240',
    bg3: '#1a3050',
    bg4: '#1a3050',

    border: '#3a5575',

    icon_yellow: '#C49A3C',

    value_up_color: '#4DA474',
    value_down_color: '#BF3F4D',

    ticker_color: '#C49A3C'
});

export type ColorTypes = keyof typeof colors;
