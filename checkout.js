// After successful payment
async function handleSuccessfulPayment(orderData) {
    try {
        // Generate invoice
        const invoiceGenerator = new InvoiceGenerator();
        const pdfDoc = await invoiceGenerator.generatePDF(orderData);

        // Save to server (implement your API endpoint)
        const formData = new FormData();
        formData.append('invoice', pdfDoc);
        formData.append('orderId', orderData.orderId);

        await fetch('/api/save-invoice', {
            method: 'POST',
            body: formData
        });

        // Send confirmation email with invoice
        await fetch('/api/send-confirmation-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderData.orderId,
                customerEmail: orderData.customer.email
            })
        });

        // Show success message
        showNotification('Order confirmed! Check your email for the invoice.');

    } catch (error) {
        console.error('Error processing order:', error);
        showNotification('Order confirmed, but there was an error generating the invoice.', 'error');
    }
} 