module.exports = file => {
    try {
        if (!file) return;
        return require('@/views/' + file + '.vue')
    }
    catch (err) {
        return require('@/views/layout/noPage.vue')
    }
    
}