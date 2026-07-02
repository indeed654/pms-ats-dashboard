const sqlite3 = require('sqlite3').verbose();

// Open the SQLite database
const db = new sqlite3.Database('./data/ats.db');

console.log('=== Checking SQLite Database ===\n');

// Get table schema
db.all("PRAGMA table_info(users)", [], (err, columns) => {
    if (err) {
        console.error('Error getting schema:', err);
        db.close();
        return;
    }
    
    console.log('Users table schema:');
    columns.forEach(col => {
        console.log(`  - ${col.name}: ${col.type} (nullable: ${!col.notnull})`);
    });
    console.log('');
    
    // Get all users
    db.all("SELECT id, name, email, role, is_deleted, password FROM users", [], (err, users) => {
        if (err) {
            console.error('Error getting users:', err);
            db.close();
            return;
        }
        
        console.log('Users in database:', users.length);
        if (users.length === 0) {
            console.log('❌ No users found in database!');
        } else {
            users.forEach(user => {
                console.log(`  - ID: ${user.id}`);
                console.log(`    Name: ${user.name}`);
                console.log(`    Email: ${user.email}`);
                console.log(`    Role: ${user.role}`);
                console.log(`    is_deleted: ${user.is_deleted}`);
                console.log(`    Password hash: ${user.password ? user.password.substring(0, 20) + '...' : 'NULL'}`);
                console.log('');
            });
        }
        
        db.close();
    });
});
