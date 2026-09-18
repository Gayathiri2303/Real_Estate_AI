from fastapi import APIRouter, HTTPException

router = APIRouter()

# Simple sample images for properties
PROPERTY_IMAGES = {
    1: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
    ],
    2: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
    ],
    3: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ]
}

@router.get("/property-images/{property_id}")
def get_property_images(property_id: int):
    images = PROPERTY_IMAGES.get(property_id, [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
    ])
    return {
        "property_id": property_id,
        "images": images
    }
