// ============================================================
//  Quinta da Aldeia — CSV Export Utility
//  Call exportCSV(rows, filename) from any page
// ============================================================

function exportCSV(rows, filename) {
  if (!rows || !rows.length) { alert('No data to export.'); return; }

  // Get headers from first row keys
  var headers = Object.keys(rows[0]);

  // Build CSV content
  var lines = [];
  lines.push(headers.map(escapeCSV).join(','));
  rows.forEach(function (row) {
    lines.push(headers.map(function (h) { return escapeCSV(row[h]); }).join(','));
  });

  var csv     = '\uFEFF' + lines.join('\r\n'); // BOM for Excel UTF-8
  var blob    = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url     = URL.createObjectURL(blob);
  var link    = document.createElement('a');
  link.href   = url;
  link.download = filename + '_' + new Date().toISOString().split('T')[0] + '.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  var str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
