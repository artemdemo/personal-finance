import React from "react";
import { Formik } from "formik";
import {getInputClass, getLinkBtnClass} from "../../styles/elements";
import {spreadsheetID} from "../../services/settingsStorage";

type TValues = {
    spreadsheetId: string;
};

type TFormProps = {
    values: TValues;
    errors: any;
    touched: any;
    handleChange: () => void;
    handleBlur: () => void;
    handleSubmit: () => void;
    isSubmitting: boolean;
};

type TProps = {};
type TState = {};

class SettingsMainView extends React.PureComponent<TProps, TState> {
    handleSubmit = (values: TValues, { setSubmitting }) => {
        setSubmitting(false);
        spreadsheetID.set(values.spreadsheetId);
    }

    handleValidation = (values: TValues) => {}

    renderForm = (formProps: TFormProps) => {
        const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
        } = formProps;

        return (
            <form className="max-w-md" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-2 mb-4">
                    <div className="w-1/2 px-2">
                        <input
                            type="text"
                            name="spreadsheetId"
                            className={getInputClass()}
                            placeholder="Spreadsheet ID"
                            value={values.spreadsheetId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="w-1/2 px-2">
                        <a
                            className={getLinkBtnClass({
                                disabled: values.spreadsheetId === '',
                            })}
                            href={`https://docs.google.com/spreadsheets/d/${values.spreadsheetId}/edit#gid=0`}
                        >
                            Open spreadsheet DB
                        </a>
                    </div>
                </div>
            </form>
        );
    };

    render() {
        let spreadsheetId = '';
        try {
            spreadsheetId = spreadsheetID.get();
        } catch (e) {
            console.error(e);
        }
        return (
            <Formik
                initialValues={{
                    spreadsheetId,
                }}
                validate={this.handleValidation}
                onSubmit={this.handleSubmit}
            >
                {this.renderForm}
            </Formik>
        );
    }
}

export default SettingsMainView;
