export enum ESortOrder {
    asc = 'ASCENDING',
    desc = 'DESCENDING',
}

export enum EDimension {
    dimensionUnspecified = 'DIMENSION_UNSPECIFIED',
    rows = 'ROWS',
    columns = 'COLUMNS',
}

interface IValuesGetParams {
    spreadsheetId: string;
    range: string;
}

interface IValuesAppendParams extends IValuesGetParams {
    valueInputOption: string;
    insertDataOption: string;
}

interface IValuesUpdateParams extends IValuesGetParams {
    valueInputOption: string;
    values: any[];
}

type TCreateParams = {
    properties: {
        title: string;
    };
};

// A sort order associated with a specific column or row.
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/sheets#SortSpec
type TSortSpec = {
    sortOrder?: ESortOrder;
    foregroundColor?: any;
    foregroundColorStyle?: any;
    backgroundColor?: any;
    backgroundColorStyle?: any;
    dimensionIndex?: number;
};

type TBatchUpdateReq = {
    // Adds a new sheet
    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#AddSheetRequest
    addSheet?: {
        properties: {
            title: string;
        };
    };
    // Inserts rows or columns in a sheet at a particular index.
    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#insertdimensionrequest
    insertDimension?: {
        range: {
            sheetId: number;
            dimension: string;
            startIndex: number;
            endIndex: number,
        };
        inheritFromBefore: boolean;
    },
    // Sorts data in rows based on a sort order per column.
    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#SortRangeRequest
    sortRange?: {
        range: {
            sheetId: number;
            startRowIndex: number;
            endRowIndex: number;
            startColumnIndex: number;
            endColumnIndex: number;
        },
        sortSpecs: TSortSpec[],
    },
    // Deletes the dimensions from the sheet
    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#DeleteDimensionRequest
    deleteDimension?: {
        range: {
            sheetId: number;
            dimension: EDimension,
            startIndex: number;
            endIndex: number;
        },
    },
};

type TBatchUpdateParams = {
    spreadsheetId: string;
    requests: TBatchUpdateReq[]
};

export interface IHttpResponse {
    body: any;
    headers: any;
    result: any;
    status: any;
    statusText: any;
}

interface IGetResponse extends IHttpResponse {
    result: {
        properties: {
            autoRecalc: string;
            defaultFormat: {
                backgroundColor: any;
                padding: any;
                //...
            }
            locale: string;
            spreadsheetTheme: {
                primaryFontFamily: string;
                themeColors: any[];
                //...
            };
            timeZone: string;
            title: string;
        };
        sheets: any[];
        spreadsheetId: string;
        spreadsheetUrl: string;
    };
}

export type TSpreadsheetsApi = {
    values: {
        append: (params: IValuesAppendParams, valueRangeBody: any) => Promise<IHttpResponse>;
        get: (params: IValuesGetParams) => Promise<IHttpResponse>;
        update: (params: IValuesUpdateParams) => Promise<IHttpResponse>;
    };
    create: (params: TCreateParams) => Promise<IHttpResponse>;
    batchUpdate: (params: TBatchUpdateParams) => Promise<IHttpResponse>;
    get: (params: { spreadsheetId: string }) => Promise<IGetResponse>;
};
