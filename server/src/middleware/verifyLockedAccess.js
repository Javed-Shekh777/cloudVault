async function verifyLockedAccess(req, res, next) {
  const sessionId = req.headers["x-locked-session"];

  if (!sessionId)
    return res.status(403).json({ msg: "Locked. Need unlock session." });

  const s = await LockedAccessSession.findById(sessionId);

  if (!s || !s.active)
    return res.status(403).json({ msg: "Session inactive" });

  if (s.expiresAt < new Date()) {
    s.active = false;
    await s.save();
    return res.status(403).json({ msg: "Session expired" });
  }

  req.lockedSession = s;
  next();
}

module.exports = verifyLockedAccess;    