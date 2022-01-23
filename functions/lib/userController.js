"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.addUser = void 0;
const firebase_1 = require("./config/firebase");
const addUser = async (req, res) => {
    const { body: { phoneNumber }, params: { userId }, } = req;
    try {
        const user = firebase_1.db.collection('users').doc(userId);
        const userObject = {
            id: userId,
            phoneNumber: phoneNumber,
            isAdmin: false,
            isPersonal: [],
            profileImage: null,
        };
        await user.set(userObject);
        res.status(200).send({
            status: 'Success',
            message: 'User added successfully',
            data: userObject,
        });
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.addUser = addUser;
// buraya etkinlikte görevli personel de çekilir.
const getAllUsers = async (req, res) => {
    try {
        let filterNumber = req.query.phoneNumber;
        const allUsers = [];
        if (req.query.phoneNumber) {
            const querySnapshot = await firebase_1.db
                .collection('users')
                .where('phoneNumber', '==', filterNumber)
                .get();
            querySnapshot.forEach((doc) => allUsers.push(doc.data()));
            return res.status(200).json(allUsers);
        }
        else {
            const querySnapshot = await firebase_1.db.collection('users').get();
            querySnapshot.forEach((doc) => allUsers.push(doc.data()));
            return res.status(200).json(allUsers);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res) => {
    try {
        const { params: { userId }, } = req;
        const user = firebase_1.db.collection('users').doc(userId);
        const currentData = (await user.get()).data() || {};
        return res.status(200).json(currentData);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    const { body: { name, mail, isPersonal, profileImage, city, adress, identityNumber, }, params: { userId }, } = req;
    try {
        const user = firebase_1.db.collection('users').doc(userId);
        const currentData = (await user.get()).data() || {};
        const userObject = {
            id: currentData.id,
            phoneNumber: currentData.phoneNumber,
            isAdmin: currentData.isAdmin,
            name: name || currentData.name,
            mail: mail || currentData.mail,
            isPersonal: isPersonal || currentData.isPersonal,
            profileImage: profileImage || currentData.profileImage,
            city: city || currentData.city,
            adress: adress || currentData.adress,
            identityNumber: identityNumber || currentData.identityNumber,
        };
        await user.set(userObject).catch((error) => {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        });
        return res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: userObject,
        });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = firebase_1.db.collection('users').doc(userId);
        await user.delete().catch((error) => {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        });
        return res.status(200).json({
            status: 'success',
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map