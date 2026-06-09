/**
 * Created by chenhu5 on 2017/12/15.
 */
import fetch from '@/utils/fetch';

const getPage=(params)=>{
    return fetch({
        url : 'updateConfrim/page',
        method : 'post',
        data : params
    });
}

const updateUpdateConfirm=(params)=>{
    return fetch({
        url : 'updateConfrim/updateUpdateConfirm',
        method : 'post',
        data : params
    });
}



const firmwareApiList = {
    /*  area start  */
    getPage,
    updateUpdateConfirm
    /*  area end    */

}

export default firmwareApiList