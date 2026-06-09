/**
 * Created by chenhu5 on 2017/12/15.
 */
import fetch from "@/utils/fetch";

const getParamTemplatePage = (params) => {
    return fetch({
        url: "paramTemplate/page",
        method: "post",
        data: params,
    });
};

const updateParamTemplate = (params) => {
    return fetch({
        url: "paramTemplate/update",
        method: "post",
        data: params,
    });
};

const deleteParamTemplate = (ids) => {
    return fetch({
        url: "paramTemplate/delete",
        method: "post",
        data: {
            ids: ids,
        },
    });
};

const getParamTemplateFileDownLoadUrl = (fileKey) => {
    return fetch({
        url: "paramTemplate/getFileDownLoadUrl",
        method: "post",
        data: {
            fileKey: fileKey,
        },
    });
};

const paramTemplateApiList = {
    /*  area start  */
    getParamTemplatePage,
    updateParamTemplate,
    deleteParamTemplate,
    getParamTemplateFileDownLoadUrl,
    /*  area end    */
};

export default paramTemplateApiList;
