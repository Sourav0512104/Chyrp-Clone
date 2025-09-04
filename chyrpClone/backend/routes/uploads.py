from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
import os
from models import db, Upload
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
        filename = secure_filename(file.filename)
        save_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
        file.save(save_path)

        upload = Upload(
            filename=filename,
            filepath=save_path,
            mimetype=file.mimetype,
            size=os.path.getsize(save_path),
            created_at=datetime.utcnow(),
        )
        db.session.add(upload)
        db.session.commit()

        return jsonify({
            "success": True,
            "data": {
                "name": filename,
                "href": f"/api/uploads/{filename}"
            }
        })

    return jsonify({"success": False, "error": "Invalid file type"}), 400


@uploads_bp.route("/uploads/<path:filename>")
def get_uploaded_file(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)


@uploads_bp.route("/uploads/list", methods=["GET"])
def list_uploads():
    uploads = Upload.query.order_by(Upload.created_at.desc()).all()
    files = [
        {"name": u.filename, "href": f"/api/uploads/{u.filename}", "size": u.size}
        for u in uploads
    ]
    return jsonify({"success": True, "files": files})
