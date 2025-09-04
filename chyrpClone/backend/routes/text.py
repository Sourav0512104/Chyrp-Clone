from flask import Blueprint, request, jsonify
from extensions import db
from models import Post

bp = Blueprint("text", __name__)

# Get all posts
@bp.route("/api/posts", methods=["GET"])
def get_posts():
    posts = Post.query.all()
    return jsonify([p.to_dict() for p in posts])

# Create a new post
@bp.route("/api/posts", methods=["POST"])
def create_post():
    data = request.get_json()
    new_post = Post(
        title=data.get("title", "Untitled"),
        body=data.get("body", ""),
        status=data.get("status", "draft")
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.to_dict()), 201

# Update a post
@bp.route("/api/posts/<int:post_id>", methods=["PUT"])
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    data = request.get_json()
    post.title = data.get("title", post.title)
    post.body = data.get("body", post.body)
    post.status = data.get("status", post.status)
    db.session.commit()
    return jsonify(post.to_dict())

# Delete a post
@bp.route("/api/posts/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"})
