import Storage from "@/utils/storage";

const tree = {
    state: {
        time: Storage.get("time"),
        searchForm: Storage.get("searchForm"),
        devicFaultId: Storage.get("devicFaultId"),
        deviceManageId: Storage.get("deviceManageId"),
        deviceUpgradeId: Storage.get("deviceUpgradeId"),
        deviceConfigurationId: Storage.get("deviceConfigurationId"),
        faultTypes: Storage.get("faultTypes"),
        index: Storage.get("index"),
        date: Storage.get("date"),
        month: Storage.get("month"),
        antIrotationId: Storage.get("antIrotationId"),
        tabName: Storage.get("tabName"),
        showSearchForm: Storage.get("showSearchForm"),
        showDeviceManageId: Storage.get("showDeviceManageId"),
        defaultOrganizeId: Storage.get("defaultOrganizeId"),
        defaultMaintenanceCar: Storage.get("defaultMaintenanceCar"),
    },

    mutations: {
        SET_TIME: (state, time) => {
            state.time = time;
            Storage.set("time", time);
        },
        REMOVE_TIME: (state) => {
            state.time = null;
            Storage.remove("time");
        },
        SET_CONDITION: (state, searchForm) => {
        state.searchForm = searchForm;
            Storage.set("searchForm", searchForm);
        },
        SET_TABNAME: (state, tabName) => {
            state.tabName = tabName;
            Storage.set("tabName", tabName);
        },
        REMOVE_TABNAME: (state) => {
            state.tabName = null;
            Storage.remove("tabName");
        },
        SET_SHOWSEARCHFORM: (state, showSearchForm) => {
            state.showSearchForm = showSearchForm;
            Storage.set("showSearchForm", showSearchForm);
        },
        REMOVE_SHOWSEARCHFORM: (state) => {
            state.showSearchForm = null;
            Storage.remove("showSearchForm");
        },
        SET_SHOWDEVICEMANAGEID: (state, showDeviceManageId) => {
            state.showDeviceManageId = showDeviceManageId;
            Storage.set("showDeviceManageId", showDeviceManageId);
        },
        REMOVE_SHOWDEVICEMANAGEID: (state) => {
            state.showDeviceManageId = null;
            Storage.remove("showDeviceManageId");
        },
        REMOVE_CONDITION: (state) => {
            state.searchForm = null;
            Storage.remove("searchForm");
        },
        SET_DEVICEFAULTID: (state, devicFaultId) => {
            state.devicFaultId = devicFaultId;
            Storage.set("devicFaultId", devicFaultId);
        },
        REMOVE_DEVICEFAULTID: (state) => {
            state.devicFaultId = null;
            Storage.remove("devicFaultId");
        },
        SET_DEVICEMANAGEID: (state, deviceManageId) => {
            state.deviceManageId = deviceManageId;
            Storage.set("deviceManageId", deviceManageId);
        },
        REMOVE_DEVICEMANAGEID: (state) => {
            state.deviceManageId = null;
            Storage.remove("deviceManageId");
        },
        SET_DEVICEUPGRADEID: (state, deviceUpgradeId) => {
            state.deviceUpgradeId = deviceUpgradeId;
            Storage.set("deviceUpgradeId", deviceUpgradeId);
        },
        REMOVE_DEVICEUPGRADEID: (state) => {
            state.deviceUpgradeId = null;
            Storage.remove("deviceUpgradeId");
        },
        SET_DEVICECONFIGURATIONID: (state, deviceConfigurationId) => {
            state.deviceConfigurationId = deviceConfigurationId;
            Storage.set("deviceConfigurationId", deviceConfigurationId);
        },
        REMOVE_DEVICECONFIGURATIONID: (state) => {
            state.deviceConfigurationId = null;
            Storage.remove("deviceConfigurationId");
        },
        SET_CURRENTTYPE: (state, faultTypes) => {
            state.faultTypes = faultTypes;
            Storage.set("faultTypes", faultTypes);
        },
        REMOVE_CURRENTTYPE: (state) => {
            state.faultTypes = null;
            Storage.remove("faultTypes");
        },
        SET_CURRENTINDEX: (state, index) => {
            state.index = index;
            Storage.set("index", index);
        },
        REMOVE_CURRENTINDEX: (state) => {
            state.index = null;
            Storage.remove("index");
        },
        SET_DATE: (state, date) => {
            state.date = date;
            Storage.set("date", date);
        },
        REMOVE_DATE: (state) => {
            state.date = null;
            Storage.remove("date");
        },
        SET_MONTH: (state, month) => {
            state.month = month;
            Storage.set("month", month);
        },
        REMOVE_MONTH: (state) => {
            state.month = null;
            Storage.remove("month");
        },
        SET_ANTIROTATION: (state, antIrotationId) => {
            state.antIrotationId = antIrotationId;
            Storage.set("antIrotationId", antIrotationId);
        },
        REMOVE_ANTIROTATION: (state) => {
            state.antIrotationId = null;
            Storage.remove("antIrotationId");
        },
        SET_DEFAULTORGANIZEID: (state, defaultOrganizeId) => {
            state.defaultOrganizeId = defaultOrganizeId;
            Storage.set("defaultOrganizeId", defaultOrganizeId);
        },
        REMOVE_DEFAULTORGANIZEID: (state) => {
            state.defaultOrganizeId = null;
            Storage.remove("defaultOrganizeId");
        },
        SET_DEFAULTMAINTENANCECAR: (state, defaultMaintenanceCar) => {
            state.defaultMaintenanceCar = JSON.stringify(defaultMaintenanceCar);
            Storage.set("defaultMaintenanceCar", JSON.stringify(defaultMaintenanceCar));
        },
        REMOVE_DEFAULTMAINTENANCECAR: (state) => {
            state.defaultMaintenanceCar = null;
            Storage.remove("defaultMaintenanceCar");
        },
    },
    actions: {
        SetTime({ commit }, time) {
            commit("SET_TIME", time);
        },
        RemoveTime({ commit }) {
            commit("REMOVE_TIME");
        },
        SetCondtion({ commit }, searchForm) {
            commit("SET_CONDITION", JSON.parse(JSON.stringify(searchForm)));
        },
        RemoveCondition({ commit }) {
            commit("REMOVE_CONDITION");
        },
        SetTabName({ commit }, tabName) {
            commit("SET_TABNAME", tabName);
        },
        RemoveTabName({ commit }) {
            commit("REMOVE_TABNAME");
        },
        SetShowSearchForm({ commit }, showSearchForm) {
            commit("SET_SHOWSEARCHFORM", showSearchForm);
        },
        RemoveShowSearchForm({ commit }) {
            commit("REMOVE_SHOWSEARCHFORM");
        },
        SetShowDeviceManageId({ commit }, showDeviceManageId) {
            commit("SET_SHOWDEVICEMANAGEID", showDeviceManageId);
        },
        RemoveShowDeviceManageId({ commit }) {
            commit("REMOVE_SHOWDEVICEMANAGEID");
        },
        SetDeviceFaultId({ commit }, id) {
            commit("SET_DEVICEFAULTID", id);
        },
        RemoveDeviceFaultId({ commit }) {
            commit("REMOVE_DEVICEFAULTID");
        },
        SetDeviceManageId({ commit }, id) {
            commit("SET_DEVICEMANAGEID", id);
        },
        RemoveDeviceManageId({ commit }) {
            commit("REMOVE_DEVICEMANAGEID");
        },
        SetDeviceUpgradeId({ commit }, id) {
            commit("SET_DEVICEUPGRADEID", id);
        },
        RemoveDeviceUpgradeId({ commit }) {
            commit("REMOVE_DEVICEUPGRADEID");
        },
        SetDeviceConfigurationId({ commit }, id) {
            commit("SET_DEVICECONFIGURATIONID", id);
        },
        RemoveDeviceConfigurationId({ commit }) {
            commit("REMOVE_DEVICECONFIGURATIONID");
        },
        SetCurrentType({ commit }, faultTypes) {
            commit("SET_CURRENTTYPE", faultTypes);
        },
        RemoveCurrentType({ commit }) {
            commit("REMOVE_CURRENTTYPE");
        },
        SetCurrentIndex({ commit }, index) {
            commit("SET_CURRENTINDEX", index);
        },
        RemoveCurrentIndex({ commit }) {
            commit("REMOVE_CURRENTINDEX");
        },
        SetDate({ commit }, date) {
            commit("SET_DATE", date);
        },
        RemoveDate({ commit }) {
            commit("REMOVE_DATE");
        },
        SetMonth({ commit }, month) {
            commit("SET_MONTH", month);
        },
        RemoveMonth({ commit }) {
            commit("REMOVE_MONTH");
        },
        SetAntIrotationId({ commit }, antIrotationId) {
            commit("SET_ANTIROTATION", antIrotationId);
        },
        RemoveAntIrotationId({ commit }) {
            commit("REMOVE_ANTIROTATION");
        },
        SetDefaultOrganizeId({ commit }, defaultOrganizeId) {
            commit("SET_DEFAULTORGANIZEID", defaultOrganizeId);
        },
        RemoveDefaultOrganizeId({ commit }) {
            commit("REMOVE_DEFAULTORGANIZEID");
        },
        SetDefaultMaintenanceCar({ commit }, defaultMaintenanceCar) {
            commit("SET_DEFAULTMAINTENANCECAR", defaultMaintenanceCar);
        },
        RemoveDefaultMaintenanceCar({ commit }) {
            commit("REMOVE_DEFAULTMAINTENANCECAR");
        },
    },
};

export default tree;
