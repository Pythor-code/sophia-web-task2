# North Star Bakery

Four-page client website for Sophia Introduction to Web Development.
Task 2 supplies semantic HTML and media; Touchstone 3 adds responsive CSS;
Touchstone 4 adds JavaScript favorites, localStorage, and form validation.

## Preview
https://pythor-code.github.io/sophia-web-task2/

## Run in Codespaces
Open this repository in GitHub Codespaces, run `python3 -m http.server 8000`,
and open forwarded port 8000. No package installation or build is needed.

## Touchstone 4 files
- products.html: save, remove, and clear bakery favorites.
- contact.html: restored favorites and nearby form error messages.
- bakery.js: product records, selected IDs, storage functions, and validation rules.
- styles.css: existing mobile-first design plus interaction and error styles.
- index.html and about.html: existing content, relative navigation, and media.
- media/: the provided bakery images and welcome audio.

Favorites store only product IDs under northStarBakery.favorites.v1 in localStorage.
They reload on products/contact pages and can be cleared. Names, email addresses,
request text, and allergy information are never stored. Blocked or malformed
storage does not crash the site; a visible message explains the limitation.

The form checks required fields, email format, and text lengths. Invalid entries
remain in place so they can be corrected. Valid entries display confirmation
that the checks passed; this classroom form does not send inquiries or orders.
All business addresses, staff, hours, and prices are fictional classroom content.

## Checks performed
Favorites save/remove/clear, reload restoration, cross-page restoration,
empty/invalid/valid form input, preserved input, console error check, relative
navigation and images. Four pages checked at 320, 390, 768, and 1440px widths.
