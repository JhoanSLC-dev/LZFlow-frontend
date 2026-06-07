export type Locale = 'en' | 'es';

export interface Messages {
    sidebar: Record<string, string>;
    header: Record<string, string>;
    dashboard: Record<string, string>;
    auth: Record<string, string>;
    common: Record<string, string>;
}

export { messages } from './messages';
