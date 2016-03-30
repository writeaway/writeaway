import C from "../constants";

export const pageStartCreating = page => {
    return {type: C.PAGE_START_CREATING, page}
};

export const pageCancelCreating = index => {
    return {type: C.PAGE_START_CREATING, index}
};

export const pageUpdate = (index, page) => {
    return {type: C.PAGE_UPDATE, index, page}
};

export const pageCreating = () => {
    return {type: C.PAGE_CREATING}
};

export const pageCreateError = error => {
    return {type: C.PAGE_CREATE_ERROR, error}
};

export const pageCreateFailed = res => {
    return {type: C.PAGE_CREATE_FAILED, res}
};

export const pageCreated = page => {
    return {type: C.PAGE_CREATED, page}
};

export const addPage = (data) => {
    return (dispatch, getState) => {
        dispatch(pageCreating());
        const pages = getState().pages;
        return fetch(pages.createURL, {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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
                dispatch(pageCreated(res.page));
            } else {
                dispatch(pageCreateFailed(res));
            }
        }).catch(error => {
            dispatch(pageCreateError(error));
        });
    }
};

export const pageSaving = () => {
    return {type: C.PAGE_SAVING}
};

export const pageSaveError = (id, error) => {
    return {type: C.PAGE_SAVE_ERROR, id, error}
};

export const pageSaveFailed = (id, res) => {
    return {type: C.PAGE_SAVE_FAILED, id, res}
};

export const pageSaved = (id, res) => {
    return {type: C.PAGE_SAVED, id, res}
};

export const savePage = (index) => {
    return (dispatch, getState) => {
        dispatch(pageSaving(id));
        const pages = getState().pages;
        const page = pages.list[index > -1 ? index : pages.currentEditIndex];
        return fetch(page.saveURL || pages.saveURL, {
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
                dispatch(pageSaved(id, res));
            } else {
                dispatch(pageSaveFailed(id, res));
            }
        }).catch(error => {
            dispatch(pageSaveError(id, error));
        });
    }
};