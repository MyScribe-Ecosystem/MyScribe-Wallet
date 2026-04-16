import { useEffect, useState } from 'react';
import { MyScribeProfileService, type MyScribeProfile } from '@/shared/services/MyScribeProfileService';

/**
 * React hook that resolves a MyScribe profile for the given wallet.
 * Pass the quantumPublicKeyHash (MLDSA address hash) — this is what the
 * MyScribe Factory contract uses to look up profiles.
 *
 * Returns the avatarInscId (Ordinals inscription ID for the pfp) if the user
 * has a MyScribe account on the current OPNet network, or null otherwise.
 */
export function useMyScribeProfile(quantumPublicKeyHash: string | undefined) {
    const [profile, setProfile] = useState<MyScribeProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!quantumPublicKeyHash) {
            setProfile(null);
            return;
        }

        let cancelled = false;
        setLoading(true);

        const fetchWithRetry = async () => {
            // First attempt
            let result = await MyScribeProfileService.getProfile(quantumPublicKeyHash).catch(() => null);

            // If null and not cached (Web3API might not be ready yet), retry after 2s
            if (!result && !cancelled) {
                await new Promise((r) => setTimeout(r, 2000));
                if (!cancelled) {
                    result = await MyScribeProfileService.getProfile(quantumPublicKeyHash).catch(() => null);
                }
            }

            if (!cancelled) {
                setProfile(result);
                setLoading(false);
            }
        };

        void fetchWithRetry();

        return () => {
            cancelled = true;
        };
    }, [quantumPublicKeyHash]);

    return {
        avatarInscId: profile?.avatarInscId ?? null,
        username: profile?.username ?? null,
        displayName: profile?.displayName ?? null,
        loading
    };
}
