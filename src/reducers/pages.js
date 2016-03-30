import C from '../constants'

const page = (page = {}, action) => {
    switch (action.type) {
        case C.PAGE_UPDATE:
            return {...page, ...action.page, changed: true};
        default:
            return page;
    }
};

const pages = (pages = {}, action) => {
    switch (action.type) {
        case C.PAGE_START_CREATING:
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

