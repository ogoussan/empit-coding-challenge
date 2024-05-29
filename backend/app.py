from flask import Flask, request, abort, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, JSON, select
from sqlalchemy.orm import relationship

app = Flask(__name__)
CORS(app)

# connect to database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///./database.db"
db = SQLAlchemy(app)


### DB Models ###
class Continent(db.Model):
    __tablename__ = "continent"

    __table_args__ = (
        db.PrimaryKeyConstraint("id", name="continent_pkey"),
        db.UniqueConstraint("name", name="continent_name_ukey"),
    )

    id = db.Column(Integer, primary_key=True)
    name = db.Column(String)
    countries = relationship("Country", back_populates="continent")


class Country(db.Model):
    __tablename__ = "country"

    __table_args__ = (
        db.PrimaryKeyConstraint("id", name="country_pkey"),
        db.UniqueConstraint("name", name="country_name_ukey"),
        db.ForeignKeyConstraint(
            ["continent_id"],
            ["continent.id"],
            name="country_continent_fkey",
        ),
    )

    id = db.Column(Integer, primary_key=True)
    continent_id = db.Column(Integer)
    polygon_count = db.Column(Integer)
    name = db.Column(String)
    continent = relationship("Continent", back_populates="countries")
    polygons = relationship("Polygon", back_populates="country")


class Polygon(db.Model):
    __tablename__ = "polygon"

    __table_args__ = (
        db.PrimaryKeyConstraint("id", name="polygon_pkey"),
        db.ForeignKeyConstraint(
            ["country_id"],
            ["country.id"],
            name="polygon_country_fkey",
        ),
    )

    id = db.Column(Integer, primary_key=True)
    country_id = db.Column(Integer)
    coordinates = db.Column(JSON)
    country = relationship("Country", back_populates="polygons")


### ROUTES ###
@app.route("/form")
def form():
    stmt = select(Continent)
    continents = db.session.scalars(stmt).all()
    result = []
    for continent in continents:
        result.append(
            {
                "name": continent.name,
                "id": continent.id,
                "countries": [
                    {
                        "name": country.name,
                        "id": country.id,
                        "polygons": [polygon.id for polygon in country.polygons],
                    }
                    for country in continent.countries
                ],
            }
        )
    return jsonify(result)


@app.route("/polygon")
def polygon():
    polygon_id = request.args.get("id")
    if not polygon_id:
        abort(400, description="The parameter 'id' must be specified")
    stmt = select(Polygon).where(Polygon.id == polygon_id)
    result = db.session.scalars(stmt).first()
    if not result:
        abort(404, description=f"Polygon with the polygon_id: '{polygon_id}' not found")
    return jsonify(result.coordinates)
