import { compareVersions } from 'compare-versions';
import { useCallback } from 'react';

import { CHAINS_MAP, ChainType, TypeChain, VERSION } from '@/shared/constant';
import { NetworkType } from '@/shared/types';
import { useWallet } from '@/ui/utils';

import { AppState } from '..';
import { useAppDispatch, useAppSelector } from '../hooks';
import { DisplaySettings, settingsActions } from './reducer';
import { DisplaySettings as FormatDisplaySettings, formatAmount as formatAmountUtil } from '@/ui/utils/formatAmount';

export function useSettingsState(): AppState['settings'] {
    return useAppSelector((state) => state.settings);
}

export function useNetworkType() {
    const accountsState = useSettingsState();
    const chain = CHAINS_MAP[accountsState.chainType];
    if (chain) {
        return chain.networkType;
    } else if (accountsState.chainType === ChainType.BITCOIN_REGTEST) {
        return NetworkType.REGTEST;
    } else {
        return NetworkType.TESTNET;
    }
}

export function useChainType() {
    const accountsState = useSettingsState();
    return accountsState.chainType;
}

export function useChain(): TypeChain<ChainType> {
    const accountsState = useSettingsState();
    const chain = CHAINS_MAP[accountsState.chainType];

    if (!chain) throw new Error(`Chain not found for type: ${accountsState.chainType}`);

    return chain;
}

export function useChangeChainTypeCallback() {
    const dispatch = useAppDispatch();
    const wallet = useWallet();

    return useCallback(
        async (type: ChainType) => {
            await wallet.setChainType(type);
            dispatch(
                settingsActions.updateSettings({
                    chainType: type
                })
            );
        },
        [dispatch, wallet]
    );
}

export function useBTCUnit() {
    const chainType = useChainType();
    return CHAINS_MAP[chainType]?.unit || 'BTC';
}

export function useTxExplorerUrl(txId: string) {
    const chain = useChain();

    switch (chain?.enum) {
        case ChainType.BITCOIN_MAINNET:
            return `https://opscan.org/transactions/${txId}?network=mainnet`;
        case ChainType.BITCOIN_TESTNET:
            return `https://opscan.org/transactions/${txId}?network=testnet`;
        case ChainType.BITCOIN_REGTEST:
            return `https://opscan.org/transactions/${txId}?network=regtest`;
        case ChainType.OPNET_TESTNET:
            return `https://opscan.org/transactions/${txId}?network=op_testnet`;
        default:
            return `https://opscan.org/transactions/${txId}`;
    }
}

export function useAddressExplorerUrl(address: string) {
    const chain = useChain();

    switch (chain?.enum) {
        case ChainType.BITCOIN_MAINNET:
            return `https://opscan.org/accounts/${address}?network=mainnet`;
        case ChainType.BITCOIN_TESTNET:
            return `https://opscan.org/accounts/${address}?network=testnet`;
        case ChainType.BITCOIN_REGTEST:
            return `https://opscan.org/accounts/${address}?network=regtest`;
        case ChainType.OPNET_TESTNET:
            return `https://opscan.org/accounts/${address}?network=op_testnet`;
        default:
            return `https://opscan.org/accounts/${address}`;
    }
}

export function useFaucetUrl() {
    const chain = useChain();
    return chain?.faucetUrl || '';
}

export function useWalletConfig() {
    const accountsState = useSettingsState();
    const config = accountsState.walletConfig;
    // MyScribe Wallet: filter out OP Wallet version nag messages
    const versionNagPattern = /wallet version|please update|too low|update to|chrome:\/\/extensions/i;
    const statusMessage =
        config.statusMessage && versionNagPattern.test(config.statusMessage)
            ? ''
            : config.statusMessage;
    const chainTip =
        config.chainTip && versionNagPattern.test(config.chainTip)
            ? ''
            : config.chainTip;
    return { ...config, statusMessage, chainTip };
}

export function useVersionInfo() {
    const currentVesion = VERSION;
    // MyScribe Wallet: disable OP Wallet version checking entirely
    return {
        currentVesion,
        newVersion: '',
        latestVersion: '',
        skipped: true
    };
}

export function useSkipVersionCallback() {
    const wallet = useWallet();
    const dispatch = useAppDispatch();
    return useCallback(
        async (version: string) => {
            await wallet.setSkippedVersion(version);
            dispatch(settingsActions.updateSettings({ skippedVersion: version }));
        },
        [dispatch, wallet]
    );
}

export function useAutoLockTimeId() {
    const state = useSettingsState();
    return state.autoLockTimeId;
}

export function useWalletHealthDelayId() {
    const state = useSettingsState();
    return state.walletHealthDelayId;
}

export function useHasCompletedDisplaySetup(): boolean {
    const state = useSettingsState();
    return state.hasCompletedDisplaySetup ?? false;
}

export function useCompleteDisplaySetup() {
    const dispatch = useAppDispatch();
    return useCallback(() => {
        dispatch(settingsActions.updateSettings({ hasCompletedDisplaySetup: true }));
    }, [dispatch]);
}

export function useDisplaySettings(): DisplaySettings {
    const state = useSettingsState();
    return (
        state.displaySettings || {
            decimalPrecision: -1,
            useKMBNotation: false,
            useCommas: false
        }
    );
}

export function useUpdateDisplaySettings() {
    const dispatch = useAppDispatch();
    return useCallback(
        (displaySettings: DisplaySettings) => {
            dispatch(settingsActions.updateSettings({ displaySettings }));
        },
        [dispatch]
    );
}

/**
 * Hook that returns a formatter function bound to the current display settings.
 * Use this in components to format amounts for display.
 * DISPLAY ONLY -- never use on input values.
 */
export function useFormatAmount() {
    const displaySettings = useDisplaySettings();
    return useCallback(
        (amount: string | number | bigint): string => {
            return formatAmountUtil(amount, displaySettings as FormatDisplaySettings);
        },
        [displaySettings]
    );
}
