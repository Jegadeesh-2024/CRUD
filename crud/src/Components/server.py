from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import pymysql.cursors
import bcrypt

app = Flask(__name__)
CORS(app)

db_config = {
    "host": "localhost",
    "password": "",
    "user": "root",
    "database": "props_crud"
}

# -----------------------------
# GET: Fetch all form records
# -----------------------------
@app.route("/props_form", methods=["GET"])
def get_form():
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT * FROM props ")
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(rows)


# UPDATE record by ID
@app.route("/props_forms/<int:id>", methods=["PUT"])
def update_form(id):
    data = request.json
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor()

    password = data.get("password","").strip()
    hashed_password = None
    if password:
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())


    # errors = validate_user(data,is_edit = True)
    # if errors:
    #     return jsonify({"success":False,"error":errors}),400



    
    sql = """UPDATE props
             SET username=%s, password=%s, email=%s, gender=%s, language=%s, agreed=%s 
             WHERE id=%s"""
    cursor.execute(sql, (
        data["username"], hashed_password, data["email"], data["gender"], 
        data["language"], data["agreed"], id
    ))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Record updated!"})

# put validation :
# def validate_user(form_data, is_edit=False):
#     errors = {}

#     user_name = form_data.get("username", "").strip()
#     # password = form_data.get("password", "").strip()
#     # confirm_password = form_data.get("confirm", "").strip()
#     email = form_data.get("email", "").strip()
#     gender = form_data.get("gender", "").strip().lower()
#     language = form_data.get("language", "").strip()
#     agreed = form_data.get("agreed", False)

#     # --- Username ---
#     if not user_name:
#         errors.setdefault("username", []).append("Username is required.")
#     elif len(user_name) < 3:
#         errors.setdefault("username", []).append("Username must be at least 3 characters long.")

#     # --- Email ---
#     if not email:
#         errors.setdefault("email", []).append("Email is required.")
#     elif "@" not in email or "." not in email:
#         errors.setdefault("email", []).append("Invalid email format.")

#     # --- Password + Confirm ---
#     # if not is_edit:  # required for POST
#     #     if not password:
#     #         errors.setdefault("password", []).append("Password is required.")
#     #     elif len(password) < 6:
#     #         errors.setdefault("password", []).append("Password must be at least 6 characters long.")

#     #     if not confirm_password:
#     #         errors.setdefault("confirm", []).append("Confirm password is required.")
#     #     elif password != confirm_password:
#     #         errors.setdefault("confirm", []).append("Passwords do not match.")
#     # else:  # edit mode → optional
#     #     if password:  # only check if provided
#     #         if len(password) < 6:
#     #             errors.setdefault("password", []).append("Password must be at least 6 characters long.")
#     #         if password != confirm_password:
#     #             errors.setdefault("confirm", []).append("Passwords do not match.")

#     # --- Gender ---
#     valid_genders = ["male", "female", "other"]
#     if not gender:
#         errors.setdefault("gender", []).append("Gender is required.")
#     elif gender not in valid_genders:
#         errors.setdefault("gender", []).append(f"Gender must be one of {valid_genders}.")

#     # --- Language ---
#     if not language:
#         errors.setdefault("language", []).append("Language is required.")

#     # --- Agreed ---
#     if not is_edit:  # only required when creating
#         if not agreed:
#             errors.setdefault("agreed", []).append("You must agree to terms.")

#     return errors






# DELETE record by ID
@app.route("/delete_forms/<int:id>", methods=["DELETE"])
def delete_form(id):
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute("DELETE FROM props WHERE id=%s", (id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Record deleted!"})





# -----------------------------
# POST: Insert new record
# -----------------------------
@app.route("/props_forms", methods=["POST"])
def create_form():
    form_data = request.json

    if not form_data:
        return jsonify({"error": "No data submitted"}), 400
    

    
    # post request validation :

    username = form_data["username"].strip()
    password = form_data["password"].strip()
    email = form_data["email"].strip()
    gender = form_data["gender"].strip()
    language = form_data["language"].strip()
    agreed = form_data["agreed"]  # boolean, don't strip

    errors = {}

    # --- Username ---
    if not username:
        errors.setdefault("username", []).append("Username is required.")
    elif len(username) < 3:
        errors.setdefault("username", []).append("Username must be at least 3 characters long.")

    # --- Email ---
    if not email:
        errors.setdefault("email", []).append("Email is required.")
    elif "@" not in email or "." not in email:
        errors.setdefault("email", []).append("Invalid email format.")

    # --- Password ---
    if not password:
        errors.setdefault("password", []).append("Password is required.")
    elif len(password) < 6:
        errors.setdefault("password", []).append("Password must be at least 6 characters long.")

    
    # --- Gender ---
    valid_genders = ["male", "female", "other"]
    if not gender:
        errors.setdefault("gender", []).append("Gender is required.")
    elif gender not in valid_genders:
        errors.setdefault("gender", []).append(f"Gender must be one of {valid_genders}.")

    # --- Language ---
    if not language:
        errors.setdefault("language", []).append("Language is required.")

    # --- Agreed ---
    if not agreed:
        errors.setdefault("agreed", []).append("You must agree to terms.")

    # --- If any errors ---
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    





    # Insert into DB
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    sql = """INSERT INTO props
             (username, password, email, gender, language, agreed) 
             VALUES (%s, %s, %s, %s, %s, %s)"""
    cursor.execute(sql, (username, hashed_password, email, gender, language, agreed))
    connection.commit()
    cursor.close()
    connection.close()

   

    # return jsonify({"message": "Booking Successful!"})
    # If success
    return jsonify({"success": True, "message": "User registered successfully!"}), 201


if __name__ == "__main__":
    app.run(debug=True)
