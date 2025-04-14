const nodemailer = require('nodemailer');
const formidable = require('formidable');

module.exports = (req, res) => {
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).json({ error: 'Something went wrong while processing the form.' });
                return;
            }

            // Extract values from the form fields
            const { 
                name, number, email, message
            } = fields;

            // Validate required fields (excluding estimatedCollection)
            if (!name || !email || !number || !message) {
                res.status(400).json({ error: 'All fields except Estimated Collection are required.' });
                return;
            }

            // Create the email content
            const emailContent = `
                <h1>New Appointment Request</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${number}</p>
                <p><strong>Message:</strong> ${message}</p>
            `;

            // Set up nodemailer transport
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'medifybill@gmail.com', // Use your email
                    pass: 'wevn ctmd sndn spoe'   // Use your email password or app password
                }
            });

            // Send the email
            const mailOptions = {
                from: email,
                to: 'info@mlthematics.com', // Recipient email
                subject: 'New Appointment Request',
                html: emailContent
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Failed to send email' });
                    return;
                }

                // Redirect the user to the confirmation page after successful email sending
                res.status(200).json({ success: true, message: 'Contact us submitted successfully!' });
            });
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};