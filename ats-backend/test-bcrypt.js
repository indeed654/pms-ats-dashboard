const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Open the SQLite database
const db = new sqlite3.Database('./data/ats.db');

console.log('=== Testing Login Logic Step by Step ===\n');

const testEmail = 'admin@ats.local';
const testPassword = 'Admin@123';

// Step 1: Find user by email
db.get("SELECT * FROM users WHERE email = ? AND is_deleted = 0", [testEmail], async (err, user) => {
    if (err) {
        console.error('❌ SQL Error:', err.message);
        db.close();
        return;
    }
    
    if (!user) {
        console.log('❌ User not found with email:', testEmail);
        db.close();
        return;
    }
    
    console.log('✅ Step 1: User found in database');
    console.log('   Email:', user.email);
    console.log('   Password in DB:', user.password.substring(0, 30) + '...');
    console.log('');
    
    // Step 2: Test bcrypt compare
    console.log('🔐 Step 2: Testing bcrypt.compare()...');
    console.log('   Input password:', testPassword);
    
    try {
        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log('   bcrypt.compare result:', isValid);
        
        if (isValid) {
            console.log('');
            console.log('✅ LOGIN SHOULD SUCCEED!');
        } else {
            console.log('');
            console.log('❌ LOGIN SHOULD FAIL - Password mismatch!');
            console.log('');
            console.log('🔍 Debugging: Checking password hash...');
            
            // Let's hash the test password and compare hashes
            const hashResult = await bcrypt.hash(testPassword, 10);
            console.log('   New hash of "Admin@123":', hashResult.substring(0, 30) + '...');
            console.log('   Stored hash:', user.password.substring(0, 30) + '...');
            console.log('   Are they the same?', hashResult === user.password);
        }
    } catch (e) {
        console.error('❌ bcrypt error:', e.message);
    }
    
    db.close();
});
