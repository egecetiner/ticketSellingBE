import {Response} from 'express';
import {db} from './config/firebase';

type UserType = {
  id: string;
  phoneNumber: number;
  name: string;
  isAdmin: boolean;
  isPersonal: boolean;
  mail: any;
  profileImage: any;
  city: string;
  identityNumber: number;
  adress: string;
};

type Request = {
  query: any;
  body: UserType;
  params: {userId: string};
};

const addUser = async (req: Request, res: Response) => {
  const {
    body: {phoneNumber},
    params: {userId},
  } = req;
  try {
    const user = db.collection('users').doc(userId);
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
  } catch (error) {
    res.status(500).json(error.message);
  }
};
// buraya etkinlikte görevli personel de çekilir.
const getAllUsers = async (req: Request, res: Response) => {
  try {
    let filterNumber = req.query.phoneNumber;
    const allUsers: UserType[] = [];
    if (req.query.phoneNumber) {
      const querySnapshot = await db
        .collection('users')
        .where('phoneNumber', '==', filterNumber)
        .get();
      querySnapshot.forEach((doc: any) => allUsers.push(doc.data()));
      return res.status(200).json(allUsers);
    } else {
      const querySnapshot = await db.collection('users').get();
      querySnapshot.forEach((doc: any) => allUsers.push(doc.data()));
      return res.status(200).json(allUsers);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const {
      params: {userId},
    } = req;

    const user = db.collection('users').doc(userId);
    const currentData = (await user.get()).data() || {};

    return res.status(200).json(currentData);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const updateUser = async (req: Request, res: Response) => {
  const {
    body: {
      name,
      mail,
      isPersonal,
      profileImage,
      city,
      adress,
      identityNumber,
    },
    params: {userId},
  } = req;

  try {
    const user = db.collection('users').doc(userId);
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
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const {userId} = req.params;

  try {
    const user = db.collection('users').doc(userId);

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
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export {addUser, getAllUsers, updateUser, deleteUser, getUser};
