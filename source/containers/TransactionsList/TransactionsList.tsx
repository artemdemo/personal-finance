import React from 'react';
import {connect} from 'react-redux';
import format from 'date-fns/format';
import {createSelector} from 'reselect';
import {IColumnInstance} from "../../types/react-table";
import {formatMoney} from '../../services/numbers';
import GeneralTable from '../../components/GeneralTable/GeneralTable';
import {t} from '../../services/i18n';
import RowMenu from '../../components/GeneralTable/RowMenu';
import {ITransactionsState} from '../../model/transactions/transactionsReducer';
import {
  TDeleteTransaction,
  deleteTransaction,
} from '../../model/transactions/transactionsActions';
import {TGlobalState} from '../../reducers';
import {ISheetsState} from '../../model/sheets/sheetsReducer';
import {getTransactionsSheet} from '../../services/sheets';
import history from '../../history';
import * as routes from '../../routing/routes';
import GTransactionRow, {ITransactionRowValues} from '../../google-api/GTransactionRow';
import {IAccountsState} from '../../model/accounts/accountsReducer';
import {enrichTransactions} from '../../services/mixins';
import {ICategoriesState} from '../../model/categories/categoriesReducer';
import * as time from '../../services/time';
import SelectFilter from '../../components/GeneralTable/filters/SelectFilter';
import FreeTextFilter from '../../components/GeneralTable/filters/FreeTextFilter';
import {filterIncludesCaseInsensitive, filterEquals} from '../../components/GeneralTable/filters/customFilters';

type TProps = {
  sheets: ISheetsState;
  transactions: ITransactionsState;
  accounts: IAccountsState;
  categories: ICategoriesState;
  deleteTransaction: TDeleteTransaction;
};

const enrichedTransactionsSelector = createSelector(
  (props: TProps) => props.transactions,
  (props: TProps) => props.accounts,
  (props: TProps) => props.categories,
  (transactions, accounts, categories) => {
    return enrichTransactions(transactions.data, accounts.data, categories.data)
      .map((transaction) => {
        return {
          ...transaction,
          accountFrom: transaction.accountFrom?.getName(),
          accountTo: transaction.accountTo?.getName(),
          rootCategory: transaction.rootCategory?.getName(),
          category: transaction.category?.getName(),
        };
      });
  },
);

class TransactionsList extends React.PureComponent<TProps> {
  COLUMNS: IColumnInstance<ITransactionRowValues>[] = [
    {
      Header: t('transactions.table.date'),
      accessor: 'date',
      Cell: (cellProps) => {
        return (
          <span title={format(cellProps.value, time.getDateTimeFormat())}>
            {format(cellProps.value, time.getDateFormat())}
          </span>
        );
      },
    },
    {
      Header: t('transactions.table.category'),
      accessor: 'rootCategory',
      Filter: SelectFilter,
      filter: filterEquals,
    },
    {
      Header: t('transactions.table.transactionType'),
      accessor: 'transactionType',
      Filter: SelectFilter,
      filter: filterEquals,
    },
    {
      Header: t('transactions.table.amount'),
      accessor: 'amountInDefaultCoin',
      Cell: cellProps => formatMoney(cellProps.value),
    },
    {
      Header: t('transactions.table.tags'),
      accessor: 'tags',
      Cell: cellProps => cellProps.value?.join(', ') || '',
    },
    {
      Header: t('transactions.table.comment'),
      accessor: 'comment',
      Filter: FreeTextFilter,
      filter: filterIncludesCaseInsensitive,
    },
  ];

  getTransactionById(transactionId: string): GTransactionRow {
    const transaction = this.props.transactions.data.find(item => item.getId() === transactionId);
    if (!transaction) {
      throw new Error(`Account for the given id is not found. id was ${transactionId}`);
    }
    return transaction;
  }

  handleDelete = (item) => {
    const {deleteTransaction, sheets} = this.props;
    const transaction = this.getTransactionById(item.original.id);
    deleteTransaction({
      sheet: getTransactionsSheet(sheets.data),
      transaction,
    });
  };

  handleEdit = (item) => {
    history.push(routes.transactions.edit(item.original.id));
  };

  renderTable() {
    return (
      <GeneralTable
        columns={this.COLUMNS}
        data={enrichedTransactionsSelector(this.props)}
        menu={(row) => (
          <RowMenu
            menu={[
              {
                text: t('common.edit'),
                onClick: this.handleEdit,
                className: '',
              },
              {
                text: t('common.delete'),
                onClick: this.handleDelete,
                className: 'text-red-600',
              },
            ]}
            row={row}
          />
        )}
      />
    );
  }

  render() {
    const {transactions, accounts, categories} = this.props;
    const isLoading = transactions.loading || accounts.loading || categories.loading;

    return (
      <>
        {!isLoading && this.renderTable()}
        {transactions.data.length() === 0 && !isLoading ? t('transactions.table.no_transactions') : null}
        {isLoading ? t('common.loading') : ''}
      </>
    );
  }
}

export default connect(
  (state: TGlobalState) => ({
    sheets: state.sheets,
    transactions: state.transactions,
    accounts: state.accounts,
    categories: state.categories,
  }),
  {
    deleteTransaction,
  },
)(TransactionsList);
