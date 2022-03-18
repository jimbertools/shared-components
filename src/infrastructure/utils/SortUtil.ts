import { ISort } from '../types/FileManagerTypes';
import { SortType } from '@/components';

export const orderBy = <T extends Record<string, any>>(array: T[], sortKey: ISort, headers: any[]): T[] => {
    const i = sortKey.order === SortType.DESCENDING ? -1 : 1;
    const comparer = headers.find((h: any) => h.key === sortKey.prop)?.comparer;
    return array.sort((a: T, b: T) => {
        if (comparer) return comparer(a, b, i);
        const aValue = a[sortKey.prop];
        const bValue = b[sortKey.prop];
        if (!aValue) return -1 * i;
        if (!bValue) return i;
        return (
            i *
            ('' + aValue).localeCompare('' + bValue, undefined, {
                sensitivity: 'base',
                numeric: true,
            })
        );
    });
};
