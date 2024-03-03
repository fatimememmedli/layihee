const UserModel = require("./../model/userModel");


const getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const skip = (page - 1) * limit;
    const users = await UserModel.find({}).skip(skip).limit(limit);
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const getUserById = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const user = await UserModel.findOne({ _id: id });
  res.send(user);
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  let deletesUser = await UserModel.findByIdAndDelete(id);
  console.log(deletesUser);
  res.send(deletesUser);
};
const postUser = async (req, res) => {
  const user = req.body;
  try {
    let findUserUsername = await UserModel.findOne({ username: user.username });
    let findUserEmail = await UserModel.findOne({ email: user.email });
    if (findUserUsername) {
      res.status(201).send("This username already used!");
    }
    if (findUserEmail) {
      res.status(201).send("This email already used!");
    }
    {
      let newUser = new UserModel(req.body);
      await newUser.save();
      res.status(200).send({
        message: "Register Succesfully!",
      });
    }
  } catch {
    (err) => {
      console.log(err);
      return err;
    };
  }
};
const login = async (req, res) => {
  const user = req.body;

  try {
    let findUser = await UserModel.findOne({
      username: user.username,
      password: user.password,
    });
    if (findUser) {
      res.status(200).send(findUser._id);
    } else {
      res.status(201).send("Invalid Username or Password!");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const patchUser = async (req, res) => {
  const id = req.params.id;
  let updateUser = await UserModel.findOneAndUpdate({ _id: id }, req.body);
  res.send(updateUser);
};
const putUser = async (req, res) => {
  const id = req.params.id;
  let replaceUser = await UserModel.replaceOne({ _id: id }, req.body);
  res.send(replaceUser);
};
module.exports = {
  getAllUser,
  getUserById,
  deleteUser,
  postUser,
  patchUser,
  putUser,
  login,
};
