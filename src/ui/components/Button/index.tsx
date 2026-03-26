import React, { CSSProperties, useState } from 'react';

import { colors } from '@/ui/theme/colors';
import { spacing } from '@/ui/theme/spacing';

import { Column } from '../Column';
import { Icon, ValidIconType } from '../Icon';
import { Row } from '../Row';
import { Text } from '../Text';

export type Presets = keyof typeof $viewPresets;

export interface ButtonProps {
    /**
     * The text to display if not using `tx` or nested components.
     */
    text?: string;
    subText?: string;
    /**
     * An optional style override useful for padding & margin.
     */
    style?: CSSProperties;
    /**
     * An optional style override for the "pressed" state.
     */
    pressedStyle?: CSSProperties;
    /**
     * An optional style override for the button text.
     */
    textStyle?: CSSProperties;
    /**
     * An optional style override for the button text when in the "pressed" state.
     */
    pressedTextStyle?: CSSProperties;
    /**
     * One of the different types of button presets.
     */
    preset?: Presets;
    /**
     * An optional component to render on the right side of the text.
     * Example: `RightAccessory={(props) => <View {...props} />}`
     */
    RightAccessory?: React.ReactNode;
    /**
     * An optional component to render on the left side of the text.
     * Example: `LeftAccessory={(props) => <View {...props} />}`
     */
    LeftAccessory?: React.ReactNode;
    /**
     * Children components.
     */
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    icon?: ValidIconType;
    disabled?: boolean;
    full?: boolean;
}

const $baseViewStyle: CSSProperties = {
    display: 'flex',
    minHeight: 36,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    cursor: 'pointer',
    alignSelf: 'stretch',
    paddingLeft: spacing.small,
    paddingRight: spacing.small
};

const $viewPresets = {
    default: Object.assign({}, $baseViewStyle, {
        borderWidth: 1.5,
        minHeight: 50,
        borderColor: colors.white_muted,
        borderRadius: 0
    }) as CSSProperties,

    primary: Object.assign({}, $baseViewStyle, {
        backgroundImage: 'linear-gradient(135deg, #f5e6b8, #e8c547, #c9a227, #f0dc8a, #a67c1a, #d4af37)',
        backgroundSize: '200% 200%',
        color: '#0A1628',
        height: '46px',
        fontWeight: 700,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em'
    } as CSSProperties),

    danger: Object.assign({}, $baseViewStyle, {
        // If 'backgroundColor' is used, avoid shorthand 'background'
        backgroundColor: colors.red,
        height: '48px'
    } as CSSProperties),

    approval: Object.assign({}, $baseViewStyle, {
        backgroundImage: 'linear-gradient(135deg, #f5e6b8, #e8c547, #c9a227, #f0dc8a, #a67c1a, #d4af37)',
        backgroundSize: '200% 200%',
        color: '#0A1628',
        height: '48px',
        fontWeight: 700
    } as CSSProperties),

    bar: Object.assign({}, $baseViewStyle, {
        backgroundColor: colors.black_dark,
        height: '75px',
        justifyContent: 'space-between',

        paddingTop: spacing.medium,
        paddingBottom: spacing.medium
    } as CSSProperties),

    defaultV2: Object.assign({}, $baseViewStyle, {
        borderWidth: 1.5,
        minHeight: 50,
        borderColor: colors.white_muted,
        borderRadius: 0,
        backgroundColor: colors.black_dark
    } as CSSProperties),

    fontsmall: Object.assign({}, $baseViewStyle, {
        borderWidth: 1.5,
        minHeight: 50,
        borderColor: colors.white_muted,
        borderRadius: 0
    }) as CSSProperties,

    primaryV2: Object.assign({}, $baseViewStyle, {
        // Use specific properties instead of 'background'
        backgroundImage: 'linear-gradient(135deg, #f5e6b8, #e8c547, #c9a227, #f0dc8a, #a67c1a, #d4af37)',
        minHeight: 50,
        borderRadius: 0
    } as CSSProperties),

    home: Object.assign({}, $baseViewStyle, {
        backgroundColor: colors.black_dark,
        minWidth: 64,
        minHeight: 64,
        flexDirection: 'column',
        borderRadius: 0,
        borderWidth: 1.5,
        borderColor: '#FFFFFF4D',
        padding: 5,
        marginRight: 5,
        marginLeft: 5
    }) as CSSProperties
};

const $hoverViewPresets: Record<Presets, CSSProperties> = {
    default: {
        backgroundColor: '#1a3050'
    },
    primary: {
        filter: 'brightness(1.1)'
    },
    approval: {
        filter: 'brightness(1.1)'
    },
    danger: {
        backgroundColor: colors.red_dark
    },
    bar: {
        backgroundColor: '#1a3050'
    },
    fontsmall: {
        backgroundColor: '#1a3050'
    },
    defaultV2: {
        backgroundColor: '#1a3050'
    },
    primaryV2: {
        backgroundColor: colors.yellow_dark
    },
    home: {
        backgroundColor: '#1a3050'
    }
};

const $baseTextStyle: CSSProperties = {
    textAlign: 'center',
    flexShrink: 1,
    flexGrow: 0,
    zIndex: 2,
    color: colors.white,
    paddingLeft: spacing.tiny,
    paddingRight: spacing.tiny
};

const $textPresets: Record<Presets, CSSProperties> = {
    default: $baseTextStyle,
    primary: Object.assign({}, $baseTextStyle, { color: colors.black }),
    approval: Object.assign({}, $baseTextStyle, { color: colors.black }),
    danger: Object.assign({}, $baseTextStyle, { color: colors.white }),
    bar: Object.assign({}, $baseTextStyle, { textAlign: 'left', fontWeight: 'bold' } as CSSProperties),

    fontsmall: Object.assign({}, $baseTextStyle, { fontSize: '10px', color: colors.white }),

    defaultV2: Object.assign({}, $baseTextStyle, {}),
    primaryV2: Object.assign({}, $baseTextStyle, { color: colors.black }),
    home: Object.assign({}, $baseTextStyle, {
        color: colors.textDim,
        fontSize: 12
    })
};

const $rightAccessoryStyle: CSSProperties = { marginLeft: spacing.extraSmall, zIndex: 1 };
const $leftAccessoryStyle: CSSProperties = { marginRight: spacing.extraSmall, zIndex: 1 };
const $baseDisabledViewStyle: CSSProperties = { cursor: 'not-allowed', opacity: 0.5 };

export function Button(props: ButtonProps) {
    const {
        text,
        subText,
        style: $viewStyleOverride,
        textStyle: $textStyleOverride,
        children,
        RightAccessory,
        LeftAccessory,
        onClick,
        icon,
        disabled,
        full
    } = props;

    const preset: Presets = props.preset ?? 'default';
    const [hover, setHover] = useState(false);
    const $viewStyle: CSSProperties = {
        ...$viewPresets[preset],
        ...$viewStyleOverride,
        ...(hover && !disabled ? $hoverViewPresets[preset] : {}),
        ...(disabled ? $baseDisabledViewStyle : {}),
        ...(full ? { flex: 1 } : {})
    };

    const $textStyle = Object.assign({}, $textPresets[preset], $textStyleOverride);
    const $subTextStyle = Object.assign({}, $textPresets[preset], {
        color: colors.white_muted,
        marginTop: 5,
        fontWeight: 'normal'
    } as CSSProperties);

    if (preset === 'bar') {
        return (
            <div
                style={$viewStyle}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={disabled ? undefined : onClick}>
                <Row>
                    {LeftAccessory && <div style={$leftAccessoryStyle}>{LeftAccessory}</div>}
                    {icon && (
                        <Icon
                            icon={icon}
                            color={'white'}
                            style={{ marginRight: spacing.tiny, width: icon === 'swap' ? '20px' : undefined }}
                        />
                    )}
                    <Column justifyCenter gap="zero">
                        {text && <Text text={text} style={$textStyle} />}
                        {subText && <Text text={subText} style={$subTextStyle} />}
                    </Column>

                    {children}
                </Row>

                {RightAccessory && <div style={$rightAccessoryStyle}>{RightAccessory}</div>}
            </div>
        );
    }

    if (preset === 'home') {
        return (
            <div
                style={$viewStyle}
                onClick={disabled ? undefined : onClick}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}>
                {icon && <Icon icon={icon} style={{ marginRight: spacing.tiny, backgroundColor: colors.white }} />}
                {text && <Text style={$textStyle} text={text} preset="regular" mt="sm" />}
            </div>
        );
    }

    return (
        <div
            style={$viewStyle}
            onClick={disabled ? undefined : onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            {LeftAccessory && <div style={$leftAccessoryStyle}>{LeftAccessory}</div>}
            {icon && <Icon icon={icon} style={{ marginRight: spacing.tiny, backgroundColor: $textStyle.color }} />}
            {text && <Text style={$textStyle} text={text} preset="regular-bold" />}
            {children}
            {RightAccessory && <div style={$rightAccessoryStyle}>{RightAccessory}</div>}
        </div>
    );
}
