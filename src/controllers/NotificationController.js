const { sendNotification, sendMulticastNotification } = require('../firebasePushService/firebase/pushService');
const NotificationController = {
    pushNotification: async (req, res, next) => {
        const { alias, fcmToken, title, body, data } = req.body;
        console.log("BODY_REQUEST: ", req.body)

        if (!alias || !fcmToken || !title || !body) {
            return res.status(400).json({ error: 'Thiếu trường bắt buộc' });
        }

        try {
            const result = await sendNotification(alias, fcmToken, title, body, data);
            res.json({ success: true, result });
        } catch (err) {
            res.status(500).json({ error: 'Không gửi được', detail: err.message });
        }
    },
    pushMultiNotification: async (req, res) => {
        const { alias, tokens, title, body, data } = req.body;
        console.log("BODY_REQUEST: ", req.body)
        // Kiểm tra đầu vào
        if (!alias || !Array.isArray(tokens) || tokens.length === 0 || !title || !body) {
            return res.status(400).json({
            error: 'Vui lòng cung cấp alias, title, body và danh sách tokens (mảng)',
            });
        }
    
        try {
            const result = await sendMulticastNotification(alias, tokens, title, body, data);
            console.log({
                totalTokens: tokens.length,
                totalBatches: result.totalBatches,
                totalSuccess: result.totalSuccess,
                totalFailure: result.totalFailure,
                results: result.results.map((r, idx) => ({
                    batch: idx + 1,
                    success: r.successCount,
                    failure: r.failureCount,
                    errors: r.responses
                    ? r.responses
                        .filter(r => !r.success)
                        .map(r => r.error.message)
                    : r.error ? [r.error] : [],
                })),
            })
            res.json({
                success: true,
                totalTokens: tokens.length,
                totalBatches: result.totalBatches,
                totalSuccess: result.totalSuccess,
                totalFailure: result.totalFailure,
                results: result.results.map((r, idx) => ({
                    batch: idx + 1,
                    success: r.successCount,
                    failure: r.failureCount,
                    errors: r.responses
                    ? r.responses
                        .filter(r => !r.success)
                        .map(r => r.error.message)
                    : r.error ? [r.error] : [],
                })),
            });
        } catch (err) {
            res.status(500).json({
                error: 'Không gửi được',
                detail: err.message,
            });
        }
    }
    
}

module.exports = NotificationController;