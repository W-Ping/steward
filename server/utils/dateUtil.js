const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(formatNumber).join("/") + " " + [hour, minute, second].map(formatNumber).join(":");
};

const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : "0" + n;
};

const nowTime = () => {
    return formatTime(new Date());
};
const formatUnixTime = (date, format) => {
    var formateArr = ["Y", "M", "D", "h", "m", "s"];
    var returnArr = [];
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
};

/**
 *
 * @param startDate
 * @param hours
 * @returns {string}
 */
function dateAdd(startStr, hours) {
    if (!hours || !startStr) {
        return null;
    }
    startStr = new Date(startStr);
    startStr = new Date(startStr.getTime() + hours * 60 * 60 * 1000);
    return formatTime(startStr);
}

/**
 *   计算两时间之差
 *
 * @param bigDateStr 格式：yyyy/mm/dd HH:mm:ss
 * @param smallDateStr
 * @param diffType
 * @returns {number}
 */
function dateDiff(bigDateStr, smallDateStr, diffType) {
    bigDateStr = new Date(bigDateStr);
    smallDateStr = new Date(smallDateStr);
    diffType = diffType ? diffType.toLowerCase() : 'minute';
    var timeType = 1;
    var diff = 0;
    switch (diffType) {
        case"second":
            timeType = 1000;
            diff = parseFloat((bigDateStr.getTime() - smallDateStr.getTime()) / parseInt(timeType)).toFixed(2);
            break;
        case"minute":
            timeType = 1000 * 60;
            diff = parseFloat((bigDateStr.getTime() - smallDateStr.getTime()) / parseInt(timeType)).toFixed(2);
            break;
        case"hour":
            timeType = 1000 * 3600;
            diff = parseFloat((bigDateStr.getTime() - smallDateStr.getTime()) / parseInt(timeType)).toFixed(2);
            break;
        case"day":
            timeType = 1000 * 3600 * 24;
            diff = parseInt((bigDateStr.getTime() - smallDateStr.getTime()) / parseInt(timeType));
            break;
        default:
            break;
    }
    return diff;
}

/**
 *
 * @param unit
 * @returns {string|*}
 */
function dateUnit(unit) {
    unit = unit ? unit : "minute";
    switch (unit) {
        case"second":
            unit = "秒";
            break;
        case"minute":
            unit = "分钟";
            break;
        case"hour":
            unit = "小时";
            break;
        case"day":
            unit = "天";
            break;
        default:
            break;
    }
    return unit;
}

module.exports = {formatTime, formatUnixTime, nowTime, dateAdd, dateDiff, dateUnit};