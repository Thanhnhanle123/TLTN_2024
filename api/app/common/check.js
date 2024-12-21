/**
 * Kiểm tra kiểu dữ liệu của giá trị được truyền vào
 * @param   {any} value - Giá trị cần kiểm tra
 * @returns {string}    - Thông báo về kiểu dữ liệu
 */
const checkType = (value) => {
    const type = typeof value;
    
    switch (type) {
        case 'string':
            return 'string';
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'object':
            if (value === null) {
                return 'object';
            }
            if (Array.isArray(value)) {
                return 'array';
            }
            return 'object';
        case 'undefined':
            return 'undefined';
        case 'function':
            return 'function';
        case 'symbol':
            return 'symbol';
        case 'bigint':
            return 'bigint';
        default:
            return 'notType';
    }
};

module.exports = {
    checkType
};
