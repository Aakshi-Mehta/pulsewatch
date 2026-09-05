const changeService = require('../services/ChangeService');

exports.getChanges = async (req, res, next) => {
  try {
    const brief = await changeService.getUserChanges(req.user.id);
    res.json(brief);
  } catch (error) {
    next(error);
  }
};

exports.acknowledgeSession = async (req, res, next) => {
  try {
    const { symbols } = req.body;
    const result = await changeService.acknowledgeSession(req.user.id, symbols);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
