const getters = {
    setting: (state) => state.app.setting,
    token: (state) => state.user.token,
    avatar: (state) => state.user.avatar,
    username: (state) => state.user.name,
    nickname: (state) => state.user.nickname,
    loggedin: (state) => state.user.loggedin,
    permission_routers: (state) => state.permission.routers,
    current_page: (state) => state.app.router.currentPage,
    addRouters: (state) => state.permission.addRouters,
    buttonPermissions: (state) => state.permission.buttonPermissions,
    authorityCenter: (state) => state.user.authorityCenter,
};
export default getters;
