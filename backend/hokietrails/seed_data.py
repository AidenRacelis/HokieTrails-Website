"""Seed data for the JSON "databases".

These records are written to ``data/trails.json`` and ``data/housing.json`` the
first time each collection is accessed (see ``JsonCollection.seed_if_empty``).
The trails are real, well-known hikes in the Commonwealth of Virginia and the
ratings approximate what is reported on Google and AllTrails.

Coordinate convention: ``x`` is longitude and ``y`` is latitude (GIS standard),
and the same values are duplicated as ``lat`` / ``lng`` for Google Maps.
"""

from __future__ import annotations


def _coords(lat: float, lng: float) -> dict:
    return {"lat": lat, "lng": lng, "x": lng, "y": lat}


TRAIL_SEED: list[dict] = [
    {
        "id": "mcafee-knob",
        "name": "McAfee Knob",
        "town": "Catawba",
        "county": "Roanoke County",
        "state": "Virginia",
        "coordinates": _coords(37.3917, -80.0367),
        "length_miles": 8.8,
        "elevation_gain_ft": 1740,
        "highest_elevation_ft": 3197,
        "difficulty": "medium",
        "elevation_difficulty": "sustained climb",
        "route_type": "out-and-back",
        "description": (
            "The most photographed spot on the Appalachian Trail. A steady climb "
            "along the AT leads to a dramatic overhanging rock ledge with sweeping "
            "views of the Catawba Valley and Tinker Cliffs."
        ),
        "features": ["overlook", "appalachian-trail", "dog-friendly"],
        "best_season": "spring-fall",
        "ratings": {
            "google": {"rating": 4.8, "reviews": 3120},
            "alltrails": {"rating": 4.8, "reviews": 4890},
        },
        "routes": [
            {
                "name": "McAfee Knob via Appalachian Trail",
                "distance_miles": 8.8,
                "difficulty": "medium",
                "elevation_gain_ft": 1740,
                "type": "out-and-back",
                "description": "Classic AT approach from the VA-311 parking lot.",
            },
            {
                "name": "McAfee Knob + Tinker Cliffs (via Andy Layne)",
                "distance_miles": 18.9,
                "difficulty": "hard",
                "elevation_gain_ft": 3900,
                "type": "point-to-point",
                "description": "The full Catawba 'Triple Crown' leg between the two overlooks.",
            },
        ],
    },
    {
        "id": "old-rag-mountain",
        "name": "Old Rag Mountain",
        "town": "Etlan",
        "county": "Madison County",
        "state": "Virginia",
        "coordinates": _coords(38.5518, -78.3170),
        "length_miles": 9.5,
        "elevation_gain_ft": 2415,
        "highest_elevation_ft": 3291,
        "difficulty": "hard",
        "elevation_difficulty": "strenuous scramble",
        "route_type": "loop",
        "description": (
            "Shenandoah National Park's most famous and demanding hike, featuring a "
            "long rock scramble across the summit ridge with panoramic Blue Ridge "
            "views. A day-use ticket is required March-November."
        ),
        "features": ["summit", "rock-scramble", "ticketed"],
        "best_season": "spring-fall",
        "ratings": {
            "google": {"rating": 4.8, "reviews": 4260},
            "alltrails": {"rating": 4.8, "reviews": 6100},
        },
        "routes": [
            {
                "name": "Old Rag Ridge & Saddle Loop",
                "distance_miles": 9.5,
                "difficulty": "hard",
                "elevation_gain_ft": 2415,
                "type": "loop",
                "description": "Ridge Trail up through the scramble, Saddle & fire road down.",
            }
        ],
    },
    {
        "id": "dragons-tooth",
        "name": "Dragon's Tooth",
        "town": "Catawba",
        "county": "Roanoke County",
        "state": "Virginia",
        "coordinates": _coords(37.3778, -80.1553),
        "length_miles": 4.5,
        "elevation_gain_ft": 1500,
        "highest_elevation_ft": 3020,
        "difficulty": "hard",
        "elevation_difficulty": "steep rocky climb",
        "route_type": "out-and-back",
        "description": (
            "A rugged climb to a 35-foot spire of Tuscarora quartzite. Rebar rungs "
            "and rock steps make the final push a fun scramble. The third leg of "
            "the Roanoke Triple Crown."
        ),
        "features": ["summit", "rock-scramble", "triple-crown"],
        "best_season": "spring-fall",
        "ratings": {
            "google": {"rating": 4.7, "reviews": 1180},
            "alltrails": {"rating": 4.6, "reviews": 2450},
        },
        "routes": [
            {
                "name": "Dragon's Tooth via Boy Scout & AT",
                "distance_miles": 4.5,
                "difficulty": "hard",
                "elevation_gain_ft": 1500,
                "type": "out-and-back",
                "description": "Boy Scout Trail to the AT and the Dragon's Tooth spur.",
            }
        ],
    },
    {
        "id": "humpback-rocks",
        "name": "Humpback Rocks",
        "town": "Lyndhurst",
        "county": "Augusta County",
        "state": "Virginia",
        "coordinates": _coords(37.9640, -78.8960),
        "length_miles": 2.0,
        "elevation_gain_ft": 740,
        "highest_elevation_ft": 3080,
        "difficulty": "medium",
        "elevation_difficulty": "short steep climb",
        "route_type": "out-and-back",
        "description": (
            "A short but steep climb off the Blue Ridge Parkway to a rocky outcrop "
            "with 270-degree views of the Shenandoah Valley. Very popular at sunrise."
        ),
        "features": ["overlook", "blue-ridge-parkway", "sunrise"],
        "best_season": "year-round",
        "ratings": {
            "google": {"rating": 4.7, "reviews": 1590},
            "alltrails": {"rating": 4.6, "reviews": 2210},
        },
        "routes": [
            {
                "name": "Humpback Rocks Trail",
                "distance_miles": 2.0,
                "difficulty": "medium",
                "elevation_gain_ft": 740,
                "type": "out-and-back",
                "description": "Direct climb from the Humpback Rocks Visitor Center.",
            }
        ],
    },
    {
        "id": "sharp-top",
        "name": "Sharp Top Mountain",
        "town": "Bedford",
        "county": "Bedford County",
        "state": "Virginia",
        "coordinates": _coords(37.4432, -79.6060),
        "length_miles": 3.0,
        "elevation_gain_ft": 1340,
        "highest_elevation_ft": 3875,
        "difficulty": "medium",
        "elevation_difficulty": "steady climb",
        "route_type": "out-and-back",
        "description": (
            "One of the Peaks of Otter, Sharp Top offers a rock-capped 360-degree "
            "summit that once was believed to be the highest point in Virginia."
        ),
        "features": ["summit", "peaks-of-otter", "blue-ridge-parkway"],
        "best_season": "spring-fall",
        "ratings": {
            "google": {"rating": 4.7, "reviews": 980},
            "alltrails": {"rating": 4.6, "reviews": 1640},
        },
        "routes": [
            {
                "name": "Sharp Top Trail",
                "distance_miles": 3.0,
                "difficulty": "medium",
                "elevation_gain_ft": 1340,
                "type": "out-and-back",
                "description": "Paved-then-rocky climb from the Peaks of Otter picnic area.",
            }
        ],
    },
    {
        "id": "crabtree-falls",
        "name": "Crabtree Falls",
        "town": "Montebello",
        "county": "Nelson County",
        "state": "Virginia",
        "coordinates": _coords(37.8510, -79.0790),
        "length_miles": 3.0,
        "elevation_gain_ft": 1200,
        "highest_elevation_ft": 3400,
        "difficulty": "medium",
        "elevation_difficulty": "steady climb",
        "route_type": "out-and-back",
        "description": (
            "The highest series of cascading waterfalls east of the Mississippi, "
            "dropping roughly 1,200 feet over a series of five major falls."
        ),
        "features": ["waterfall", "overlook"],
        "best_season": "year-round",
        "ratings": {
            "google": {"rating": 4.8, "reviews": 2100},
            "alltrails": {"rating": 4.7, "reviews": 3020},
        },
        "routes": [
            {
                "name": "Crabtree Falls Trail",
                "distance_miles": 3.0,
                "difficulty": "medium",
                "elevation_gain_ft": 1200,
                "type": "out-and-back",
                "description": "Switchbacks past multiple waterfall overlooks to the upper falls.",
            }
        ],
    },
    {
        "id": "the-priest",
        "name": "The Priest",
        "town": "Montebello",
        "county": "Nelson County",
        "state": "Virginia",
        "coordinates": _coords(37.8206, -79.0736),
        "length_miles": 9.3,
        "elevation_gain_ft": 3110,
        "highest_elevation_ft": 4063,
        "difficulty": "hard",
        "elevation_difficulty": "grueling climb",
        "route_type": "out-and-back",
        "description": (
            "A relentless climb on the Appalachian Trail to one of Virginia's "
            "highest peaks, with big elevation gain and a rewarding valley overlook."
        ),
        "features": ["summit", "appalachian-trail", "overlook"],
        "best_season": "spring-fall",
        "ratings": {
            "google": {"rating": 4.6, "reviews": 410},
            "alltrails": {"rating": 4.7, "reviews": 890},
        },
        "routes": [
            {
                "name": "The Priest via Appalachian Trail",
                "distance_miles": 9.3,
                "difficulty": "hard",
                "elevation_gain_ft": 3110,
                "type": "out-and-back",
                "description": "Climb from the Tye River up to The Priest summit and overlook.",
            }
        ],
    },
    {
        "id": "cascades-falls",
        "name": "The Cascades",
        "town": "Pembroke",
        "county": "Giles County",
        "state": "Virginia",
        "coordinates": _coords(37.3538, -80.5985),
        "length_miles": 4.0,
        "elevation_gain_ft": 740,
        "highest_elevation_ft": 2300,
        "difficulty": "medium",
        "elevation_difficulty": "gentle climb",
        "route_type": "loop",
        "description": (
            "A gorgeous streamside hike in Jefferson National Forest leading to a "
            "66-foot waterfall plunging into a large pool - a Virginia favorite."
        ),
        "features": ["waterfall", "stream", "dog-friendly"],
        "best_season": "year-round",
        "ratings": {
            "google": {"rating": 4.8, "reviews": 1870},
            "alltrails": {"rating": 4.8, "reviews": 3450},
        },
        "routes": [
            {
                "name": "Cascades Falls Loop",
                "distance_miles": 4.0,
                "difficulty": "medium",
                "elevation_gain_ft": 740,
                "type": "loop",
                "description": "Lower gorge trail up, upper trail back for a scenic loop.",
            }
        ],
    },
    {
        "id": "white-oak-canyon",
        "name": "White Oak Canyon",
        "town": "Syria",
        "county": "Madison County",
        "state": "Virginia",
        "coordinates": _coords(38.5566, -78.3480),
        "length_miles": 4.6,
        "elevation_gain_ft": 1075,
        "highest_elevation_ft": 2400,
        "difficulty": "medium",
        "elevation_difficulty": "steady climb",
        "route_type": "out-and-back",
        "description": (
            "A waterfall wonderland in Shenandoah National Park with six major "
            "cascades and inviting swimming holes along the way."
        ),
        "features": ["waterfall", "swimming", "stream"],
        "best_season": "spring-fall",
        "ratings": {
            "google": {"rating": 4.7, "reviews": 1320},
            "alltrails": {"rating": 4.7, "reviews": 2760},
        },
        "routes": [
            {
                "name": "White Oak Canyon Lower Falls",
                "distance_miles": 4.6,
                "difficulty": "medium",
                "elevation_gain_ft": 1075,
                "type": "out-and-back",
                "description": "Lower trailhead to the first big waterfall and back.",
            },
            {
                "name": "White Oak Canyon & Cedar Run Loop",
                "distance_miles": 8.1,
                "difficulty": "hard",
                "elevation_gain_ft": 2360,
                "type": "loop",
                "description": "Combines both canyons for a strenuous waterfall loop.",
            },
        ],
    },
    {
        "id": "stony-man",
        "name": "Stony Man",
        "town": "Luray",
        "county": "Page County",
        "state": "Virginia",
        "coordinates": _coords(38.5936, -78.3745),
        "length_miles": 1.6,
        "elevation_gain_ft": 340,
        "highest_elevation_ft": 4011,
        "difficulty": "easy",
        "elevation_difficulty": "gentle climb",
        "route_type": "loop",
        "description": (
            "A short, family-friendly climb to the second-highest peak in "
            "Shenandoah National Park with expansive views of the Shenandoah Valley."
        ),
        "features": ["summit", "overlook", "family-friendly"],
        "best_season": "year-round",
        "ratings": {
            "google": {"rating": 4.7, "reviews": 860},
            "alltrails": {"rating": 4.6, "reviews": 1510},
        },
        "routes": [
            {
                "name": "Stony Man Loop",
                "distance_miles": 1.6,
                "difficulty": "easy",
                "elevation_gain_ft": 340,
                "type": "loop",
                "description": "Easy loop from Skyline Drive to the Stony Man summit.",
            }
        ],
    },
    {
        "id": "hawksbill-mountain",
        "name": "Hawksbill Mountain",
        "town": "Luray",
        "county": "Page County",
        "state": "Virginia",
        "coordinates": _coords(38.5566, -78.3893),
        "length_miles": 2.9,
        "elevation_gain_ft": 860,
        "highest_elevation_ft": 4051,
        "difficulty": "medium",
        "elevation_difficulty": "steady climb",
        "route_type": "loop",
        "description": (
            "The highest peak in Shenandoah National Park. A moderate loop leads to "
            "a stone observation platform with 360-degree Blue Ridge views."
        ),
        "features": ["summit", "overlook", "highest-in-park"],
        "best_season": "year-round",
        "ratings": {
            "google": {"rating": 4.7, "reviews": 720},
            "alltrails": {"rating": 4.7, "reviews": 1290},
        },
        "routes": [
            {
                "name": "Hawksbill Loop",
                "distance_miles": 2.9,
                "difficulty": "medium",
                "elevation_gain_ft": 860,
                "type": "loop",
                "description": "Lower Hawksbill Trail up, AT and fire road down.",
            }
        ],
    },
    {
        "id": "mount-rogers",
        "name": "Mount Rogers",
        "town": "Whitetop",
        "county": "Grayson County",
        "state": "Virginia",
        "coordinates": _coords(36.6595, -81.5445),
        "length_miles": 9.4,
        "elevation_gain_ft": 1620,
        "highest_elevation_ft": 5729,
        "difficulty": "hard",
        "elevation_difficulty": "long sustained climb",
        "route_type": "out-and-back",
        "description": (
            "The highest natural point in Virginia, reached through the open balds "
            "of Grayson Highlands where wild ponies roam among the rhododendron."
        ),
        "features": ["summit", "wild-ponies", "highest-in-state", "balds"],
        "best_season": "late-spring-fall",
        "ratings": {
            "google": {"rating": 4.8, "reviews": 640},
            "alltrails": {"rating": 4.8, "reviews": 1470},
        },
        "routes": [
            {
                "name": "Mount Rogers via Grayson Highlands",
                "distance_miles": 9.4,
                "difficulty": "hard",
                "elevation_gain_ft": 1620,
                "type": "out-and-back",
                "description": "Rhododendron Gap & AT through the balds to the wooded summit.",
            }
        ],
    },
    {
        "id": "tinker-cliffs",
        "name": "Tinker Cliffs",
        "town": "Catawba",
        "county": "Botetourt County",
        "state": "Virginia",
        "coordinates": _coords(37.4585, -79.9720),
        "length_miles": 7.7,
        "elevation_gain_ft": 2000,
        "highest_elevation_ft": 3000,
        "difficulty": "hard",
        "elevation_difficulty": "steep climb",
        "route_type": "out-and-back",
        "description": (
            "A half-mile-long band of cliffs along the Appalachian Trail with "
            "views back toward McAfee Knob. Part of the Roanoke Triple Crown."
        ),
        "features": ["overlook", "appalachian-trail", "triple-crown"],
        "best_season": "spring-fall",
        "ratings": {
            "google": {"rating": 4.7, "reviews": 380},
            "alltrails": {"rating": 4.6, "reviews": 720},
        },
        "routes": [
            {
                "name": "Tinker Cliffs via Andy Layne Trail",
                "distance_miles": 7.7,
                "difficulty": "hard",
                "elevation_gain_ft": 2000,
                "type": "out-and-back",
                "description": "Andy Layne Trail to the AT and the cliff line.",
            }
        ],
    },
    {
        "id": "spy-rock",
        "name": "Spy Rock",
        "town": "Montebello",
        "county": "Nelson County",
        "state": "Virginia",
        "coordinates": _coords(37.8760, -79.0895),
        "length_miles": 3.2,
        "elevation_gain_ft": 870,
        "highest_elevation_ft": 4000,
        "difficulty": "medium",
        "elevation_difficulty": "steady climb with scramble",
        "route_type": "out-and-back",
        "description": (
            "A short scramble up a granite dome delivers one of the best 360-degree "
            "panoramas in central Virginia, popular for sunset and stargazing."
        ),
        "features": ["summit", "overlook", "rock-scramble", "stargazing"],
        "best_season": "spring-fall",
        "ratings": {
            "google": {"rating": 4.8, "reviews": 520},
            "alltrails": {"rating": 4.7, "reviews": 980},
        },
        "routes": [
            {
                "name": "Spy Rock via Fish Hatchery Road",
                "distance_miles": 3.2,
                "difficulty": "medium",
                "elevation_gain_ft": 870,
                "type": "out-and-back",
                "description": "Gravel road and AT connector up to the Spy Rock dome.",
            }
        ],
    },
    {
        "id": "bearfence-mountain",
        "name": "Bearfence Mountain",
        "town": "Stanardsville",
        "county": "Greene County",
        "state": "Virginia",
        "coordinates": _coords(38.4390, -78.4700),
        "length_miles": 1.2,
        "elevation_gain_ft": 275,
        "highest_elevation_ft": 3620,
        "difficulty": "medium",
        "elevation_difficulty": "short rock scramble",
        "route_type": "loop",
        "description": (
            "A short but hands-on rock scramble in Shenandoah National Park "
            "rewarding hikers with a rare 360-degree summit view."
        ),
        "features": ["summit", "rock-scramble", "overlook"],
        "best_season": "year-round",
        "ratings": {
            "google": {"rating": 4.6, "reviews": 610},
            "alltrails": {"rating": 4.5, "reviews": 1130},
        },
        "routes": [
            {
                "name": "Bearfence Mountain Loop",
                "distance_miles": 1.2,
                "difficulty": "medium",
                "elevation_gain_ft": 275,
                "type": "loop",
                "description": "Rock scramble up, AT back for a compact summit loop.",
            }
        ],
    },
]


HOUSING_SEED: list[dict] = [
    {
        "id": "peaks-of-otter-lodge",
        "name": "Peaks of Otter Lodge",
        "type": "lodge",
        "town": "Bedford",
        "county": "Bedford County",
        "state": "Virginia",
        "coordinates": _coords(37.4487, -79.6035),
        "price_per_night": 165,
        "rating": 4.4,
        "reviews": 1820,
        "amenities": ["lakefront", "restaurant", "pet-friendly", "wifi"],
        "nearby_trail_ids": ["sharp-top"],
        "description": "Lakeside lodge at the base of the Peaks of Otter on the Blue Ridge Parkway.",
    },
    {
        "id": "big-meadows-lodge",
        "name": "Big Meadows Lodge",
        "type": "lodge",
        "town": "Luray",
        "county": "Page County",
        "state": "Virginia",
        "coordinates": _coords(38.5217, -78.4360),
        "price_per_night": 185,
        "rating": 4.3,
        "reviews": 2450,
        "amenities": ["restaurant", "views", "wifi", "historic"],
        "nearby_trail_ids": ["hawksbill-mountain", "stony-man", "bearfence-mountain"],
        "description": "Rustic stone-and-timber lodge in the heart of Shenandoah National Park.",
    },
    {
        "id": "skyland-resort",
        "name": "Skyland Resort",
        "type": "lodge",
        "town": "Luray",
        "county": "Page County",
        "state": "Virginia",
        "coordinates": _coords(38.5936, -78.3810),
        "price_per_night": 199,
        "rating": 4.3,
        "reviews": 2980,
        "amenities": ["highest-point", "restaurant", "views", "horseback"],
        "nearby_trail_ids": ["stony-man", "hawksbill-mountain"],
        "description": "The highest lodging in Shenandoah, perched at 3,680 feet on Skyline Drive.",
    },
    {
        "id": "catawba-farm-cabin",
        "name": "Catawba Valley Farm Cabin",
        "type": "cabin",
        "town": "Catawba",
        "county": "Roanoke County",
        "state": "Virginia",
        "coordinates": _coords(37.3820, -80.0900),
        "price_per_night": 140,
        "rating": 4.7,
        "reviews": 320,
        "amenities": ["kitchen", "fireplace", "pet-friendly", "mountain-views"],
        "nearby_trail_ids": ["mcafee-knob", "dragons-tooth", "tinker-cliffs"],
        "description": "Cozy private cabin minutes from the Roanoke Triple Crown trailheads.",
    },
    {
        "id": "montebello-camp",
        "name": "Montebello Camping & Fishing Resort",
        "type": "campground",
        "town": "Montebello",
        "county": "Nelson County",
        "state": "Virginia",
        "coordinates": _coords(37.8560, -79.1210),
        "price_per_night": 55,
        "rating": 4.5,
        "reviews": 640,
        "amenities": ["fishing", "camp-store", "cabins", "stream"],
        "nearby_trail_ids": ["crabtree-falls", "the-priest", "spy-rock"],
        "description": "Family campground and trout pond near Crabtree Falls and The Priest.",
    },
    {
        "id": "grayson-highlands-camp",
        "name": "Grayson Highlands State Park Campground",
        "type": "campground",
        "town": "Whitetop",
        "county": "Grayson County",
        "state": "Virginia",
        "coordinates": _coords(36.6280, -81.5060),
        "price_per_night": 45,
        "rating": 4.7,
        "reviews": 910,
        "amenities": ["wild-ponies", "showers", "electric-sites", "views"],
        "nearby_trail_ids": ["mount-rogers"],
        "description": "High-elevation state park campground and gateway to the wild ponies.",
    },
    {
        "id": "pembroke-riverside-inn",
        "name": "New River Riverside Inn",
        "type": "hotel",
        "town": "Pembroke",
        "county": "Giles County",
        "state": "Virginia",
        "coordinates": _coords(37.3200, -80.6380),
        "price_per_night": 120,
        "rating": 4.2,
        "reviews": 410,
        "amenities": ["riverfront", "breakfast", "wifi", "kayak-rental"],
        "nearby_trail_ids": ["cascades-falls"],
        "description": "Riverside inn on the New River, close to the Cascades trailhead.",
    },
    {
        "id": "syria-graves-farm",
        "name": "Graves Mountain Lodge",
        "type": "lodge",
        "town": "Syria",
        "county": "Madison County",
        "state": "Virginia",
        "coordinates": _coords(38.4980, -78.3560),
        "price_per_night": 150,
        "rating": 4.5,
        "reviews": 780,
        "amenities": ["farm-to-table", "cabins", "family-friendly", "orchard"],
        "nearby_trail_ids": ["old-rag-mountain", "white-oak-canyon"],
        "description": "Working-farm lodge at the foot of Old Rag and White Oak Canyon.",
    },
    {
        "id": "waynesboro-lodge",
        "name": "Iris Inn Waynesboro",
        "type": "hotel",
        "town": "Waynesboro",
        "county": "Augusta County",
        "state": "Virginia",
        "coordinates": _coords(38.0685, -78.8895),
        "price_per_night": 210,
        "rating": 4.6,
        "reviews": 1130,
        "amenities": ["mountain-views", "hot-tub", "breakfast", "wifi"],
        "nearby_trail_ids": ["humpback-rocks"],
        "description": "Boutique inn overlooking the Shenandoah Valley near the Parkway.",
    },
]
