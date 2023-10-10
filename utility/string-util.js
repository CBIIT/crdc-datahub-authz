const replaceMessageVariables = (input, messageVariables) => {
    for (let key in messageVariables){
        // message variable must start with $
        input = input.replace(`$${key}`, messageVariables[key]);
    }
    return input;
}

module.exports = {
    replaceMessageVariables
}