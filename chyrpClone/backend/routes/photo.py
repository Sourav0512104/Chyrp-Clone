# backend/routes/photo.py
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

from extensions import db
from models import Post, PostAttribute

bp = Blueprint("photo", __name__)

UPLOAD_FOLDER = "uploads/photo"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# --- Upload only ---
@bp.route("/upload_photo", methods=["POST"])
def upload_photo():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    return jsonify({"href": f"/{UPLOAD_FOLDER}/{filename}"})


# --- Create photo post ---
@bp.route("/photo", methods=["POST"])
def create_photo_post():
    data = request.get_json()

    try:
        post = Post(
            title=data.get("title", "Untitled Photo"),
            body=data.get("body", ""),  # caption/description from editor
            status=data.get("status", "draft"),
        )
        db.session.add(post)
        db.session.flush()

        # Feather-specific attributes
        attrs = []
        if "photo_url" in data:
            attrs.append(PostAttribute(post_id=post.id, key="photo_url", value=data["photo_url"]))
        if "caption" in data:
            attrs.append(PostAttribute(post_id=post.id, key="caption", value=data["caption"]))

        db.session.add_all(attrs)
        db.session.commit()

        return jsonify(post.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# --- Get photo post ---
@bp.route("/photo/<int:post_id>", methods=["GET"])
def get_photo_post(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify(post.to_dict())
