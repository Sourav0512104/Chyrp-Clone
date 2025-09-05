from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# -------------------- POST --------------------
class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default="draft")

    # 🔗 Relationship to post_attributes
    attributes = db.relationship(
        "PostAttribute",
        backref="post",
        lazy=True,
        cascade="all, delete-orphan"
    )

    # 🔗 Author relationship
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    author    = db.relationship("User", backref="posts")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "status": self.status,
            "author": self.author.username if self.author else None,
            "attributes": {attr.key: attr.value for attr in self.attributes}
        }


# -------------------- POST ATTRIBUTES --------------------
class PostAttribute(db.Model):
    __tablename__ = "post_attributes"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    key = db.Column(db.String(50), nullable=False)
    value = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "key": self.key,
            "value": self.value,
        }


# -------------------- FEATHERS --------------------
class Feather(db.Model):
    __tablename__ = "feathers"

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(255), nullable=True)
    enabled = db.Column(db.Boolean, default=False, nullable=False)

    def to_dict(self):
        return {
            "key": self.key,
            "name": self.name,
            "description": self.description,
            "url": self.url,
            "enabled": bool(self.enabled),   # ✅ simpler, reliable
        }


# -------------------- USERS --------------------
class User(db.Model):
    __tablename__ = "users"

    id       = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email    = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role     = db.Column(db.String(20), default="member")  # admin|author|member
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, pw: str):
        self.password_hash = generate_password_hash(pw)

    def check_password(self, pw: str) -> bool:
        return check_password_hash(self.password_hash, pw)


# -------------------- MODULES --------------------
class Module(db.Model):
    __tablename__ = "modules"

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    enabled = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "key": self.key,
            "name": self.name,
            "description": self.description,
            "enabled": bool(self.enabled),
        }

class Upload(db.Model):
    __tablename__ = "uploads"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(500), nullable=False)
    mimetype = db.Column(db.String(100), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "href": f"/api/uploads/{self.filepath}",  # relative path
            "mimetype": self.mimetype,
            "size": self.size,
            "created_at": self.created_at.isoformat(),
        }