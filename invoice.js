// Invoice generation utility
class InvoiceGenerator {
    constructor() {
        this.html2pdf = window.html2pdf;
        this.invoiceTemplate = `
            <div class="invoice-container" id="invoice">
                <div class="invoice-header">
                    <div class="logo">
                        <img src="logo.png" alt="Bookore Logo">
                    </div>
                    <div class="invoice-title">
                        <h1>INVOICE</h1>
                        <div class="invoice-number">#{{orderId}}</div>
                        <div class="invoice-date">{{date}}</div>
                    </div>
                </div>

                <div class="invoice-details">
                    <div class="billed-to">
                        <h3>Billed To</h3>
                        <div class="customer-details">
                            <div>{{customerName}}</div>
                            <div>{{customerEmail}}</div>
                            <div>{{customerAddress}}</div>
                        </div>
                    </div>
                    <div class="payment-info">
                        <h3>Payment Details</h3>
                        <div>Method: {{paymentMethod}}</div>
                        <div>Status: Paid</div>
                        <div>Date: {{date}}</div>
                    </div>
                </div>

                <div class="invoice-items">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{itemRows}}
                        </tbody>
                    </table>
                </div>

                <div class="invoice-summary">
                    <div class="summary-item">
                        <span>Subtotal</span>
                        <span>₹{{subtotal}}</span>
                    </div>
                    <div class="summary-item">
                        <span>Shipping</span>
                        <span>₹{{shipping}}</span>
                    </div>
                    <div class="summary-item total">
                        <span>Total</span>
                        <span>₹{{total}}</span>
                    </div>
                </div>

                <div class="invoice-footer">
                    <p>Thank you for shopping with Bookore!</p>
                    <small>This is a computer-generated invoice and does not require a signature.</small>
                </div>
            </div>
        `;
    }

    async generatePDF(orderData) {
        // Create invoice HTML
        const invoiceHTML = `
            <div class="invoice" style="padding: 40px; max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb; margin: 0;">INVOICE</h1>
                    <p style="color: #64748b; margin: 10px 0;">Order #${orderData.orderId}</p>
                </div>

                <div style="margin-bottom: 30px;">
                    <div style="float: left;">
                        <h3 style="color: #1f2937; margin: 0;">Billed To:</h3>
                        <p style="color: #64748b; margin: 5px 0;">${orderData.customer.name}</p>
                        <p style="color: #64748b; margin: 5px 0;">${orderData.customer.email}</p>
                        <p style="color: #64748b; margin: 5px 0;">${orderData.customer.address}</p>
                    </div>
                    <div style="float: right; text-align: right;">
                        <h3 style="color: #1f2937; margin: 0;">Invoice Details:</h3>
                        <p style="color: #64748b; margin: 5px 0;">Date: ${new Date(orderData.orderDate).toLocaleDateString()}</p>
                        <p style="color: #64748b; margin: 5px 0;">Payment Method: ${orderData.payment.method}</p>
                    </div>
                    <div style="clear: both;"></div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                    <thead>
                        <tr style="background: #f8fafc;">
                            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Quantity</th>
                            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
                            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderData.items.map(item => `
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.title}</td>
                                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">₹${item.price.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">₹${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Subtotal:</td>
                            <td style="padding: 12px; text-align: right;">₹${orderData.payment.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Shipping:</td>
                            <td style="padding: 12px; text-align: right;">
                                ${orderData.payment.shipping === 0 ? 'FREE' : `₹${orderData.payment.shipping.toFixed(2)}`}
                            </td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #e5e7eb;">Total:</td>
                            <td style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #e5e7eb;">₹${orderData.payment.total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="margin-top: 40px; text-align: center; color: #64748b;">
                    <p style="margin: 5px 0;">Thank you for shopping with us!</p>
                    <p style="margin: 5px 0;">For any queries, please contact support@bookore.com</p>
                </div>
            </div>
        `;

        // PDF options
        const opt = {
            margin: 1,
            filename: `invoice-${orderData.orderId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
        };

        try {
            // Create a temporary container for the invoice
            const container = document.createElement('div');
            container.innerHTML = invoiceHTML;
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            // Generate PDF
            await html2pdf().set(opt).from(container).save();

            // Cleanup
            document.body.removeChild(container);
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw new Error('Failed to generate invoice PDF');
        }
    }

    generateInvoiceHTML(orderData) {
        let html = this.invoiceTemplate;

        // Generate item rows
        const itemRows = orderData.items.map(item => `
            <tr>
                <td>${item.title}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        // Replace placeholders
        html = html.replace('{{orderId}}', orderData.orderId)
            .replace('{{date}}', new Date().toLocaleDateString())
            .replace('{{customerName}}', orderData.customer.name)
            .replace('{{customerEmail}}', orderData.customer.email)
            .replace('{{customerAddress}}', orderData.customer.address)
            .replace('{{paymentMethod}}', orderData.paymentMethod)
            .replace('{{itemRows}}', itemRows)
            .replace('{{subtotal}}', orderData.subtotal.toFixed(2))
            .replace('{{shipping}}', orderData.shipping.toFixed(2))
            .replace('{{total}}', orderData.total.toFixed(2));

        return html;
    }
} 