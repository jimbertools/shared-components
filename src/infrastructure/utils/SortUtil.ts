import { ISort } from '../types/FileManagerTypes';

export const orderBy = <T extends Record<string, any>>(array: T[], sortKey: ISort, headers: any[]): T[] => {
    const i = sortKey.order === 'descending' ? -1 : 1;
    const comparer = headers.find((h: any) => h.key === sortKey.prop)?.comparer;
    return array.sort((a: T, b: T) => {
        if (comparer)
            return comparer(a, b, i);
        const aValue = a[sortKey.prop];
        const bValue = b[sortKey.prop];
        return (
            i *
            ('' + aValue).localeCompare('' + bValue, undefined, {
                sensitivity: 'base',
                numeric: true,
            })
        );
    });
};