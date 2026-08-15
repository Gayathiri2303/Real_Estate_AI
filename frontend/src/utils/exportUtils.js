import toast from 'react-hot-toast';

/**
 * Export data as CSV file
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    toast.error('No data to export');
    return;
  }

  try {
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV rows
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header] ?? '';
        // Handle strings with commas
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    
    // Create and download file
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`✅ CSV exported successfully! (${data.length} records)`);
  } catch (error) {
    toast.error('Failed to export CSV');
    console.error('Export error:', error);
  }
};

/**
 * Export data as JSON file
 */
export const exportToJSON = (data, filename) => {
  if (!data || data.length === 0) {
    toast.error('No data to export');
    return;
  }

  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`✅ JSON exported successfully! (${data.length} records)`);
  } catch (error) {
    toast.error('Failed to export JSON');
    console.error('Export error:', error);
  }
};

/**
 * Print a report
 */
export const printReport = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    toast.error('Element not found');
    return;
  }

  try {
    const win = window.open('', '_blank', 'width=1200,height=800');
    if (!win) {
      toast.error('Please allow popups for this site');
      return;
    }
    
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Real Estate Report</title>
          <style>
            body { 
              font-family: Arial, Helvetica, sans-serif; 
              padding: 40px;
              max-width: 1200px;
              margin: 0 auto;
            }
            h1 { 
              color: #1976d2; 
              border-bottom: 3px solid #1976d2;
              padding-bottom: 10px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin: 20px 0;
            }
            .stat-card {
              background: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
            }
            .stat-value {
              font-size: 28px;
              font-weight: bold;
              color: #1976d2;
            }
            .stat-label {
              font-size: 14px;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background: #1976d2;
              color: white;
              padding: 12px;
              text-align: left;
            }
            td {
              padding: 10px;
              border-bottom: 1px solid #ddd;
            }
            tr:hover {
              background: #f5f5f5;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
          <div class="footer">
            Generated on ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `);
    
    win.document.close();
    setTimeout(() => {
      win.print();
    }, 500);
    
    toast.success('🖨️ Printing report...');
  } catch (error) {
    toast.error('Failed to print');
    console.error('Print error:', error);
  }
};

/**
 * Format currency
 */
export const formatCurrency = (value) => {
  if (!value) return '$0';
  return '$' + parseFloat(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};