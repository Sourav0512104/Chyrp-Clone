from flask import Blueprint, request, jsonify
from extensions import db
from models import Post, PostAttribute

bp = Blueprint("link", __name__)

@bp.route("/link", methods=["POST"])
def create_link():
    data = request.json
    try:
        # 1. Create a post
        post = Post(title=data["title"], body=data.get("description", ""))
        db.session.add(post)
        db.session.flush()  # ensures post.id is set

        # 2. Save feather-specific fields in post_attributes
        attrs = [
            PostAttribute(post_id=post.id, key="url", value=data["url"]),
            PostAttribute(post_id=post.id, key="description", value=data.get("description", "")),
        ]
        db.session.add_all(attrs)

        db.session.commit()
        return jsonify({"message": "Link feather created", "id": post.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@bp.route("/link/<int:id>", methods=["GET"])
def get_link(id):
    post = Post.query.get_or_404(id)
    attrs = {a.key: a.value for a in post.attributes}  # SQLAlchemy relationship
    return jsonify({
        "id": post.id,
        "title": post.title,
        "url": attrs.get("url"),
        "description": attrs.get("description"),
    })
