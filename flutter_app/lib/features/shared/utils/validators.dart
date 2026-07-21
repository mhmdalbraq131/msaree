class Validators {
  static bool validateEmail(String email) {
    final reg = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    return reg.hasMatch(email);
  }

  static bool validatePassword(String password) {
    // Strong password policy (Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char)
    if (password.length < 8) return false;
    final uppercaseReg = RegExp(r'[A-Z]');
    final lowercaseReg = RegExp(r'[a-z]');
    final digitReg = RegExp(r'[0-9]');
    final specialReg = RegExp(r'[!@#\$&*~]');
    return uppercaseReg.hasMatch(password) &&
        lowercaseReg.hasMatch(password) &&
        digitReg.hasMatch(password) &&
        specialReg.hasMatch(password);
  }

  static bool validatePhone(String phone) {
    // Validates international phone formats, Yemeni phones, and GCC countries
    final clean = phone.replaceAll(RegExp(r'\s+'), '');
    final reg = RegExp(r'^\+?[1-9]\d{1,14}$');
    return reg.hasMatch(clean);
  }

  static bool validatePassport(String passportNo) {
    // Standard alphanumeric passport validation
    if (passportNo.isEmpty || passportNo.length < 5) return false;
    final reg = RegExp(r'^[A-Z0-9]{6,15}$', caseSensitive: false);
    return reg.hasMatch(passportNo);
  }

  static bool validateNationalId(String nationalId) {
    // Standard 8-15 digits national ID validation
    if (nationalId.isEmpty) return false;
    final reg = RegExp(r'^\d{8,15}$');
    return reg.hasMatch(nationalId);
  }

  static bool validateOtp(String otp) {
    return otp.length == 4 || otp.length == 6;
  }
}
