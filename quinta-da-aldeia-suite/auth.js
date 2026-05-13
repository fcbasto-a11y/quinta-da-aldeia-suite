// ============================================================
//  Quinta da Aldeia — PIN Authentication
//  Include this on every page: <script src="auth.js"></script>
//  Call initAuth() at the start of each page
// ============================================================

// ---- PIN CONFIGURATION ----
// Change these values to your actual PINs before deploying
var AUTH_PINS = {
  owner: '1234',   // Full access including Finance
  staff: '5678',   // All pages except Finance
};
// ---------------------------

var AUTH_KEY     = 'qa_auth_role';
var AUTH_PAGE    = 'login.html';
var FINANCE_PAGE = 'finance.html';

// Called on every page load — redirects to login if not authenticated
function initAuth() {
  var role = sessionStorage.getItem(AUTH_KEY);
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Always allow login page and public pages
  var publicPages = ['login.html', 'quote.html', 'wedding-form.html'];
  if (publicPages.indexOf(currentPage) !== -1) return;

  // Not logged in — redirect to login
  if (!role) {
    sessionStorage.setItem('qa_redirect', currentPage);
    window.location.href = AUTH_PAGE;
    return;
  }

  // Staff trying to access Finance — redirect to calendar
  if (role === 'staff' && currentPage === FINANCE_PAGE) {
    window.location.href = 'index.html';
    return;
  }

  // Hide Finance nav link for staff
  if (role === 'staff') {
    document.addEventListener('DOMContentLoaded', function () {
      var links = document.querySelectorAll('a[href="finance.html"], .bot-link[href="finance.html"]');
      links.forEach(function (l) { l.style.display = 'none'; });
    });
  }

  // Show role indicator in nav
  document.addEventListener('DOMContentLoaded', function () {
    var indicator = document.getElementById('role-indicator');
    if (indicator) {
      indicator.textContent = role === 'owner' ? 'Proprietário' : 'Staff';
      indicator.style.display = 'inline-block';
    }
  });
}

function getRole() {
  return sessionStorage.getItem(AUTH_KEY);
}

function isOwner() {
  return getRole() === 'owner';
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.href = AUTH_PAGE;
}

// Hide delete buttons for staff
function applyRolePermissions() {
  if (isOwner()) return;
  // Hide all delete buttons for staff
  document.querySelectorAll('.btn-danger, [data-owner-only]').forEach(function (el) {
    el.style.display = 'none';
  });
}

// Run immediately
initAuth();
