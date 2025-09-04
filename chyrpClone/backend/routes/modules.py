from flask import Blueprint, jsonify, request
from extensions import db
from models import Module
from cache_utils import cache_clear

bp = Blueprint("modules", __name__)

@bp.route("/modules", methods=["GET"])
def list_modules():
    modules = Module.query.order_by(Module.name.asc()).all()
    return jsonify({"modules": [m.to_dict() for m in modules]})

@bp.route("/modules/enable", methods=["POST"])
def enable_module():
    data = request.get_json() or {}
    key = data.get("key")
    mod = Module.query.filter_by(key=key).first()
    if not mod:
        return jsonify({"success": False, "error": "Module not found"}), 404
    mod.enabled = True
    db.session.commit()
    return list_modules()

@bp.route("/modules/disable", methods=["POST"])
def disable_module():
    data = request.get_json() or {}
    key = data.get("key")
    mod = Module.query.filter_by(key=key).first()
    if not mod:
        return jsonify({"success": False, "error": "Module not found"}), 404
    mod.enabled = False
    db.session.commit()
    return list_modules()

# Cacher: clear cache
@bp.route("/cacher/clear", methods=["POST"])
def clear_cacher():
    # Only allow if Cacher is enabled
    mod = Module.query.filter_by(key="cacher", enabled=True).first()
    if not mod:
        return jsonify({"success": False, "error": "Cacher is disabled"}), 400
    removed = cache_clear()
    return jsonify({"success": True, "removed": removed})
