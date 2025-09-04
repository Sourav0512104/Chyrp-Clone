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

<img width="732" height="315" alt="image" src="https://github.com/user-attachments/assets/14d6e30e-5bef-497b-b4a0-b57c2f7ef73c" />

