from flask import Blueprint, request, jsonify
import markdown

preview_bp = Blueprint("preview", __name__)

@preview_bp.route("/preview", methods=["POST"])
def preview():
    try:
        data = request.get_json()
        content = data.get("content", "")
        markdown_enabled = data.get("markdown", True)

        if markdown_enabled:
            html = markdown.markdown(content, extensions=["fenced_code", "tables"])
        else:
            html = content

        return jsonify({"success": True, "html": html})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
