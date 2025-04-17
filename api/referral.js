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
                first_name, last_name, gender, dob, age, insurance_number, nationality, ethnicity,
                religion, address, primary_phone, secondary_phone, email, smoke, alcohol, drugs, criminal_record
            } = fields;

            // Validate required fields
            if (!email || !first_name || !last_name || !dob || !age || !primary_phone) {
                res.status(400).json({ error: 'First Name, Last Name, DOB, Age, Primary Phone, and Email are required.' });
                return;
            }

            // Create the email content
            const emailContent = `
                <h1>New Referral Submission</h1>
                <p><strong>First Name:</strong> ${first_name}</p>
                <p><strong>Last Name:</strong> ${last_name}</p>
                <p><strong>Gender:</strong> ${gender}</p>
                <p><strong>Date of Birth:</strong> ${dob}</p>
                <p><strong>Age:</strong> ${age}</p>
                <p><strong>National Insurance Number:</strong> ${insurance_number}</p>
                <p><strong>Nationality:</strong> ${nationality}</p>
                <p><strong>Ethnicity:</strong> ${ethnicity}</p>
                <p><strong>Religion:</strong> ${religion}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Primary Phone:</strong> ${primary_phone}</p>
                <p><strong>Secondary Phone:</strong> ${secondary_phone}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Smokes?:</strong> ${smoke}</p>
                <p><strong>Drinks Alcohol?:</strong> ${alcohol}</p>
                <p><strong>Takes Drugs?:</strong> ${drugs}</p>
                <p><strong>Criminal Record?:</strong> ${criminal_record}</p>
            `;

            // Set up nodemailer transport
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'thecarefuge@gmail.com', // Use your email
                    pass: 'cgdn zcpo vyqb jtue'   // Use your email password or app password
                }
            });

            // Send the email
            const mailOptions = {
                from: email,
                to: 'info@mlthematics.com', // Recipient email
                subject: 'New Referral Submission',
                html: emailContent
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Failed to send email' });
                    return;
                }

                res.status(200).json({ success: true, message: 'Referral form submitted successfully!' });
            });
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
