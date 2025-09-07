# Clone the repository

git clone https://github.com/Shhaan/Ominify-assesment.git

# Navigate into the project directory

cd Ominify-assesment

# Pull the latest changes from the repository (optional, but good practice)

git pull origin main

# Backend Setup (Django)

cd backend
python -m venv venv
source venv/bin/activate # For macOS/Linux

# venv\Scripts\activate # For Windows

pip install -r req.txt
python manage.py migrate
python manage.py runserver

# Frontend Setup (Next.js)

cd ../frontend
npm install
npm run dev

# Running Pytest

cd ../backend
pytest
