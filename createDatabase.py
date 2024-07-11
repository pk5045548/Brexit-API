import csv
import os
import sqlite3

def create_database():
    # Connect to SQLite database (it will be created if it doesn't exist)
    conn = sqlite3.connect('backend/house_inflation1.db')
    cursor = conn.cursor()

    # Read the SQL script
    with open('backend/database.sql', 'r') as sql_file:
        sql_script = sql_file.read()

    # Execute the SQL script
    try:
        cursor.executescript(sql_script)
        conn.commit()
        print("Database and tables created successfully.")
    except sqlite3.OperationalError as e:
        print(f"SQLite error: {e}")
    finally:
        conn.close()

# Function to create database tables
def create_tables():
    conn = sqlite3.connect('backend/house_inflation1.db')
    cursor = conn.cursor()

    # SQL script to create tables
    with open('backend/database.sql', 'r') as sql_file:
        sql_script = sql_file.read()

    # Debug: print the SQL script
    print("Executing SQL script:")

    try:
        cursor.executescript(sql_script)
        conn.commit()
    except sqlite3.OperationalError as e:
        print(f"SQLite error: {e}")
    finally:
        conn.close()
    

# Function to insert data into tables from CSV files
import sqlite3
import csv
import os
import glob
import re

def insert_data_from_csv(folder_path, sql_file_path):
    # Connect to SQLite database
    conn = sqlite3.connect('backend/house_inflation1.db')
    cursor = conn.cursor()

    # Manually set table names to the 5 in your SQL script
    table_names = ['HPI', 'NationalityData', 'EstimateData', 'ReasonsData', 'NationalityAndReasonsData', 'ImmigrationEmigrationData']

    # Define corresponding CSV files for each table
    csv_files = {
        'HPI': 'UK-HPI-FIXED.csv',
        'NationalityData': 'Migration_Data_1_FIXED.csv',
        'EstimateData': 'Migration_Data_2_FIXED.csv',
        'ReasonsData': 'Migration_Data_3_FIXED.csv',
        'NationalityAndReasonsData': 'Migration_Data_4_FIXED.csv',
        'ImmigrationEmigrationData': 'Migration_Data_5_FIXED.csv'
    }

    # Insert data into each table
    for table_name in table_names:
        csv_file = os.path.join(folder_path, csv_files[table_name])
        with open(csv_file, 'r', newline='', encoding='utf-8') as file:
            csv_reader = csv.reader(file)
            headers = next(csv_reader)
            
            # Exclude 'ID' column
            headers_without_id = [header for header in headers if header.lower() != 'id']
            placeholders = ', '.join([':' + header for header in headers_without_id])
            columns = ', '.join(['"' + header + '"' for header in headers_without_id])

            insert_sql = f'INSERT INTO "{table_name}" ({columns}) VALUES ({placeholders})'
            print(f"Inserting data into {table_name} with columns {columns}")
            # input("Press Enter to continue...")  # Pauses execution until you press Enter

            for row in csv_reader:
                try:
                    data_dict = {header: value for header, value in zip(headers, row) if header.lower() != 'id'}
                    cursor.execute(insert_sql, data_dict)
                except sqlite3.OperationalError as e:
                    print(f'SQLite error while inserting into "{table_name}": {e}')

    conn.commit()
    conn.close()


def verify_database():
    conn = sqlite3.connect('backend/house_inflation1.db')
    cursor = conn.cursor()

    try:
        # Query to list all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Tables in the database:", tables)

        # Fetch and print entries for each table
        for table in tables:
            table_name = table[0]
            print(f"Entries in table '{table_name}':")
            cursor.execute(f"SELECT * FROM {table_name};")
            entries = cursor.fetchall()
            for entry in entries:
                print(entry)

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")

    finally:
        conn.close()

# Main function
def main():

    # Call functions to create tables and insert data
    create_database()
    create_tables()
    insert_data_from_csv('backend/source-data', 'backend/database.sql')
    verify_database()

if __name__ == "__main__":
    main()
