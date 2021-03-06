import React from 'react';
import * as Yup from 'yup';
import {IFormProps} from '../../types/formik';
import {t} from '../../services/i18n';
import {getInputClass} from '../../styles/elements';
import Select from '../../components/Select/Select';
import {Button} from '../../components/Button/Button';
import EditForm, {IEditFormProps} from './EditForm';
import {EAccountType} from '../../google-api/db/AccountsTable';

export type TValues = {
  name: string;
  type: string;
  startAmount: string;
};

export const initValues: TValues = {
  name: '',
  type: '',
  startAmount: '',
};

export const accountValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required(t('common.required')),
  type: Yup.string()
    .required(t('common.required')),
  startAmount: Yup.number()
    .required(t('common.required')),
});

export interface IEditAccountForm extends IFormProps {
  values: TValues;
}

interface IProps extends IEditFormProps {
  formProps: IEditAccountForm;
}

class EditAccountForm extends EditForm<IProps> {
  renderName() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
    } = this.props.formProps;
    return (
      <>
        <input
          type='text'
          className={getInputClass({
            error: errors.name && touched.name,
            disabled: this.isDisabled(),
          })}
          placeholder={t('accounts.name')}
          name='name'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.name}
          disabled={this.isDisabled()}
        />
        {this.renderError('name')}
      </>
    );
  }

  renderType() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
    } = this.props.formProps;

    return (
      <>
        <Select
          className={getInputClass({
            error: errors.type && touched.type,
            disabled: this.isDisabled(),
          })}
          name='type'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.type}
          disabled={this.isDisabled()}
        >
          <option value='' disabled>
            {t('accounts.account_type')}
          </option>
          {Object.keys(EAccountType).map(key => (
            <option
              value={key}
              key={key}
            >
              {t(`accounts.type.${key}`)}
            </option>
          ))}
        </Select>
        {this.renderError('type')}
      </>
    );
  }

  renderStartAmount() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
    } = this.props.formProps;

    return (
      <>
        <input
          type='number'
          className={getInputClass({
            error: errors.startAmount && touched.startAmount,
            disabled: this.isDisabled(),
          })}
          placeholder={t('accounts.start_amount')}
          name='startAmount'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.startAmount}
          disabled={this.isDisabled()}
        />
        {this.renderError('startAmount')}
      </>
    );
  }

  render() {
    const {handleSubmit} = this.props.formProps;

    return (
      <form className='max-w-md' onSubmit={handleSubmit}>
        <div className='flex flex-wrap -mx-2 mb-4'>
          <div className='w-1/2 px-2'>
            {this.renderName()}
          </div>
          <div className='w-1/2 px-2'>
            {this.renderType()}
          </div>
        </div>
        <div className='flex flex-wrap -mx-2 mb-4'>
          <div className='w-1/2 px-2'>
            {this.renderStartAmount()}
          </div>
        </div>
        <Button type='submit' disabled={this.isDisabled()}>
          {t('common.submit')}
        </Button>
      </form>
    );
  }
}

export default EditAccountForm;
