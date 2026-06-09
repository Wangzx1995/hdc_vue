import fetch from '@/utils/fetch';



const getProjectsByPage = function(data){
    return fetch({
        url : '/projectManage/page',
        method : 'post',
        data:data
    });
}

const addProject = function(data){
    return fetch({
        url : '/projectManage/add',
        method : 'post',
        data:data
    });
}

const updateProject = function(data){
    return fetch({
        url : '/projectManage/update',
        method : 'post',
        data:data
    });
}

const deleteProject = function(data){
    return fetch({
        url : '/projectManage/delete',
        method : 'post',
        data:data
    });
}




const projectManageApiList = {
    getProjectsByPage,
    addProject,
    updateProject,
    deleteProject
}

export default projectManageApiList