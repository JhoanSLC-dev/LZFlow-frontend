export type Locale = 'en' | 'es';

export interface Messages {
    sidebar: Record<string, string>;
    header: Record<string, string>;
    dashboard: Record<string, string>;
    auth: Record<string, string>;
    common: Record<string, string>;
    products: Record<string, string>;
    categories: Record<string, string>;
    suppliers: Record<string, string>;
    sales: Record<string, string>;
    settings: Record<string, string>;
    users: Record<string, string>;
    pagination: Record<string, string>;
}

export { messages } from './messages';
