from extensions import db

class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default="draft")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "status": self.status
        }

class Feather(db.Model):
    __tablename__ = "feathers"

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(255), nullable=True)
    enabled = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "key": self.key,
            "name": self.name,
            "description": self.description,
            "url": self.url,
            "enabled": self.enabled,
        }

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
            "enabled": self.enabled,
        }
