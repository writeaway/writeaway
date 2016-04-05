import C from "../constants"
import callFetch from '../helpers/fetch'

export const initI18N = () => {
    return (dispatch, getState) => {
        const i18n = getState().i18n;

        const ignoredTags = {
                script: true,
                style: true,
                html: true,
                head: true
            },
            ignoredAttributes = {
                id: true,
                style: true,
                class: true,
                getNamedItem: true,
                getNamedItemNS: true,
                setNamedItem: true,
                setNamedItemNS: true,
                removeNamedItem: true,
                removeNamedItemNS: true,
                'http-equiv': true,
                href: true,
                src: true,
                rel: true,
                target: true,
                charset: true
            },
            escapeHtmlEntities = text => {
                var entityTable = {
                    38: 'amp',
                    60: 'lt',
                    62: 'gt'
                };
                return text.replace(/[<>&]/g, function (c) {
                    return '&' +
                        (entityTable[c.charCodeAt(0)] || '#' + c.charCodeAt(0)) + ';';
                });
            },
            findString = (node, key, string) => {
                switch (node.nodeType) {
                    case 1:
                        if (ignoredTags[node.tagName.toLowerCase()]) break;
                        let dataAttr = void(0);
                        for (let index in node.attributes) {
                            if (!node.attributes[index].name || ignoredAttributes[node.attributes[index].name]) break;
                            if (node.attributes[index].value.indexOf(string) > -1) {
                                (typeof dataAttr !== 'object') && (dataAttr = {});
                                !dataAttr.node && (dataAttr.node = node);
                                !dataAttr.visible && (dataAttr.visible = !(node.tagName.toLowerCase() === 'meta'));
                                !dataAttr.attributes && (dataAttr.attributes = []);
                                dataAttr.attributes.push(node.attributes[index].name);
                            }
                        }
                        if (dataAttr) {
                            !result[key] && (result[key] = {});
                            !result[key].attributes && (result[key].attributes = []);
                            result[key].attributes.push(dataAttr);
                        }
                        break;
                    case 3:
                        if (node.nodeValue.indexOf(string) > -1) {
                            let parent = node.parentElement,
                                isVisible = !!parent.offsetParent;
                            if (ignoredTags[parent.tagName.toLowerCase()]) break;//script for example

                            isVisible && (parent.innerHTML = parent.innerHTML.replace(escapeHtmlEntities(string), '<span class="i18n">' + string + '</span>'));
                            !result[key] && (result[key] = {});
                            !result[key].nodes && (result[key].nodes = []);
                            result[key].nodes.push({
                                node: isVisible ? parent.querySelector('span.i18n') : parent,
                                visible: isVisible
                            });
                        }
                        break;
                }

                if (node.childNodes && node.childNodes.length) {
                    for (let index in node.childNodes) {
                        findString(node.childNodes[index], key, string);
                    }
                }
            };
        var result = {};
        var i = 0;
        while (i < 1) {
            for (var key in i18n.data) {
                findString(document.documentElement, key, i18n.data[key]);
            }
            i++
        }

        dispatch(setI18Nelements(result));
    };
};

export const setI18Nelements = (elements) => {
    return {type: C.I18N_SET_ELEMENTS, elements}
};

export const findI18N = () => {
    return {type: C.I18N_FIND}
};

export const i18nToggleEdit = () => {
    return {type: C.I18N_TOGGLE_EDIT}
};

export const updateI18NData = (id, value) => {
    return {type: C.I18N_UPDATE_DATA, id, value}
};

export const i18nSave = () => {
    return (dispatch, getState) => {
        const i18n = getState().i18n;
        const data = i18n.data;
        return callFetch({url: i18n.saveURL, data: data}).then(res => {
            dispatch(i18nSaved());
        }).catch(error => {
            // dispatch(i18nSaveError(error));
        });
    }
};

export const i18nSaved = () => {
    return {type: C.I18N_SAVED}
};