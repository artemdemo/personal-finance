import React from "react";
import { connect } from "react-redux";
import { t } from "../../services/i18n";
import RowMenu from "../../components/GeneralTable/RowMenu";
import GeneralTable from "../../components/GeneralTable/GeneralTable";
import {TGlobalState} from "../../reducers";
import {
    TDeleteCategory,
    deleteCategory,
} from "../../model/categories/categoriesActions";
import {ISheetsState} from "../../model/sheets/sheetsReducer";
import {getAccountsSheet} from "../../services/sheets";
import history from "../../history";
import * as routes from "../../routing/routes";
import {ICategoriesState} from "../../model/categories/categoriesReducer";
import GCategoryRow from "../../google-api/GCategoryRow";

type TProps = {
    categories: ICategoriesState;
    sheets: ISheetsState;
    deleteCategory: TDeleteCategory;
};

class CategoriesList extends React.PureComponent<TProps> {
    COLUMNS = [
        {
            Header: t('categories.table.name'),
            accessor: 'name',
        },
        {
            Header: t('categories.table.parent'),
            accessor: 'parent',
        },
    ];

    getCategoryById(categoryId: string): GCategoryRow {
        const account = this.props.categories.data.find(item => item.getId() === categoryId);
        if (!account) {
            throw new Error(`Category for the given id is not found. ID was ${categoryId}`);
        }
        return account;
    }

    handleDelete = (item) => {
        const { deleteCategory, sheets } = this.props;
        deleteCategory({
            sheet: getAccountsSheet(sheets.data),
            category: this.getCategoryById(item.original.id),
        });
    };

    handleEdit = (item) => {
        history.push(routes.categories.edit(item.original.id));
    };

    render() {
        const { categories } = this.props;

        return (
            <>
                <GeneralTable
                    columns={this.COLUMNS}
                    data={categories.data.map(item => item.getValues())}
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
                {categories.data.length() === 0 && !categories.loading ? t('categories.table.no_categories') : null}
                {categories.loading ? t('common.loading') : ''}
            </>
        );
    }
}

export default connect(
    (state: TGlobalState) => ({
        categories: state.categories,
        sheets: state.sheets,
    }),
    {
        deleteCategory,
    },
)(CategoriesList);