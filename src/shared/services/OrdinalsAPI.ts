/**
 * Ordinals API service using ordinals.com + mempool.space
 * Pattern borrowed from Bitmap-Wallet:
 *   1. Fetch UTXOs from mempool.space
 *   2. Check each UTXO for inscriptions via ordinals.com/r/utxo/{outpoint}
 *   3. Fetch inscription metadata via ordinals.com/r/inscription/{id}
 *   4. Render previews via ordinals.com/preview/{id}
 */

const ORDINALS_BASE = 'https://ordinals.com';
const MEMPOOL_BASE = 'https://mempool.space';
const MEMPOOL_TESTNET_BASE = 'https://mempool.space/signet';

export interface Inscription {
    id: string;
    number: number;
    content_type: string;
    content_length: number;
    genesis_height: number;
    timestamp: number;
    output: string; // txid:vout
    value: string;
    sat_ordinal?: string;
}

export interface InscriptionsResponse {
    results: Inscription[];
    total: number;
}

interface MempoolUtxo {
    txid: string;
    vout: number;
    value: number;
    status: {
        confirmed: boolean;
        block_height?: number;
    };
}

interface OrdinalsUtxoResponse {
    inscriptions?: string[];
}

interface OrdinalsInscriptionMeta {
    id?: string;
    number?: number;
    content_type?: string;
    content_length?: number;
    genesis_height?: number;
    timestamp?: number;
    sat?: number;
    output?: string;
    value?: number;
}

const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 30_000;

function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T;
    return null;
}

function setCache(key: string, data: unknown) {
    cache.set(key, { data, ts: Date.now() });
}

/**
 * Fetch inscriptions for an address using ordinals.com API
 * Flow: mempool.space UTXOs -> ordinals.com/r/utxo/{outpoint} -> inscription IDs
 */
export async function getInscriptionsByAddress(
    address: string,
    _offset = 0,
    _limit = 60,
    testnet = false
): Promise<InscriptionsResponse> {
    // Skip non-Bitcoin addresses (MLDSA 0x... addresses, empty, etc.)
    if (!address || address.startsWith('0x') || (!address.startsWith('bc1') && !address.startsWith('tb1') && !address.startsWith('1') && !address.startsWith('3'))) {
        return { results: [], total: 0 };
    }

    const cacheKey = `inscriptions:${address}:${testnet}`;
    const cached = getCached<InscriptionsResponse>(cacheKey);
    if (cached) return cached;

    const mempoolBase = testnet ? MEMPOOL_TESTNET_BASE : MEMPOOL_BASE;

    // Step 1: Get UTXOs from mempool.space
    const utxoRes = await fetch(`${mempoolBase}/api/address/${encodeURIComponent(address)}/utxo`);
    if (!utxoRes.ok) throw new Error(`Could not fetch inscriptions for this address`);
    const utxos: MempoolUtxo[] = await utxoRes.json();

    // Step 2: Check each UTXO for inscriptions via ordinals.com
    const inscriptionIds: string[] = [];
    const utxoMap = new Map<string, MempoolUtxo>();

    const checkPromises = utxos.map(async (utxo) => {
        const outpoint = `${utxo.txid}:${utxo.vout}`;
        try {
            const res = await fetch(`${ORDINALS_BASE}/r/utxo/${outpoint}`);
            if (res.ok) {
                const data: OrdinalsUtxoResponse = await res.json();
                if (data.inscriptions && data.inscriptions.length > 0) {
                    for (const id of data.inscriptions) {
                        inscriptionIds.push(id);
                        utxoMap.set(id, utxo);
                    }
                }
            }
        } catch {
            // Skip UTXOs that fail
        }
    });

    await Promise.all(checkPromises);

    // Step 3: Fetch metadata for each inscription
    const inscriptions: Inscription[] = [];

    const metaPromises = inscriptionIds.map(async (id) => {
        try {
            const res = await fetch(`${ORDINALS_BASE}/r/inscription/${id}`);
            if (res.ok) {
                const meta: OrdinalsInscriptionMeta = await res.json();
                const utxo = utxoMap.get(id);
                inscriptions.push({
                    id,
                    number: meta.number ?? 0,
                    content_type: meta.content_type ?? 'unknown',
                    content_length: meta.content_length ?? 0,
                    genesis_height: meta.genesis_height ?? 0,
                    timestamp: meta.timestamp ?? 0,
                    output: meta.output ?? (utxo ? `${utxo.txid}:${utxo.vout}` : ''),
                    value: String(meta.value ?? utxo?.value ?? 0),
                    sat_ordinal: meta.sat ? String(meta.sat) : undefined
                });
            }
        } catch {
            // Skip failed lookups
        }
    });

    await Promise.all(metaPromises);

    // Sort by inscription number descending (newest first)
    inscriptions.sort((a, b) => b.number - a.number);

    const result: InscriptionsResponse = {
        results: inscriptions,
        total: inscriptions.length
    };

    setCache(cacheKey, result);
    return result;
}

export async function getInscriptionById(id: string): Promise<Inscription | null> {
    const cacheKey = `inscription:${id}`;
    const cached = getCached<Inscription>(cacheKey);
    if (cached) return cached;

    try {
        const res = await fetch(`${ORDINALS_BASE}/r/inscription/${id}`);
        if (!res.ok) return null;
        const meta: OrdinalsInscriptionMeta = await res.json();
        const inscription: Inscription = {
            id,
            number: meta.number ?? 0,
            content_type: meta.content_type ?? 'unknown',
            content_length: meta.content_length ?? 0,
            genesis_height: meta.genesis_height ?? 0,
            timestamp: meta.timestamp ?? 0,
            output: meta.output ?? '',
            value: String(meta.value ?? 0),
            sat_ordinal: meta.sat ? String(meta.sat) : undefined
        };
        setCache(cacheKey, inscription);
        return inscription;
    } catch {
        return null;
    }
}

export function getPreviewUrl(inscriptionId: string): string {
    return `${ORDINALS_BASE}/preview/${inscriptionId}`;
}

export function getContentUrl(inscriptionId: string): string {
    return `${ORDINALS_BASE}/content/${inscriptionId}`;
}

export function clearCache() {
    cache.clear();
}
