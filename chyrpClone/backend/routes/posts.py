from flask import Blueprint, jsonify
from models import Post

bp = Blueprint("posts", __name__, url_prefix="/api")

@bp.route("/posts", methods=["GET"])
def get_posts():
    posts = Post.query.filter_by(status="published").all()
    return jsonify({"posts": [p.to_dict() for p in posts]})
