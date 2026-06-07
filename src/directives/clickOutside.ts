import type { Directive } from 'vue';

interface HTMLElementWithHandler extends HTMLElement {
    __clickOutsideHandler?: (e: MouseEvent) => void;
}

export const vClickOutside: Directive<HTMLElementWithHandler, () => void> = {
    mounted(el, binding) {
        const handler = (e: MouseEvent) => {
            if (!el.contains(e.target as Node)) {
                binding.value();
            }
        };
        el.__clickOutsideHandler = handler;
        document.addEventListener('click', handler);
    },
    unmounted(el) {
        if (el.__clickOutsideHandler) {
            document.removeEventListener('click', el.__clickOutsideHandler);
        }
    },
};

declare module 'vue' {
    interface ComponentCustomProperties {
        vClickOutside: typeof vClickOutside;
    }
}
