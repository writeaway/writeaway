import C from "../constants";

export const pageSetCurrentIndex = index => {
    return {type: C.PAGES_SET_CURRENT_INDEX, index}
};

export const pageStartCreating = page => {
    return {type: C.PAGE_START_CREATING, page}
};

export const pageCancelCreating = index => {
    return {type: C.PAGE_CANCEL_CREATING, index}
};

export const pageUpdate = (index, page) => {
    return {type: C.PAGE_UPDATE, index, page}
};

export const pageDataUpdate = (index, data) => {
    return {type: C.PAGE_DATA_UPDATE, index, data}
};

export const pageSaving = index => {
    return {type: C.PAGE_SAVING, index}
};

export const pageSaveError = (index, error) => {
    return {type: C.PAGE_SAVE_ERROR, index, error}
};

export const pageSaved = (index, page) => {
    return {type: C.PAGE_SAVED, index, page}
};

export const savePage = (index) => {
    return (dispatch, getState) => {
        dispatch(pageSaving(index));
        const pages = getState().pages;
        const page = pages.list[index > -1 ? index : pages.currentEditIndex];
        return fetch(!page.id && pages.createURL || pages.saveURL, {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: page.id,
                data: page.data
            })
        }).then(res => {
            if (res.headers.get("content-type") &&
                res.headers.get("content-type").toLowerCase().indexOf("application/json") >= 0) {
                return res.json()
            } else {
                throw new TypeError()
            }
        }).then(res => {
            const status = res.status;
            if (status >= 200 && status < 300 || status === 304) {
                dispatch(pageSaved(index, res.page));
                // res.message && dispatch(showMessage(res.message));
            } else {
                dispatch(pageSaveError(index, res));
            }
        }).catch(error => {
            dispatch(pageSaveError(index, error));
        });
    }
};

export const pagesGetStarted = () => {
    return {type: C.PAGES_GET_STARTED}
};

export const pagesGetFinished = list => {
    return {type: C.PAGES_GET_FINISHED, list}
};

export const pagesGetError = (error) => {
    return {type: C.PAGES_GET_ERROR, error}
};

export const pagesGet = () => {
    return (dispatch, getState) => {
        dispatch(pagesGetStarted());
        const pages = getState().pages;
        return fetch(pages.getAllURL, {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.headers.get("content-type") &&
                res.headers.get("content-type").toLowerCase().indexOf("application/json") >= 0) {
                return res.json()
            } else {
                throw new TypeError()
            }
        }).then(res => {
            const status = res.status;
            if (status >= 200 && status < 300 || status === 304) {
                dispatch(pagesGetFinished(res.pages));
            } else {
                dispatch(pagesGetError(res));
            }
        }).catch(error => {
            dispatch(pagesGetError(error));
        });
    }
};