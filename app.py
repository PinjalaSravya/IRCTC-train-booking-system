from flask import Flask, render_template, request, redirect, session, url_for
import mysql.connector
from config import DB_CONFIG

app = Flask(__name__)
app.secret_key = "secret123"

def get_db():
    return mysql.connector.connect(**DB_CONFIG)

@app.route("/")
def home():
    return render_template("index.html")

# REGISTER
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        fullname = request.form.get("fullname")
        password = request.form.get("password")
        confirm = request.form.get("confirm_password")
        email = request.form.get("email")
        phone = request.form.get("phone")

        if password != confirm:
            return "Passwords do not match"

        db = get_db()
        cursor = db.cursor()

        cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        if cursor.fetchone():
            return "User already exists"

        cursor.execute(
            "INSERT INTO users (username, fullname, password, email, phone) VALUES (%s,%s,%s,%s,%s)",
            (username, fullname, password, email, phone)
        )

        db.commit()
        db.close()

        return redirect("/login")

    return render_template("register.html", hide_auth=True)

# LOGIN
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        db = get_db()
        cursor = db.cursor()

        cursor.execute("SELECT * FROM users WHERE username=%s AND password=%s",
                       (username, password))
        user = cursor.fetchone()

        if user:
            session["user_id"] = user[0]
            return redirect("/")
        else:
            return "Invalid login"

    return render_template("login.html", hide_auth=True)

# SEARCH
@app.route("/search", methods=["POST"])
def search():
    src = request.form.get("source")
    dest = request.form.get("destination")

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM trains WHERE source=%s AND destination=%s", (src, dest))
    trains = cursor.fetchall()

    return render_template("results.html", trains=trains)

# BOOK
@app.route("/book/<int:train_id>", methods=["GET", "POST"])
def book(train_id):
    if "user_id" not in session:
        return redirect("/login")

    if request.method == "POST":
        names = request.form.getlist("name[]")
        ages = request.form.getlist("age[]")
        genders = request.form.getlist("gender[]")
        prefs = request.form.getlist("preference[]")

        db = get_db()
        cursor = db.cursor()

        for i in range(len(names)):
            cursor.execute(
                "INSERT INTO bookings (user_id, train_id, passenger_name, age, gender, seat_preference, status) VALUES (%s,%s,%s,%s,%s,%s,%s)",
                (session["user_id"], train_id, names[i], ages[i], genders[i], prefs[i], "CONFIRMED")
            )

        db.commit()
        db.close()

        return "Booking Confirmed!"

    return render_template("book.html")

if __name__ == "__main__":
    app.run(debug=True)