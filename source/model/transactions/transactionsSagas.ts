import { take, put, all } from "redux-saga/effects";
import * as req from "./transactionsReq";
import * as actions from "./transactionsActions";

function* loadTransactionsSaga() {
    while (true) {
        const data: { payload: actions.TLoadTransactionsPayload } = yield take(actions.loadTransactions);
        const sheetTitle = data.payload;
        try {
            const result = yield req.loadTransactions(sheetTitle);

            yield put(actions.transactionsLoaded(result));
        } catch (err) {
            yield put(actions.transactionsLoadingError(err));
        }
    }
}

function* createTransactionSaga() {
    while (true) {
        const data: { payload: actions.TCreateTransactionPayload } = yield take(actions.createTransaction);
        try {
            const result = yield req.createTransaction(data.payload);

            yield put(actions.transactionCreated(result));
        } catch (err) {
            yield put(actions.transactionCreatingError(err));
        }
    }
}

function* updateTransactionSaga() {

}

function* deleteTransactionSaga() {

}

export default function* transactionsSagas() {
    yield all([
        loadTransactionsSaga(),
        createTransactionSaga(),
        updateTransactionSaga(),
        deleteTransactionSaga(),
    ]);
}