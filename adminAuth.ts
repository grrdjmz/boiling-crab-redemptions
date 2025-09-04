/**
 * Verify that the incoming request contains the correct admin passcode.
 * Reads the `x-admin-passcode` header and compares to the `ADMIN_PASSCODE` env.
 */
export function verifyAdminPasscode(req: Request): boolean {
  const pass = req.headers.get('x-admin-passcode');
  const expected = process.env.ADMIN_PASSCODE;
  return !!pass && !!expected && pass === expected;
}