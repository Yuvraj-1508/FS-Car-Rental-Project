const WishlistModel = require("../model/WishlistModel");

const addToWishlist = async (req, res) => {
    try {
        const { carId } = req.body;
        const userId = req.user.id;

        const wish = await WishlistModel.create({ userId, carId });
        res.status(201).json({ success: true, message: "Asset added to wishlist", wish });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Asset already exists in your wishlist" });
        }
        res.status(500).json({ success: false, message: "Error adding to wishlist", error: error.message });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { carId } = req.params;
        const userId = req.user.id;

        await WishlistModel.findOneAndDelete({ userId, carId });
        res.status(200).json({ success: true, message: "Asset removed from wishlist" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing from wishlist", error: error.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlist = await WishlistModel.find({ userId }).populate("carId");
        
        // Filter out null carId in case a car was deleted and transform images
        const transformedWishlist = wishlist
            .filter(item => item.carId !== null)
            .map(item => {
                const car = item.carId.toObject();
                if (car.carImage) {
                    const contentType = "image/jpeg";
                    car.carImage = `data:${contentType};base64,${car.carImage.toString("base64")}`;
                }
                return { ...item.toObject(), carId: car };
            });

        res.status(200).json({ success: true, wishlist: transformedWishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching wishlist", error: error.message });
    }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
