# backend/seed.py
from app import app
from extensions import db
from models import Feather, Module

def seed_feathers():
    if Feather.query.count() == 0:
        feathers = [
            {"key": "text", "name": "Text", "description": "Write plain text posts"},
            {"key": "audio", "name": "Audio", "description": "Embed audio players"},
            {"key": "link", "name": "Link", "description": "Share external links"},
            {"key": "photo", "name": "Photo", "description": "Upload and share photos"},
            {"key": "quote", "name": "Quote", "description": "Post quotes"},
            {"key": "uploader", "name": "Uploader", "description": "Upload generic files"},
            {"key": "video", "name": "Video", "description": "Embed and upload videos"},
        ]
        for f in feathers:
            db.session.add(Feather(**f))
        db.session.commit()
        print("✅ Feathers seeded")
    else:
        print("⚠️ Feathers already exist")

def seed_modules():
    if Module.query.count() == 0:
        modules = [
            {"key": "cacher", "name": "Cacher", "description": "Cache pages for performance"},
            {"key": "comments", "name": "Comments", "description": "Enable comments system"},
            {"key": "contact", "name": "Contact", "description": "Contact form"},
            {"key": "drafts", "name": "Drafts", "description": "Save posts as drafts"},
            {"key": "emoticons", "name": "Emoticons", "description": "Convert text emoticons"},
            {"key": "import", "name": "Import", "description": "Import content"},
            {"key": "likes", "name": "Likes", "description": "Like system for posts"},
            {"key": "mail", "name": "Mail", "description": "Send mail notifications"},
            {"key": "markdown", "name": "Markdown", "description": "Markdown support"},
            {"key": "navigation", "name": "Navigation", "description": "Custom navigation menus"},
            {"key": "pages", "name": "Pages", "description": "Static pages support"},
            {"key": "related_posts", "name": "Related Posts", "description": "Show related posts"},
            {"key": "scheduler", "name": "Scheduler", "description": "Schedule posts"},
            {"key": "search", "name": "Search", "description": "Search site content"},
            {"key": "texturize", "name": "Texturize", "description": "Smart typography"},
            {"key": "update", "name": "Update", "description": "Update notifications"},
            {"key": "xml_sitemap", "name": "XML Sitemap", "description": "Generate sitemaps"},
        ]
        for m in modules:
            db.session.add(Module(**m))
        db.session.commit()
        print("✅ Modules seeded")
    else:
        print("⚠️ Modules already exist")

if __name__ == "__main__":
    with app.app_context():
        # 🔑 Ensure all missing tables are created before seeding
        db.create_all()

        seed_feathers()
        seed_modules()
