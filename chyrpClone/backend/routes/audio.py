from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

from extensions import db
from models import Post, PostAttribute

bp = Blueprint("audio", __name__)

UPLOAD_FOLDER = "uploads/audio"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# --- File Upload Only ---
@bp.route("/upload_audio", methods=["POST"])
def upload_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    return jsonify({"data": {"href": f"/{UPLOAD_FOLDER}/{filename}"}})


# --- Create Audio Post ---
@bp.route("/audio", methods=["POST"])
def create_audio_post():
    data = request.get_json()

    try:
        # Core post
        post = Post(
            title=data.get("title", "Untitled Audio"),
            body=data.get("body", ""),   # optional body/description
            status=data.get("status", "draft"),
        )
        db.session.add(post)
        db.session.flush()

        # Feather-specific fields
        attrs = []
        if "audio_url" in data:
            attrs.append(PostAttribute(post_id=post.id, key="audio_url", value=data["audio_url"]))
        if "caption" in data:
            attrs.append(PostAttribute(post_id=post.id, key="caption", value=data["caption"]))

        db.session.add_all(attrs)
        db.session.commit()

        return jsonify(post.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# --- Get Audio Post ---
@bp.route("/audio/<int:post_id>", methods=["GET"])
def get_audio_post(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify(post.to_dict())
