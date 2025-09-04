# Chyrp-Clone
**Backend Setup**

cd backend
python -m venv venv
# Activate the virtual environment:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure MYSQL in app.py (enter your password)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqldb://<user>:<password>@localhost/chyrp_clone"

# Create MySQL DB: 
CREATE DATABASE chyrp_clone;

Inside backend : python seed.py
and then : flask run



# Frontend Setup
cd frontend
npm install
npm run dev

