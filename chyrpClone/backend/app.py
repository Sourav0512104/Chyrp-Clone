from flask import Flask, request
from flask_cors import CORS
from extensions import db

# NEW
from cache_utils import cache_load, cache_store
from models import Module

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqldb://root:Kssblr%402005@localhost/chyrp_clone"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    with app.app_context():
        db.create_all()

    # Register routes AFTER db is set up
    from routes import text
    app.register_blueprint(text.bp)
    from routes import preview
    app.register_blueprint(preview.preview_bp, url_prefix="/api")
    from routes import feathers
    app.register_blueprint(feathers.bp, url_prefix="/api")

    # NEW: modules endpoints
    from routes import modules
    app.register_blueprint(modules.bp, url_prefix="/api")

    # ---------- CACHER MIDDLEWARE ----------
    CACHEABLE_PATHS = (
        "/api/posts",
        "/api/feathers",
        # add more read-only endpoints here as needed
    )

    def cacher_enabled() -> bool:
        # cheap lookup; ok to query each request for now
        try:
            return Module.query.filter_by(key="cacher", enabled=True).first() is not None
        except Exception:
            return False

    @app.before_request
    def maybe_serve_from_cache():
        if not cacher_enabled():
            return None
        if request.method != "GET":
            return None
        if not any(request.path.startswith(p) for p in CACHEABLE_PATHS):
            return None
        resp = cache_load(request.path, request.query_string)
        if resp:
            return resp  # short-circuit with cached response

    @app.after_request
    def maybe_store_to_cache(response):
        try:
            if cacher_enabled() \
               and request.method == "GET" \
               and response.status_code == 200 \
               and response.mimetype == "application/json" \
               and any(request.path.startswith(p) for p in CACHEABLE_PATHS):
                cache_store(request.path, request.query_string, response)
                response.headers["X-Cache"] = response.headers.get("X-Cache", "MISS")
        except Exception:
            pass
        return response
    # ---------- END CACHER MIDDLEWARE ----------

    return app

app = create_app()
