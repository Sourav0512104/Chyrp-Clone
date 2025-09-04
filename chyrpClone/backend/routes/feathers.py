from flask import Blueprint, request, jsonify
from extensions import db
from models import Feather

bp = Blueprint("feathers", __name__)

# Helper to return all feathers in consistent shape
def all_feathers():
    feathers = Feather.query.all()
    return jsonify({
        "feathers": [f.to_dict() for f in feathers]
    })

# List feathers
@bp.route("/feathers", methods=["GET"])
def list_feathers():
    return all_feathers()

# Enable feather
@bp.route("/feathers/enable", methods=["POST"])
def enable_feather():
    data = request.get_json()
    key = data.get("key")
    feather = Feather.query.filter_by(key=key).first()
    if not feather:
        return jsonify({"success": False, "error": "Feather not found"}), 404

    feather.enabled = True
    db.session.commit()
    return all_feathers()

# Disable feather
@bp.route("/feathers/disable", methods=["POST"])
def disable_feather():
    data = request.get_json()
    key = data.get("key")
    feather = Feather.query.filter_by(key=key).first()
    if not feather:
        return jsonify({"success": False, "error": "Feather not found"}), 404

    feather.enabled = False
    db.session.commit()
    return all_feathers()
