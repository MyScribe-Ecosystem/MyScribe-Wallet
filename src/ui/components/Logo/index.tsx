import { useState } from 'react';
import { Image } from '../Image';
import { Row } from '../Row';

export function Logo(props: { preset?: 'large' | 'small' | 'onlyLogo' }) {
    const { preset } = props;
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        window.open('https://myscribe.org', '_blank');
    };

    const hoverStyle = {
        transition: 'transform 0.2s ease',
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
        cursor: 'pointer'
    };

    if (preset === 'large') {
        return (
            <Row justifyCenter itemsCenter>
                <div
                    style={hoverStyle}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={handleClick}>
                    <Image src="./images/logo/logo@128x.png" width={96} height={96} />
                </div>
            </Row>
        );
    } else if (preset === 'small') {
        return (
            <Row justifyCenter itemsCenter>
                <div
                    style={hoverStyle}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={handleClick}>
                    <Image src="./images/logo/logo@128x.png" height={44} width={44} />
                </div>
            </Row>
        );
    } else {
        return (
            <Row justifyCenter itemsCenter>
                <div
                    style={hoverStyle}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={handleClick}>
                    <Image src="./images/logo/logo@128x.png" height={40} width={40} />
                </div>
            </Row>
        );
    }
}
