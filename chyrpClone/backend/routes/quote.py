from flask import Blueprint, request, jsonify
from extensions import db
from models import Post, PostAttribute

bp = Blueprint("quote", __name__)

# Create quote post
@bp.route("/quote", methods=["POST"])
def create_quote_post():
    data = request.get_json()

    try:
        # No title for quotes, only body + source
        post = Post(
            title="(Quote)",  # placeholder to satisfy schema
            body=data.get("quote", ""),
            status=data.get("status", "draft"),
        )
        db.session.add(post)
        db.session.flush()

        # Save "source" separately
        if "source" in data:
            attr = PostAttribute(post_id=post.id, key="source", value=data["source"])
            db.session.add(attr)

        db.session.commit()
        return jsonify(post.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# Get quote post
@bp.route("/quote/<int:post_id>", methods=["GET"])
def get_quote_post(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify(post.to_dict())
