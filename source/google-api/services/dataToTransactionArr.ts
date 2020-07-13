import formatISO from "date-fns/formatISO";
import { TTransactionRowValues } from "./transactionArrToData";

const propsExportList = [
    'id',
    'date',
    'accountFrom',
    'accountTo',
    'transactionType',
    'amountInDefaultCoin',
    'defaultCoin',
    'amountInAccountFromCoin',
    'accountFromCoin',
    'exchangeRate',
    'amountInAccountToCoin',
    'accountToCoin',
    'comment',
    'tags',
    'category',
    'rootCategory',
    'parentId',
    'userId',
];

const formatsMap = new Map([
    ['date', date => formatISO(date)],
    ['accountTo', accountTo => accountTo ?? ''],
    ['exchangeRate', exchangeRate => exchangeRate ?? 1],
    ['amountInAccountToCoin', amountInAccountToCoin => amountInAccountToCoin ?? ''],
    ['accountToCoin', accountToCoin => accountToCoin ?? ''],
    ['comment', comment => comment ?? ''],
    ['tags', tags => tags ?? ''],
    ['category', category => category ?? ''],
]);

const dataToTransactionArr = (values: TTransactionRowValues): any[] => {
    return propsExportList.map((key) => {
        if (formatsMap.has(key)) {
            // @ts-ignore
            return formatsMap.get(key)(values[key]);
        }
        return values[key];
    });
};

export default dataToTransactionArr;
