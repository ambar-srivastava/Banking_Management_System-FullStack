const PDFDocument = require('pdfkit');

function generateStatementPDF(res, account, statementData, startDate, endDate) {
    const doc = new PDFDocument({ margin: 50 });

    // Tell the browser/client this is a downloadable file, not a page to render
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=statement_${account.account_number}.pdf`);

    // Stream the PDF content directly into the HTTP response as it's generated
    doc.pipe(res);

    doc.fontSize(18).text('Account Statement', { align: 'center' });
    doc.moveDown();

    doc.text(`Account Number: ${account.account_number}`);
    doc.text(`Account Type: ${account.account_type}`);
    doc.text(`Statement Period: ${startDate} to ${endDate}`);
    doc.moveDown();

    doc.text(`Opening Balance: Rs. ${statementData.openingBalance.toFixed(2)}`);
    doc.text(`Total Credits: Rs. ${statementData.totalCredits.toFixed(2)}`);
    doc.text(`Total Debits: Rs. ${statementData.totalDebits.toFixed(2)}`);
    doc.text(`Closing Balance: Rs. ${statementData.closingBalance.toFixed(2)}`);
    doc.moveDown();

    // Simple table header
    doc.fontSize(10).font('Helvetica-Bold');
    let y = doc.y;
    doc.text('Date', 50, y, { width: 100 });
    doc.text('Type', 150, y, { width: 100 });
    doc.text('Amount', 250, y, { width: 100 });
    doc.text('Balance After', 350, y, { width: 120 });
    doc.moveDown();
    doc.font('Helvetica');

    statementData.transactions.forEach(tx => {
        y = doc.y;
        doc.text(new Date(tx.created_at).toLocaleDateString(), 50, y, { width: 100 });
        doc.text(tx.type, 150, y, { width: 100 });
        doc.text(`Rs. ${parseFloat(tx.amount).toFixed(2)}`, 250, y, { width: 100 });
        doc.text(`Rs. ${parseFloat(tx.balance_after).toFixed(2)}`, 350, y, { width: 120 });
        doc.moveDown();
    });

    doc.end(); //finalizes the PDF and closes the stream
}

module.exports = generateStatementPDF; 