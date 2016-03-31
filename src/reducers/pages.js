import C from '../constants'

const page = (page = {}, action) => {
    switch (action.type) {
        case C.PAGE_UPDATE:
            return {...page, ...action.page, changed: true};
        case C.PAGE_DATA_UPDATE:
            return {...page, data: {...page.data, ...action.data}};

        case C.PAGE_SAVING:
            return {...page, saving: true, locked: true};
        case C.PAGE_SAVED:
            return {...(action.page || page), saving: false, locked: false, changed: false};
        case C.PAGE_SAVE_ERROR:
            return {...page, error: action.error, saving: false, locked: false};
        case C.PAGE_DELETING:
            return {...page, deleting: true, locked: true};
        case C.PAGE_DELETE_ERROR:
            return {...page, deleting: false, locked: false};
        default:
            return page;
    }
};

const pages = (pages = {}, action) => {
    switch (action.type) {
        case C.PAGES_SET_CURRENT_INDEX:
            return {...pages, currentEditIndex: action.index};

        case C.PAGES_GET_STARTED:
            return {...pages, loading: true};
        case C.PAGES_GET_FINISHED:
            return {...pages, list: action.list, loading: false};
        case C.PAGES_GET_ERROR:
            return {...pages, error: action.error, loading: false};

        case C.PAGE_START_CREATING:
            if (!Array.isArray(pages.list)) pages.list = [];
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

        case C.PAGE_SAVING:
        case C.PAGE_SAVED:
        case C.PAGE_SAVE_ERROR:

        case C.PAGE_DELETING:
        case C.PAGE_DELETE_ERROR:
            return {
                ...pages,
                list: [
                    ...pages.list.slice(0, +action.index),
                    page(pages.list[+action.index], action),
                    ...pages.list.slice(+action.index + 1)
                ]
            };

        case C.PAGE_DELETED:
            return {
                ...pages,
                list: [...pages.list.slice(0, +action.index), ...pages.list.slice(+action.index + 1)]
            };
        case C.PAGES_GET_LAYOUTS_STARTED:
        case C.PAGES_GET_LAYOUTS_FINISHED:
            return {...pages, layouts: action.layouts};
        case C.PAGES_GET_LAYOUTS_ERROR:
            return pages;
        default:
            return pages;
    }
};

export default pages;

