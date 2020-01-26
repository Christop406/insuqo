import React from 'react';

const RiderInfoModal: React.FunctionComponent = () => {
    return (
        <div style={{ maxWidth: 500 }}>
            <h3>What are riders?</h3>
            <p>
                <b>Riders</b> are additional features added to your life insurance plan
                that stay active over the life of the plan.
            </p>
            <h3>Types of Riders</h3>
            <h4>Accidental Death Benefit</h4>
            <p>
                This rider adds an extra layer of payment in the event that a pre-determined,
                accidental event is the cause of the policyholder's death.
            </p>
            <h4>Waiver of Premium</h4>
            <p>
                This rider waives premium payments in the event the policyholder becomes
                critically ill, seriously injured, or disabled.
            </p>
            <h4>Return of Premium</h4>
            <p>
                This rider returns the premiums paid if the policyholder outlives the policy.
            </p>
            <h4>Child Rider</h4>
            <p>
                This rider allows a policyholder's children to be covered under his/her life insurance
                policy, without having to purchase a second policy.
            </p>
        </div>
    );
};

export default RiderInfoModal;
