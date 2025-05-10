import {useEffect} from 'react';

//Fixes the issue in App.css that is centering our pages.
//Simply return this hook in your function on relevant pages.
export function useBodyClass(className: string) {
    useEffect(() => {
        document.body.classList.add(className);
        return () => {
            document.body.classList.remove(className);
        };
    }, [className]);
}