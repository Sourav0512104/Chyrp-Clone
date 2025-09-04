from flask import Blueprint, request, jsonify
from models import db, Setting

settings_bp = Blueprint("settings", __name__)

@settings_bp.route("/settings", methods=["GET"])
def get_settings():
    settings = {s.key: s.value for s in Setting.query.all()}
    return jsonify({"success": True, "settings": settings})


@settings_bp.route("/settings", methods=["POST"])
def update_settings():
    data = request.get_json() or {}
    for key, value in data.items():
        setting = Setting.query.filter_by(key=key).first()
        if not setting:
            setting = Setting(key=key, value=value)
            db.session.add(setting)
        else:
            setting.value = value
    db.session.commit()
    return jsonify({"success": True})
