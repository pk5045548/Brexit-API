const express = require('express');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;

// EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'views')));

// SQLite database setup
const dbPath = path.resolve(__dirname, 'backend', 'house_inflation1.db');

// Function to run database.sql file
function runDatabaseSQL() {
    // Connect to the database
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('Database connection error:', err.message);
            return;
        }
        console.log('Connected to the house_inflation database.');

        // Read and execute database.sql file
        const sqlFilePath = path.resolve(__dirname, 'backend', 'database.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        db.exec(sql, function(err) {
            if (err) {
                console.error('Error running database.sql:', err.message);
                return;
            }
            console.log('database.sql executed successfully.');

            // Close the database connection
            db.close((err) => {
                if (err) {
                    console.error('Database close error:', err.message);
                } else {
                    console.log('Database connection closed.');
                }
            });
        });
    });
}

app.use(bodyParser.json());

// Route to render the home page
app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Property Prices' });
});

app.get('/data', (req, res) => {
    const selectedValue1 = req.query.selectedValue1 || 'AveragePrice';
    const selectedValue2 = req.query.selectedValue2 || 'London';

    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('Database connection error:', err.message);
            res.status(500).json({ error: 'Database connection error' });
            return;
        }

        // Execute the query to fetch the selected data for the selected region
        const query = `SELECT Date1, ${selectedValue1} FROM HPI WHERE RegionName = ?`;
        db.all(query, [selectedValue2], (err, rows) => {
            if (err) {
                console.error('Query error:', err.message);
                res.status(500).json({ error: 'Query error' });
                return;
            }

            const aggregatedData = aggregateDataByYear(rows, selectedValue1);

            res.json(aggregatedData);

            db.close((err) => {
                if (err) {
                    console.error('Database close error:', err.message);
                }
            });
        });
    });
});

// Function to aggregate data by year
function aggregateDataByYear(rows, selectedValue1) {
    const aggregatedData = [];
    let currentYear = null;
    let sumPrices = 0;
    let countEntries = 0;

    rows.forEach(row => {
        const year = row.Date1.split('/')[2];
        const price = parseFloat(row[selectedValue1]); // Access dynamically selected value

        if (currentYear === null) {
            currentYear = year;
        }

        if (year !== currentYear) {
            // Push aggregated data for previous year
            if (countEntries > 0) {
                aggregatedData.push({
                    Date1: currentYear,
                    [selectedValue1]: sumPrices / countEntries // Use selectedValue1 dynamically
                });
            }

            // Reset counters for next year
            currentYear = year;
            sumPrices = 0;
            countEntries = 0;
        }

        // Accumulate values for current year
        sumPrices += price;
        countEntries++;
    });

    // Push last aggregated data
    if (countEntries > 0) {
        aggregatedData.push({
            Date1: currentYear,
            [selectedValue1]: sumPrices / countEntries // Use selectedValue1 dynamically
        });
    }

    return aggregatedData;
}

app.get('/migrationData', (req, res) => {
    const selectedValue3 = req.query.selectedValue3 || 'Immigration';
    const selectedValue4 = req.query.selectedValue4 || 'AllNationalities';

    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('Database connection error:', err.message);
            res.status(500).json({ error: 'Database connection error' });
            return;
        }

        // Execute the query to fetch the selected data for the selected region
        const query = `SELECT Period, ${selectedValue4} FROM NationalityData WHERE Flow = ?`;
        db.all(query, [selectedValue3], (err, rows) => {
            if (err) {
                console.error('Query error:', err.message);
                res.status(500).json({ error: 'Query error' });
                return;
            }

            const aggregatedData1 = aggregateDataByYear1(rows, selectedValue4);

            res.json(aggregatedData1);

            db.close((err) => {
                if (err) {
                    console.error('Database close error:', err.message);
                }
            });
        });
    });
});

// Function to aggregate data by year
function aggregateDataByYear1(rows, selectedValue4) {

    const aggregatedData1 = [];
    let currentYear = null;
    let sumPrices = 0;
    let countEntries = 0;

    rows.forEach(row => {
        const Period = row.Period
        const year = '20' + Period.split(' ')[1];
        const price = parseFloat(row[selectedValue4]); // Access dynamically selected value

        if (currentYear === null) {
            currentYear = year;
        }

        if (year !== currentYear) {
            // Push aggregated data for previous year
            if (countEntries > 0) {
                aggregatedData1.push({
                    Period: currentYear,
                    [selectedValue4]: sumPrices / countEntries 
                });
            }

            // Reset counters for next year
            currentYear = year;
            sumPrices = 0;
            countEntries = 0;
        }

        // Accumulate values for current year
        sumPrices += price;
        countEntries++;
    });

    // Push last aggregated data
    if (countEntries > 0) {
        aggregatedData1.push({
            Period: currentYear,
            [selectedValue4]: sumPrices / countEntries 
        });
    }

    return aggregatedData1;
}
// Route to fetch all entries and columns from PropertyPrices table
app.get('/propertyPrices', (req, res) => {
    // Connect to the database
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('Database connection error:', err.message);
            res.status(500).json({ error: 'Database connection error' });
            return;
        }

        // Fetch all entries and columns from PropertyPrices table
        db.all('SELECT * FROM HPI', (err, rows) => {
            if (err) {
                console.error('Query error:', err.message);
                res.status(500).json({ error: 'Query error' });
                return;
            }

        
            res.json({ propertyPrices: rows });

            // Close the database connection
            db.close((err) => {
                if (err) {
                    console.error('Database close error:', err.message);
                } else {
                }
            });
        });
    });
});

// Function to initialize database schema
function initializeDatabase() {
    runDatabaseSQL();
}

// Initialize the database when the application starts
initializeDatabase();

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
