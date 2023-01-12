interface enumOptions {
    filterKey: string;
    translationKey: string;
    options: string[];
}

export interface SearchOptions {
    enableSearch: boolean;
    options: string[];
    enumOptions?: enumOptions;
    whitelistedOptions?: string[];
    blacklistedOptions?: string[];
    matchCase?: boolean;
}
