import C from '../constants'

const page = (page = {}, action) => {
    switch (action.type) {
        case C.PAGE_UPDATE:
            return {...page, ...action.page, changed: true};
        case C.PAGE_DATA_UPDATE:
            return {...page, data: {...page.data, ...action.data}};
        case C.PAGE_CREATING:
            return {...page, creating: true, locked: true};
        case C.PAGE_CREATED:
            return {...page, creating: false, locked: false, changed: false};
        case C.PAGE_CREATE_FAILED:
            return {...page, creating: false, locked: false};
        case C.PAGE_CREATE_ERROR:
            return {...page, error: action.error, creating: false, locked: false};

        case C.PAGE_SAVING:
            return {...page, saving: true, locked: true};
        case C.PAGE_SAVED:
            return {...page, saving: false, locked: false, changed: false};
        case C.PAGE_SAVE_FAILED:
            return {...page, saving: false, locked: false};
        case C.PAGE_SAVE_ERROR:
            return {...page, error: action.error, saving: false, locked: false};
        default:
            return page;
    }
};

const pages = (pages = {}, action) => {
    switch (action.type) {
        case C.PAGES_SET_CURRENT_INDEX:
            return {...pages, currentEditIndex: action.index};
        case C.PAGE_START_CREATING:
            if (!Array.isArray(pages.list)) pages.list =[]
            return {
                ...pages,
                list: [...pages.list, action.page],
                currentEditIndex: pages.list.length
            };
        case C.PAGE_CANCEL_CREATING:
            return {
                ...pages,
                list: [...pages.list.slice(0, pages.currentEditIndex)],
                currentEditIndex: -1
            };

        case C.PAGE_UPDATE:
        case C.PAGE_DATA_UPDATE:
        case C.PAGE_CREATING:
        case C.PAGE_CREATED:
        case C.PAGE_CREATE_FAILED:
        case C.PAGE_CREATE_ERROR:

        case C.PAGE_SAVING:
        case C.PAGE_SAVED:
        case C.PAGE_SAVE_FAILED:
        case C.PAGE_SAVE_ERROR:
            return {
                ...pages,
                list: [
                    ...pages.list.slice(0, action.index),
                    page(pages.list[action.index], action),
                    ...pages.list.slice(action.index + 1)
                ]
            };
        default:
            return pages;
    }
};

export default pages;

