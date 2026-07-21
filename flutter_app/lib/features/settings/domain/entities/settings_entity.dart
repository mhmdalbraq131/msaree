class AppSettings {
  final bool isDarkMode;
  final String language;
  final String currency;

  const AppSettings({
    this.isDarkMode = false,
    this.language = 'ar',
    this.currency = 'USD',
  });
}
