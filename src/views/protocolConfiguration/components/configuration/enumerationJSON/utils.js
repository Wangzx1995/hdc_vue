export default {
    getMsgId(getMsgId) {
        let setMsgId = null;
        switch (getMsgId) {
            case 6:
                setMsgId = 25;
                break;
            default:
                setMsgId = getMsgId + 1;
                break;
        }
        return setMsgId;
    },
};
