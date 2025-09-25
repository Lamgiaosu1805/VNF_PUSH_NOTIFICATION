const { sendNotification, sendMulticastNotification } = require('../firebasePushService/firebase/pushService');

async function sendEmailWithAttachment(toEmail, content) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let mailOptions = {
        from: '"VNFITE System"<thunderbrucelee@gmail.com>',
        to: toEmail,
        subject: "Thông báo Khách hàng mới",
        text: content,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email đã được gửi đến ${toEmail}`);
}

const NotificationController = {
    pushNotification: async (req, res, next) => {
        const { alias, fcmToken, title, body, data } = req.body;
        console.log("BODY_REQUEST: ")
        console.log(JSON.stringify(req.body, null, 2));

        if (!alias || !fcmToken || !title || !body) {
            console.log(JSON.stringify({
                error: 'Thiếu trường bắt buộc',
                alias,
                fcmToken,
                title,
                body
            }, null, 2));
            return res.status(400).json({ error: 'Thiếu trường bắt buộc' });
        }

        try {
            const result = await sendNotification(alias, fcmToken, title, body, data);
            res.json({ success: true, result });
        } catch (err) {
            res.status(500).json({ error: 'Không gửi được', detail: err.message });
            console.log(JSON.stringify({
                error: err.message,
                alias,
                fcmToken,
                title,
                body
            }, null, 2));
        }
    },
    pushMultiNotification: async (req, res) => {
        const { alias, tokens, title, body, data } = req.body;
        console.log("BODY_REQUEST: ")
        console.log(JSON.stringify(req.body, null, 2))
        // Kiểm tra đầu vào
        if (!alias || !Array.isArray(tokens) || tokens.length === 0 || !title || !body) {
            console.log(JSON.stringify({
                error: 'Vui lòng cung cấp alias, title, body và danh sách tokens (mảng)',
                alias,
                title,
                body
            }, null, 2));
            return res.status(400).json({
                error: 'Vui lòng cung cấp alias, title, body và danh sách tokens (mảng)',
            });
        }

        try {
            const result = await sendMulticastNotification(alias, tokens, title, body, data);
            console.log("RESQUEST_RESPONSE: ")
            console.log(JSON.stringify({
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
                            .map((resp, i) => !resp.success ? {
                                token: tokens[i],
                                error: resp.error?.message || 'Unknown error'
                            } : null)
                            .filter(Boolean)
                        : r.error ? [{ token: tokens[0], error: r.error }] : [],
                })),
            }, null, 2))
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
                            .map((resp, i) => !resp.success ? {
                                token: tokens[i],
                                error: resp.error?.message || 'Unknown error'
                            } : null)
                            .filter(Boolean)
                        : r.error ? [{ token: tokens[0], error: r.error }] : [],
                })),
            });
        } catch (err) {
            res.status(500).json({
                error: 'Không gửi được',
                detail: err.message,
            });
        }
    },
    sendMail: async (req, res) => {
        try {
            await sendEmailWithAttachment(req.body.toEmail, req.body.content)
        } catch (error) {
            res.status(500).json({
                error: 'Không gửi được',
                detail: err.message,
            });
        }
    }

}

module.exports = NotificationController;