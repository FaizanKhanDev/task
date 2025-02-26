import transporter from "../../config/email/nodemailerConfiguration";



class EmailService {
    public static async sendEmail(options: any) {
        try {
            /* ================ Email Template ================ */
            let info = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: options.to,
                subject: options.subject,
                html: options.template,
            });
            return info;
        } catch (error: any) {
            throw new Error("Sening EMail Error " + error.message);
        }


    }
}

export default EmailService;