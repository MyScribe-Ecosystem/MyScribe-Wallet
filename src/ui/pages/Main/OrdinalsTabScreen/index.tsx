import { Column, Content, Footer, Header, Layout, Row } from '@/ui/components';
import { NavTabBar } from '@/ui/components/NavTabBar';
import { Text } from '@/ui/components/Text';
import { RouteTypes, useNavigate } from '@/ui/pages/routeTypes';
import { ChainType } from '@/shared/constant';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useChainType } from '@/ui/state/settings/hooks';
import { colors } from '@/ui/theme/colors';
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';

import {
    getContentUrl,
    getInscriptionsByAddress,
    type Inscription
} from '@/shared/services/OrdinalsAPI';

export default function OrdinalsTabScreen() {
    const navigate = useNavigate();
    const currentAccount = useCurrentAccount();
    const chainType = useChainType();
    const isTestnet = chainType === ChainType.BITCOIN_TESTNET || chainType === ChainType.BITCOIN_TESTNET4;

    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const PAGE_SIZE = 20;

    const fetchInscriptions = useCallback(
        async (reset = false) => {
            if (!currentAccount?.address) return;

            const newOffset = reset ? 0 : offset;
            try {
                if (reset) {
                    setLoading(true);
                    setError(null);
                } else {
                    setLoadingMore(true);
                }

                const data = await getInscriptionsByAddress(currentAccount.address, newOffset, PAGE_SIZE, isTestnet);

                if (reset) {
                    setInscriptions(data.results);
                } else {
                    setInscriptions((prev) => [...prev, ...data.results]);
                }
                setTotal(data.total);
                setOffset(newOffset + data.results.length);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load inscriptions');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [currentAccount?.address, offset]
    );

    useEffect(() => {
        fetchInscriptions(true);
    }, [currentAccount?.address, chainType]);

    const hasMore = inscriptions.length < total;

    return (
        <Layout>
            <Header
                title="Inscriptions"
            />
            <Content
                style={{
                    padding: '0 16px',
                    flex: 1,
                    overflowY: 'auto'
                }}>
                {loading ? (
                    <Column
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200
                        }}>
                        <LoadingOutlined style={{ fontSize: 32, color: colors.gold }} />
                        <Text text="Loading inscriptions..." color="textDim" size="sm" style={{ marginTop: 12 }} />
                    </Column>
                ) : error ? (
                    <Column
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200,
                            padding: 20
                        }}>
                        <Text text={error} color="red" size="sm" />
                        <button
                            onClick={() => fetchInscriptions(true)}
                            style={{
                                marginTop: 12,
                                padding: '8px 16px',
                                background: colors.bg3,
                                border: `1.5px solid ${colors.border}`,
                                color: colors.text,
                                borderRadius: 0,
                                cursor: 'pointer'
                            }}>
                            Retry
                        </button>
                    </Column>
                ) : inscriptions.length === 0 ? (
                    <Column
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200
                        }}>
                        <Text text="No inscriptions found" color="text" size="md" style={{ marginBottom: 8 }} />
                        <Text
                            text="Inscriptions owned by this address will appear here"
                            color="textDim"
                            size="sm"
                        />
                    </Column>
                ) : (
                    <Column>
                        <Row style={{ justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text text={`${total} inscription${total !== 1 ? 's' : ''}`} color="textDim" size="sm" />
                        </Row>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 8
                            }}>
                            {inscriptions.map((insc) => (
                                <InscriptionCard
                                    key={insc.id}
                                    inscription={insc}
                                    onClick={() => navigate(RouteTypes.InscriptionDetailScreen, insc)}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <button
                                onClick={() => fetchInscriptions(false)}
                                disabled={loadingMore}
                                style={{
                                    margin: '16px auto',
                                    padding: '10px 24px',
                                    background: colors.bg3,
                                    border: `1.5px solid ${colors.border}`,
                                    color: colors.gold,
                                    borderRadius: 0,
                                    cursor: loadingMore ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                }}>
                                {loadingMore && <LoadingOutlined style={{ fontSize: 14 }} />}
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        )}
                    </Column>
                )}
            </Content>
            <Footer px="zero" py="zero">
                <NavTabBar tab="ordinals" />
            </Footer>
        </Layout>
    );
}

function InscriptionCard({
    inscription,
    onClick
}: {
    inscription: Inscription;
    onClick: () => void;
}) {
    const [imgError, setImgError] = useState(false);
    const isImage = inscription.content_type?.startsWith('image/');

    return (
        <div
            onClick={onClick}
            style={{
                cursor: 'pointer',
                borderRadius: 0,
                overflow: 'hidden',
                border: `1.5px solid ${colors.border}`,
                background: colors.bg3,
                transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = colors.gold;
            }}
            onMouseOut={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = colors.border as string;
            }}>
            <div
                style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    background: colors.bg2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                {isImage && !imgError ? (
                    <img
                        src={getContentUrl(inscription.id)}
                        alt={`#${inscription.number}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <span
                        style={{
                            fontSize: 10,
                            color: colors.gold,
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            letterSpacing: '0.05em'
                        }}>
                        {inscription.content_type?.split('/')[1]?.slice(0, 6) || 'unknown'}
                    </span>
                )}
            </div>
            <div style={{ padding: '6px 8px' }}>
                <div
                    style={{
                        fontSize: 11,
                        color: colors.text,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                    #{inscription.number}
                </div>
            </div>
        </div>
    );
}
