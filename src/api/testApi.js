import fetch from "@/utils/fetch";

const getFormData1 = function (data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                name1: "1",
                name3: "3",
                name5: "5",
                name7: "7",
            });
        }, 500);
    });
};
const getFormData2 = function (data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                sex2: "12",
                xxx2: "14",
                xxx4: "16",
                xxx5: "17",
                speed1: "18",
                speed2: "19",
                speed3: "20",
                speed4: "21",
                speed5: "22",
            });
        }, 500);
    });
};
const projectManageApiList = {
    getFormData1,
    getFormData2,
};

export default projectManageApiList;
