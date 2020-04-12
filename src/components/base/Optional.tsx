import React from 'react';

type BooleanLike = boolean | number | string | null | undefined;

interface OptionalProps {
    /**
     * Determines whether or not to render the object. If not defined, the object will not render.
     */
    condition: BooleanLike;
}

export const Optional: React.FC<OptionalProps> = ({ condition, children }) => {
    return (
        <>
            {!condition ? null : children}
        </>
    );
};