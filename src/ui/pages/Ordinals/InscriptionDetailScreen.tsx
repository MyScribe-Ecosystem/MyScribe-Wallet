import { Column, Content, Footer, Header, Layout, Row } from '@/ui/components';
import { CopyableAddress } from '@/ui/components/CopyableAddress';
import { NavTabBar } from '@/ui/components/NavTabBar';
import { Text } from '@/ui/components/Text';
import { RouteTypes, useNavigate } from '@/ui/pages/routeTypes';
import { colors } from '@/ui/theme/colors';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

import Iframe from '@/ui/components/Iframe';
import { getPreviewUrl, type Inscription } from '@/shared/services/OrdinalsAPI';

export default function InscriptionDetailScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const inscription = location.state as Inscription | undefined;
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    if (!inscription) {
        return (
            <Layout>
                <Header onBack={() => navigate(RouteTypes.OrdinalsTabScreen)} title="Inscription" />
                <Content style={{ padding: 20, flex: 1 }}>
                    <Text text="Inscription not found" color="text" />
                </Content>
                <Footer>
                    <NavTabBar tab="ordinals" />
                </Footer>
            </Layout>
        );
    }

    return (
        <Layout>
            <Header
                onBack={() => navigate(RouteTypes.OrdinalsTabScreen)}
                title={`Inscription #${inscription.number}`}
            />
            <Content
                style={{
                    padding: '0 16px 16px',
                    flex: 1,
                    overflowY: 'auto'
                }}>
                {/* Preview iframe */}
                <div
                    style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: 0,
                        overflow: 'hidden',
                        border: `1.5px solid ${colors.border}`,
                        background: colors.bg2,
                        marginBottom: 16
                    }}>
                    <Iframe
                        ref={iframeRef}
                        preview={getPreviewUrl(inscription.id)}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                    />
                </div>

                {/* Metadata */}
                <Column style={{ gap: 10 }}>
                    <MetadataRow label="Inscription ID" value={inscription.id} copyable />
                    <MetadataRow label="Number" value={`#${inscription.number}`} />
                    <MetadataRow label="Content Type" value={inscription.content_type} />
                    <MetadataRow label="Content Size" value={`${inscription.content_length} bytes`} />
                    <MetadataRow label="Genesis Block" value={String(inscription.genesis_height)} />
                    {inscription.sat_ordinal && (
                        <MetadataRow label="Sat Ordinal" value={inscription.sat_ordinal} />
                    )}
                    <MetadataRow label="Output" value={inscription.output} />
                    <MetadataRow label="Value" value={`${inscription.value} sats`} />
                </Column>

                {/* Send button */}
                <button
                    onClick={() => navigate(RouteTypes.SendInscriptionScreen, inscription)}
                    style={{
                        width: '100%',
                        marginTop: 20,
                        padding: '14px',
                        backgroundImage:
                            'linear-gradient(135deg, #f5e6b8, #e8c547, #c9a227, #f0dc8a, #a67c1a, #d4af37)',
                        backgroundSize: '200% 200%',
                        color: '#0A1628',
                        border: 'none',
                        borderRadius: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                    Send Inscription
                </button>
            </Content>
            <Footer>
                <NavTabBar tab="ordinals" />
            </Footer>
        </Layout>
    );
}

function MetadataRow({
    label,
    value,
    copyable
}: {
    label: string;
    value: string;
    copyable?: boolean;
}) {
    return (
        <Row
            style={{
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: colors.bg3,
                borderRadius: 0,
                gap: 8,
                alignItems: 'flex-start'
            }}>
            <Text text={label} color="textDim" size="xs" style={{ flexShrink: 0 }} />
            {copyable ? (
                <CopyableAddress address={value} />
            ) : (
                <Text
                    text={value}
                    color="text"
                    size="xs"
                    style={{
                        textAlign: 'right',
                        wordBreak: 'break-all',
                        maxWidth: '60%'
                    }}
                />
            )}
        </Row>
    );
}
