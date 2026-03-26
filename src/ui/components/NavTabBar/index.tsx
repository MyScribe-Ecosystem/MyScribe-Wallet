import { useState } from 'react';
import { RouteTypes, useNavigate } from '@/ui/pages/routeTypes';
import { useUnreadAppSummary } from '@/ui/state/accounts/hooks';
import { TabOption } from '@/ui/state/global/reducer';
import { colors } from '@/ui/theme/colors';

import PartnerIcon from '@/ui/components/Icon/PartnerIcon';
import { BaseView } from '../BaseView';
import { Grid } from '../Grid';
import { Icon, IconTypes } from '../Icon';

export function NavTabBar({ tab }: { tab: TabOption }) {
    return (
        <Grid
            columns={2}
            style={{
                width: '100%',
                height: '50px',
                minHeight: '50px',
                maxHeight: '50px',
                backgroundColor: colors.bg2,
                borderTop: `1px solid ${colors.border}`,
                flexShrink: 0
            }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'flex-start'
                }}>
                <OPNetButton />
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'flex-end'
                }}>
                <TabButton tabName="home" icon="wallet" isActive={tab === 'home'} />
                <TabButton tabName="ordinals" customChar="◉" isActive={tab === 'ordinals'} />
                <TabButton tabName="nft" icon="grid" isActive={tab === 'nft'} />
                <TabButton tabName="settings" icon="settings" isActive={tab === 'settings'} />
            </div>
        </Grid>
    );
}

function OPNetButton() {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1 / 1',
                color: colors.text,
                fill: colors.text,
                background: hovered ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.15s'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            <PartnerIcon icon="OPScan" size={16} />
        </button>
    );
}

function TabButton({
    tabName,
    icon,
    customChar,
    isActive
}: {
    tabName: TabOption;
    icon?: IconTypes;
    customChar?: string;
    isActive: boolean;
}) {
    const navigate = useNavigate();
    const unreadApp = useUnreadAppSummary();
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1 / 1',
                cursor: 'pointer',
                background: hovered ? 'rgba(255,255,255,0.08)' : 'transparent',
                transition: 'background 0.15s'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => {
                if (tabName === 'home') {
                    navigate(RouteTypes.MainScreen);
                } else if (tabName === 'ordinals') {
                    navigate(RouteTypes.OrdinalsTabScreen);
                } else if (tabName === 'nft') {
                    navigate(RouteTypes.NFTTabScreen);
                } else if (tabName === 'settings') {
                    navigate(RouteTypes.SettingsTabScreen);
                }
            }}>
            {customChar ? (
                <span
                    style={{
                        fontSize: 18,
                        color: isActive ? colors.white : hovered ? colors.gold : colors.white_muted,
                        lineHeight: 1,
                        transition: 'color 0.15s'
                    }}>
                    {customChar}
                </span>
            ) : icon ? (
                <Icon icon={icon} color={isActive ? 'white' : hovered ? 'gold' : 'white_muted'} />
            ) : null}
            <BaseView style={{ position: 'relative' }}>
                {tabName === 'app' && unreadApp && (
                    <BaseView
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            left: 5,
                            width: 5,
                            height: 5,
                            backgroundColor: 'red',
                            borderRadius: '0px'
                        }}></BaseView>
                )}
            </BaseView>
        </div>
    );
}
