from flask import Blueprint, request, jsonify, current_app, make_response
from datetime import datetime, timedelta, timezone
import jwt
from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__)

def _make_tokens(user_id: int):
    now = datetime.now(timezone.utc)
    payload = {"uid": user_id, "iat": int(now.timestamp()), "exp": int((now+timedelta(hours=12)).timestamp())}
    token = jwt.encode(payload, current_app.config["JWT_SECRET"], algorithm="HS256")
    return token

def _current_user_from_request():
    token = request.cookies.get("access_token")
    if not token:
        return None
    try:
        data = jwt.decode(token, current_app.config["JWT_SECRET"], algorithms=["HS256"])
        return User.query.get(data["uid"])
    except Exception:
        return None

@auth_bp.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    if not all(k in data for k in ("username","email","password")):
        return jsonify({"error":"Missing fields"}), 400
    if User.query.filter((User.username==data["username"]) | (User.email==data["email"])).first():
        return jsonify({"error":"User exists"}), 400
    user = User(username=data["username"], email=data["email"], role=data.get("role","member"))
    user.set_password(data["password"])
    db.session.add(user); db.session.commit()
    return jsonify({"success": True})

@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    user = User.query.filter_by(username=data.get("username")).first()
    if not user or not user.check_password(data.get("password","")):
        return jsonify({"error":"Invalid credentials"}), 401
    token = _make_tokens(user.id)
    resp = make_response(jsonify({"success": True, "user": {"username": user.username, "role": user.role}}))
    resp.set_cookie("access_token", token, httponly=True, secure=False, samesite="Lax", max_age=60*60*12, path="/")
    return resp

@auth_bp.route("/auth/logout", methods=["POST"])
def logout():
    resp = make_response(jsonify({"success": True}))
    resp.set_cookie("access_token","", expires=0, path="/")
    return resp

@auth_bp.route("/auth/me", methods=["GET"])
def me():
    user = _current_user_from_request()
    if not user:
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True, "user": {"username": user.username, "role": user.role}})
