from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
import os
from datetime import datetime

uploads_bp = Blueprint("uploads", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "svg", "pdf", "mp4", "mp3"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@uploads_bp.route("/uploads", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "error": "Empty filename"}), 400

    if file and allowed_file(file.filename):
        # --- build year/month path ---
        subdir = datetime.utcnow().strftime("%Y/%m")
        save_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], subdir)
        os.makedirs(save_dir, exist_ok=True)

        filename = secure_filename(file.filename)
        save_path = os.path.join(save_dir, filename)
        file.save(save_path)

        # return correct href
        return jsonify({
            "success": True,
            "data": {
                "name": filename,
                "href": f"/api/uploads/{subdir}/{filename}"
            }
        })

    return jsonify({"success": False, "error": "Invalid file type"}), 400

@uploads_bp.route("/uploads/<path:filename>")
def get_uploaded_file(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)
