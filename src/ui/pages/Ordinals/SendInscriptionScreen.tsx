import { Column, Content, Footer, Header, Layout, Row } from '@/ui/components';
import { NavTabBar } from '@/ui/components/NavTabBar';
import { Text } from '@/ui/components/Text';
import { RouteTypes, useNavigate } from '@/ui/pages/routeTypes';
import { colors } from '@/ui/theme/colors';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getContentUrl, type Inscription } from '@/shared/services/OrdinalsAPI';

export default function SendInscriptionScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const inscription = location.state as Inscription | undefined;

    const [recipient, setRecipient] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!inscription) {
        return (
            <Layout>
                <Header
                    onBack={() => navigate(RouteTypes.OrdinalsTabScreen)}
                    title="Send Inscription"
                />
                <Content style={{ padding: 20, flex: 1 }}>
                    <Text text="Inscription not found" color="text" />
                </Content>
                <Footer>
                    <NavTabBar tab="ordinals" />
                </Footer>
            </Layout>
        );
    }

    const handleSend = async () => {
        if (!recipient.trim()) {
            setError('Please enter a recipient address');
            return;
        }

        setSending(true);
        setError(null);

        try {
            // TODO: Implement PSBT construction for inscription transfer
            // This requires:
            // 1. Parse inscription.output to get txid:vout
            // 2. Build PSBT with that UTXO as input
            // 3. Add output sending to recipient
            // 4. Sign with wallet key
            // 5. Broadcast via wallet.pushTx()
            setError(
                'Inscription sending is being finalized. The PSBT construction for ordinal transfers will be wired in the next iteration.'
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send inscription');
        } finally {
            setSending(false);
        }
    };

    const isImage = inscription.content_type?.startsWith('image/');

    return (
        <Layout>
            <Header
                onBack={() => navigate(RouteTypes.InscriptionDetailScreen, inscription)}
                title="Send Inscription"
            />
            <Content
                style={{
                    padding: '0 16px 16px',
                    flex: 1,
                    overflowY: 'auto'
                }}>
                {/* Inscription preview */}
                <Row
                    style={{
                        padding: 12,
                        background: colors.bg3,
                        borderRadius: 0,
                        gap: 12,
                        marginBottom: 20,
                        alignItems: 'center'
                    }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 0,
                            overflow: 'hidden',
                            background: colors.bg2,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        {isImage ? (
                            <img
                                src={getContentUrl(inscription.id)}
                                alt={`#${inscription.number}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span style={{ fontSize: 9, color: colors.gold, fontWeight: 600 }}>
                                {inscription.content_type?.split('/')[1]?.slice(0, 6) || '?'}
                            </span>
                        )}
                    </div>
                    <Column style={{ gap: 2 }}>
                        <Text text={`Inscription #${inscription.number}`} color="text" size="md" />
                        <Text text={inscription.content_type} color="textDim" size="xs" />
                    </Column>
                </Row>

                {/* Recipient */}
                <Column style={{ gap: 6, marginBottom: 16 }}>
                    <Text text="Recipient Address" color="textDim" size="sm" />
                    <input
                        value={recipient}
                        onChange={(e) => {
                            setRecipient(e.target.value);
                            setError(null);
                        }}
                        placeholder="Enter Bitcoin address..."
                        style={{
                            width: '100%',
                            padding: '12px 14px',
                            background: colors.bg2,
                            border: `1.5px solid ${colors.border}`,
                            borderRadius: 0,
                            color: colors.text,
                            fontSize: 13,
                            outline: 'none',
                            fontFamily: 'inherit'
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = colors.gold;
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = colors.border as string;
                        }}
                    />
                </Column>

                {/* UTXO info */}
                <Row
                    style={{
                        padding: '10px 12px',
                        background: colors.bg2,
                        borderRadius: 0,
                        justifyContent: 'space-between',
                        marginBottom: 16
                    }}>
                    <Text text="UTXO Value" color="textDim" size="xs" />
                    <Text text={`${inscription.value} sats`} color="text" size="xs" />
                </Row>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            padding: '10px 14px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1.5px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 0,
                            marginBottom: 16
                        }}>
                        <Text text={error} color="red" size="xs" />
                    </div>
                )}

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={sending || !recipient.trim()}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundImage:
                            sending || !recipient.trim()
                                ? 'none'
                                : 'linear-gradient(135deg, #f5e6b8, #e8c547, #c9a227, #f0dc8a, #a67c1a, #d4af37)',
                        backgroundColor: sending || !recipient.trim() ? colors.bg3 : undefined,
                        backgroundSize: '200% 200%',
                        color: sending || !recipient.trim() ? colors.white_muted : '#0A1628',
                        border: 'none',
                        borderRadius: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: sending || !recipient.trim() ? 'not-allowed' : 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        opacity: sending || !recipient.trim() ? 0.5 : 1
                    }}>
                    {sending ? 'Sending...' : 'Send'}
                </button>
            </Content>
            <Footer>
                <NavTabBar tab="ordinals" />
            </Footer>
        </Layout>
    );
}
