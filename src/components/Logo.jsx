import React from 'react';

const Logo = ({size}) => {
    return (
        <div>
            <img src="/logo.png" alt="Logo" height={size} width={size} />
        </div>
    );
};

export default Logo;