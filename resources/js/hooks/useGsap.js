import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useGsap(animateFn, deps = []) {
    const contextRef = useRef(null);

    useEffect(() => {
        if (typeof animateFn !== 'function') {
            return undefined;
        }

        contextRef.current = gsap.context((context) => {
            animateFn(context);
        });

        return () => {
            contextRef.current?.revert();
            contextRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return contextRef;
}

export function useGsapRef() {
    return useRef(null);
}
