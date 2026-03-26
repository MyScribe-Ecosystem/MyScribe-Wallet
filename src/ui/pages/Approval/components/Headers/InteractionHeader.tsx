import { SignInteractionApprovalParams } from '@/shared/types/Approval';
import { ContractInformation } from '@/shared/web3/interfaces/ContractInformation';
import { ContractNames } from '@/shared/web3/metadata/ContractNames';
import { FileTextOutlined } from '@ant-design/icons';

const colors = {
    main: '#C49A3C',
    background: '#0A1628',
    text: '#dbdbdb',
    textFaded: 'rgba(219, 219, 219, 0.7)',
    buttonBg: '#1a3050',
    buttonHoverBg: 'rgba(85, 85, 85, 0.3)',
    containerBg: '#1a3050',
    containerBgFaded: '#122240',
    containerBorder: '#2a4060',
    inputBg: '#122240',
    success: '#4ade80',
    error: '#ef4444',
    warning: '#fbbf24',
    info: '#3b82f6'
};

export interface Props {
    params: SignInteractionApprovalParams;
}

export const InteractionHeader = ({
    contract,
    contractInfo
}: {
    contract: string;
    contractInfo?: ContractInformation;
}) => {
    const contractName = contractInfo?.name || ContractNames[contract] || 'Unknown Contract';
    const shortAddress = `${contract.slice(0, 8)}...${contract.slice(-6)}`;

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${colors.main}10 0%, ${colors.main}05 100%)`,
                border: `1.5px solid ${colors.main}20`,
                borderRadius: '0px',
                padding: '16px',
                marginBottom: '12px'
            }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                {contractInfo?.logo ? (
                    <img
                        src={contractInfo.logo}
                        alt={contractName}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '0px'
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '0px',
                            background: colors.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <FileTextOutlined style={{ fontSize: 20, color: colors.background }} />
                    </div>
                )}

                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: colors.text,
                            marginBottom: '2px'
                        }}>
                        {contractName}
                    </div>
                    <div
                        style={{
                            fontSize: '11px',
                            color: colors.textFaded,
                            fontFamily: 'monospace'
                        }}>
                        {shortAddress}
                    </div>
                </div>
            </div>
        </div>
    );
};
