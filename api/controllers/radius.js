'use strict';

var mongoose = require('mongoose'),
  Accounting = mongoose.model('Accounting'),
  Users = mongoose.model('Users'),
  Profiles = mongoose.model('Profiles');

exports.check = function (req, res) {
  Users.findOne({ login: req.params.login }, function (err, acc) {
    if (err) res.send(err);
    if (acc == null) {
      return res.status(401);
      res.json({ 'Reply-Message': 'Login invalid' });
    }
    res.set('Content-Type', 'application/json');
    res.sendStatus(204);
  });
};

exports.auth = function (req, res) {
  Users.findOne({ login: req.params.login })
    .populate('profile')
    .exec(function (err, auth) {
      if (err) res.send(err);
      if (JSON.stringify(auth.status) != '["active"]') {
        return res.status(401);
        res.json({ 'Reply-Message': 'Login disabled' });
      } else if (auth.password != req.params.password) {
        return res.sendStatus(401);
        res.json({ 'Reply-Message': 'Wrong Password' });
      } else if (auth.register_date + auth.profile.AccessPeriod >= new Date()) {
        return res.sendStatus(401);
        res.json({ 'Reply-Message': 'Access time expired' });
      }
      res.set('Content-Type', 'application/JSON');
      res.json({
        'WISPr-Bandwidth-Max-Down': auth.profile.MaxDownload,
        'WISPr-Bandwidth-Max-Up': auth.profile.MaxUpload,
      });
    });
};

exports.accounting = function (req, res) {
  var new_entry = new Accounting(req.body);
  new_entry.save(function (err, ok) {
    if (err) res.send(err);
    res.json(ok);
  });
};

exports.create_user = async function (req, res) {
  // If profile not found, handle error
  try {
    const profileName = req.body.profile_name || 'Basic';
    const profile = await Profiles.findOne({
      'profile-name': profileName,
    }).exec();

    // const { profile, error } = await Profiles.findOne(
    //   {
    //     'profile-name': profileName,
    //   },
    //   (err, profile) => {
    //     if (err) {
    //       console.error(err);
    //       return { error: err };
    //     }
    //     return { profile, error: null };
    //   }
    // );

    console.log('test');
    console.log(profile);
    if (!profile) {
      console.error(`Profile '${profileName}' not found.`);
      return;
    }

    var new_user = new Users({
      ...req.body,
      profile: profile._id,
    });
    console.log(new_user);
    new_user.save(function (err, user) {
      if (err) throw err;
      res.json(user);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.list_all_users = function (req, res) {
  Users.find()
    .populate('profile', 'profile-name -_id')
    .exec(function (err, users) {
      if (err) res.send(err);
      res.json(users);
    });
};

exports.update_user = function (req, res) {
  Users.findOneAndUpdate(
    req.params.userID,
    req.body,
    { new: true },
    function (err, user) {
      if (err) res.send(err);
      res.json({ message: 'User successfully updated' });
    }
  );
};

exports.remove_user = function (req, res) {
  Users.remove({ _id: req.params.userID }, function (err, user) {
    if (err) res.send(err);
    res.json({ message: 'User successfully removed' });
  });
};

exports.create_profile = function (req, res) {
  var new_profile = new Profiles(req.body);
  new_profile.save(function (err, profile) {
    if (err) res.send(err);
    res.json(profile);
  });
};

exports.list_all_profiles = function (req, res) {
  Profiles.find({}, function (err, profiles) {
    if (err) res.send(err);
    res.json(profiles);
  });
};

exports.update_profile = function (req, res) {
  Profiles.findOneAndUpdate(
    req.params.profileID,
    req.body,
    { new: true },
    function (err, profile) {
      if (err) res.send(err);
      res.json({ message: 'Profile successfully updated' });
    }
  );
};

exports.remove_profile = function (req, res) {
  Profiles.remove({ _id: req.params.profileID }, function (err, profile) {
    if (err) res.send(err);
    res.json({ message: 'Profile successfully removed' });
  });
};
