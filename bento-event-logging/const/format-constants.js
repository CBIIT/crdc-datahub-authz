const {ADMIN, MEMBER, NON_MEMBER, NONE, INACTIVE, ACTIVE, DISABLED, DELETED} = require("./user-constant");
const {PENDING, APPROVED, REJECTED, REVOKED} = require("./access-constant");
const {GOOGLE, NIH, LOGIN_GOV, TEST} = require("./idp-constant");
const user_roles =[ADMIN, MEMBER, NON_MEMBER];
const user_statuses = [NONE, INACTIVE, ACTIVE, DISABLED, DELETED]; //null also accepted
const access_statuses = [PENDING, APPROVED, REJECTED, REVOKED];
const valid_idps = [GOOGLE, NIH, LOGIN_GOV];
if (process.env.NODE_ENV === 'development'){
    valid_idps.push(TEST);
}
exports.valid_idps = valid_idps
const formatMap = initFormatMap([valid_idps, user_roles, user_statuses, access_statuses]);

const formatVariables = function(variables, lowerCaseParamsList, formatMap){
    for (let key in variables) {
        if (!lowerCaseParamsList.includes(key)) {
            continue;
        }
        else if (Array.isArray(variables[key]) && variables[key].every(x => typeof x === "string")) {
            variables[key] = variables[key].map(x => formatSingleVariable(x, formatMap));
        }
        else if (typeof variables[key] === "string") {
            variables[key] = formatSingleVariable(variables[key], formatMap);
        }
    }
    return variables ? variables : {};
}

function initFormatMap(valuesLists){
    const formatMap = {}
    valuesLists.forEach(x => addToMap(formatMap, x));
    return formatMap
}

function addToMap(formatMap, values){
    values.forEach(x => formatMap[x.toLowerCase()] = x);
}

function formatSingleVariable(variable, formatMap) {
    let key = variable.toLowerCase();
    if (formatMap[key]){
        return formatMap[key];
    }
    return variable;
}

module.exports = {
    formatVariables,
    formatMap,
    valid_idps,
    user_roles,
    user_statuses,
    access_statuses
}
