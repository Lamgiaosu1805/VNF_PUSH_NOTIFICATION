const notificationRouter = require('./pushNotification')

const route = (app) => {
    app.use(`/notification`, notificationRouter)
}

module.exports = route;