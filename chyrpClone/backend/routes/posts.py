from flask import Blueprint, request, jsonify
from extensions import db
from models import Post
from routes._authz import require_role, require_auth

bp = Blueprint("posts", __name__, url_prefix="/api")

# --- Public ---
@bp.route("/posts", methods=["GET"])
def list_posts():
    """List published posts"""
    posts = Post.query.filter_by(status="published").order_by(Post.id.desc()).all()
    return jsonify({"posts": [p.to_dict() for p in posts]})

@bp.route("/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    """Single post view"""
    post = Post.query.get_or_404(post_id)
    if post.status != "published":
        return jsonify({"error": "Post not published"}), 403
    return jsonify(post.to_dict())

# --- Authenticated ---
@bp.route("/posts", methods=["POST"])
@require_role("admin", "author")
def create_post():
    """Author or admin can create"""
    data = request.get_json() or {}
    user = request.current_user
    post = Post(
        title=data.get("title", "Untitled"),
        body=data.get("body", ""),
        status=data.get("status", "draft"),
        author_id=user.id,
    )
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201

@bp.route("/posts/<int:post_id>", methods=["PUT"])
@require_role("admin", "author")
def update_post(post_id):
    """Owner or admin can edit"""
    post = Post.query.get_or_404(post_id)
    user = request.current_user
    if user.role != "admin" and post.author_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or {}
    post.title = data.get("title", post.title)
    post.body = data.get("body", post.body)
    post.status = data.get("status", post.status)
    db.session.commit()
    return jsonify(post.to_dict())

@bp.route("/posts/<int:post_id>", methods=["DELETE"])
@require_role("admin", "author")
def delete_post(post_id):
    """Owner or admin can delete"""
    post = Post.query.get_or_404(post_id)
    user = request.current_user
    if user.role != "admin" and post.author_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({"success": True})
