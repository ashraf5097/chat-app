const generateMessage = (text,username) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username
    }
}

const generatelocationMessage = (locationMessageUrl,username) => {
    return {
        locationMessageUrl,
        createdAt: new Date().getTime(),
        username
    }
}

module.exports = {
    generateMessage,generatelocationMessage
}
