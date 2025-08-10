@echo off
echo KisaanConnect Backend Startup

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Setting up the database...
python -c "from auth.db_setup import create_tables, add_test_users; create_tables(); add_test_users()"

echo.
echo Starting the server...
python main.py

echo.
echo Server is running at http://localhost:8000
echo API documentation available at http://localhost:8000/docs 