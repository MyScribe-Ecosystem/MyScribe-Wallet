/**
 * MyScribe Profile Service
 *
 * Looks up a user's MyScribe profile from the on-chain Factory contract,
 * extracts the avatar inscription ID, and caches results with TTL.
 *
 * Flow: walletAddress → Factory.resolveAddress() → Profile.getProfile() → avatarInscId
 */
import { getContract } from 'opnet';
import { Address } from '@btc-vision/transaction';
import Web3API from '@/shared/web3/Web3API';
import {
    MYSCRIBE_FACTORY_ABI,
    MYSCRIBE_FACTORY_ADDRESS,
    MYSCRIBE_PROFILE_ABI
} from '@/shared/web3/abi/MYSCRIBE_ABI';
import { ChainType } from '@/shared/constant/chainType';

export interface MyScribeProfile {
    avatarInscId: string | null;
    username: string | null;
    displayName: string | null;
}

interface CachedProfile {
    profile: MyScribeProfile;
    resolvedAt: number;
    expiresAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY = 'myscribe_profile_cache';

class MyScribeProfileServiceClass {
    private cache = new Map<string, CachedProfile>();
    private initialized = false;
    private pendingRequests = new Map<string, Promise<MyScribeProfile | null>>();

    /**
     * Load cached profiles from chrome.storage.local on first call.
     */
    private async ensureInitialized(): Promise<void> {
        if (this.initialized) return;
        this.initialized = true;

        try {
            const data = await chrome.storage.local.get(STORAGE_KEY);
            const entries = data[STORAGE_KEY] as CachedProfile[] | undefined;
            if (entries) {
                const now = Date.now();
                for (const entry of entries) {
                    const key = this.getCacheKeyFromEntry(entry);
                    if (key && entry.expiresAt > now) {
                        this.cache.set(key, entry);
                    }
                }
            }
        } catch {
            // Storage unavailable (e.g. in content script context) — run without persistence
        }
    }

    private getCacheKeyFromEntry(_entry: CachedProfile): string | null {
        // Entries are stored with their key in the Map; we reconstruct from storage
        return null;
    }

    private getCacheKey(chainType: string, address: string): string {
        return `${chainType}:${address.toLowerCase()}`;
    }

    /**
     * Get a user's MyScribe profile (cached with TTL).
     * Returns null if the user has no MyScribe account or if not on a supported network.
     */
    async getProfile(address: string): Promise<MyScribeProfile | null> {
        if (!address) return null;

        // Only query on OPNet Testnet (where the factory is deployed)
        let chainType: ChainType;
        try {
            chainType = Web3API.chain;
        } catch {
            return null;
        }

        if (chainType !== ChainType.OPNET_TESTNET) {
            return null;
        }

        await this.ensureInitialized();

        const key = this.getCacheKey(chainType, address);

        // Check in-memory cache
        const cached = this.cache.get(key);
        if (cached && Date.now() < cached.expiresAt) {
            return cached.profile;
        }

        // Deduplicate concurrent requests for the same address
        const pending = this.pendingRequests.get(key);
        if (pending) return pending;

        const request = this.fetchProfile(address, key);
        this.pendingRequests.set(key, request);

        try {
            return await request;
        } finally {
            this.pendingRequests.delete(key);
        }
    }

    private async fetchProfile(address: string, cacheKey: string): Promise<MyScribeProfile | null> {
        try {
            console.log('[MyScribeProfile] Fetching profile for:', address);

            // Wrap the hex hash in an Address object (OPNet contracts expect Address, not raw strings)
            const addressHex = address.startsWith('0x') ? address : `0x${address}`;
            const addressObj = Address.fromString(addressHex);

            // Step 1: Check if user has a profile via Factory.resolveAddress()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const factory: any = getContract(
                MYSCRIBE_FACTORY_ADDRESS,
                MYSCRIBE_FACTORY_ABI,
                Web3API.provider,
                Web3API.network
            );

            const resolveResult = await factory.resolveAddress(addressObj);
            console.log('[MyScribeProfile] Factory resolveAddress result:', resolveResult);
            const profileAddress = resolveResult?.properties?.contractAddress;

            if (!profileAddress || profileAddress === 0n) {
                // No profile — cache as null to avoid re-querying
                this.cacheResult(cacheKey, { avatarInscId: null, username: null, displayName: null });
                return null;
            }

            // Step 2: Get profile data from the profile contract
            const profileAddressHex =
                typeof profileAddress === 'bigint'
                    ? '0x' + profileAddress.toString(16).padStart(64, '0')
                    : String(profileAddress);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const profileContract: any = getContract(
                profileAddressHex,
                MYSCRIBE_PROFILE_ABI,
                Web3API.provider,
                Web3API.network
            );

            const profileResult = await profileContract.getProfile();
            console.log('[MyScribeProfile] Profile getProfile result:', profileResult);
            const props = profileResult?.properties;

            const profile: MyScribeProfile = {
                avatarInscId: props?.avatarInscId || null,
                username: props?.username || null,
                displayName: props?.displayName || null
            };

            this.cacheResult(cacheKey, profile);
            return profile;
        } catch (err) {
            console.warn('[MyScribeProfile] Failed to fetch profile:', err);
            // Do NOT cache RPC failures — Web3API may not be initialized yet
            // (e.g. popup just reopened). Next call will retry.
            return null;
        }
    }

    private cacheResult(key: string, profile: MyScribeProfile): void {
        const now = Date.now();
        const entry: CachedProfile = {
            profile,
            resolvedAt: now,
            expiresAt: now + CACHE_TTL_MS
        };

        this.cache.set(key, entry);
        this.persist();
    }

    private async persist(): Promise<void> {
        try {
            const entries = Array.from(this.cache.values());
            await chrome.storage.local.set({ [STORAGE_KEY]: entries });
        } catch {
            // Storage unavailable — skip
        }
    }

    /**
     * Clear all cached profiles (useful on account switch or network change).
     */
    clearCache(): void {
        this.cache.clear();
        try {
            void chrome.storage.local.remove(STORAGE_KEY);
        } catch {
            // ignore
        }
    }
}

export const MyScribeProfileService = new MyScribeProfileServiceClass();
