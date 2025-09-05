from flask import request, jsonify, current_app
import jwt
from models import User

def require_auth(f):
    def wrapper(*args, **kwargs):
        token = request.cookies.get("access_token")
        if not token:
            return jsonify({"error":"Unauthorized"}), 401
        try:
            data = jwt.decode(token, current_app.config["JWT_SECRET"], algorithms=["HS256"])
            user = User.query.get(data["uid"])
            if not user:
                return jsonify({"error":"Unauthorized"}), 401
            request.current_user = user
            return f(*args, **kwargs)
        except Exception:
            return jsonify({"error":"Unauthorized"}), 401
    wrapper.__name__ = f.__name__
    return wrapper

def require_role(*roles):
    def decorator(f):
        def wrapper(*args, **kwargs):
            user = getattr(request, "current_user", None)
            if not user or user.role not in roles:
                return jsonify({"error":"Forbidden"}), 403
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return require_auth(wrapper)
    return decorator
