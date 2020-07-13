import React from "react";
import format from "date-fns/format";
import {formatMoney} from "../../services/numbers";
import TransactionsTable from "./TransactionsTable";
import GTransactionRow from "../../google-api/GTransactionRow";
import { t } from "../../services/i18n";

type TProps = {
    data: GTransactionRow[];
    loading: boolean;
};

const TransactionsList = (props: TProps) => {
    const { data, loading } = props;
    const columns = React.useMemo(
        () => [
            {
                Header: t('transactions.table.date'),
                accessor: 'date',
                Cell: cellProps => format(cellProps.value, "yyyy-MM-dd HH:mm"),
            },
            {
                Header: t('transactions.table.category'),
                accessor: 'rootCategory',
            },
            {
                Header: t('transactions.table.amount'),
                accessor: 'amountInDefaultCoin',
                Cell: cellProps => formatMoney(cellProps.value),
            },
            {
                Header: t('transactions.table.tags'),
                accessor: 'tags',
                Cell: cellProps => cellProps.value.join(', '),
            },
            {
                Header: t('transactions.table.comment'),
                accessor: 'comment',
            },
        ],
        []
    )

    return (
        <>
            <TransactionsTable
                columns={columns}
                data={data.map(item => item.getValues())}
            />
            {data.length === 0 && !loading ? t('transactions.table.no_transactions') : null}
        </>
    );
};

export default TransactionsList;
