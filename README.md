# Fund-Management-Web-Application

The Fund Management Web Application is a secure, user-friendly platform built with PHP and MySQL, designed to manage personal or shared funds efficiently. Unlike traditional systems with a fixed user limit, this app allows unlimited members to sign up, log in securely, and manage their donations and withdrawals while viewing transaction histories.

The app supports full CRUD operations on transactions and dynamically displays the total fund balance. Users can edit or delete their transactions anytime. A Split Expense feature lets users divide withdrawal amounts among selected members easily. The app also includes a real-time chat system for member communication and allows exporting transaction history to CSV files for backup or analysis.

The frontend uses HTML, CSS, and JavaScript for a clean, responsive design, while the backend is powered by PHP (procedural style) with PDO and MySQLi for stable database operations.

To run the project locally, clone the repository, set up a server environment like XAMPP/WAMP, create a database named finance_management in phpMyAdmin, and configure the connection settings in db_connect.php. After setup, place the project in the server directory and access it via http://localhost/your-folder-name/.(example: http://localhost/finance-app/

The codebase is neatly organized into folders for CSS, JS, and PHP. Key PHP files include signup.php, login.php, add_transaction.php, edit_transaction.php, delete_transaction.php, and fetch_transactions.php. Users interact mainly through index.php (login/sign-up) and dashboard.php (fund management).
