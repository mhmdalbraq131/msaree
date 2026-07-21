import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Custom Theme Extension to encapsulate MASARI Design System custom colors
class MasariThemeExtension extends ThemeExtension<MasariThemeExtension> {
  final Color primaryGold;
  final Color deepNavy;
  final Color vibrantCyan;
  final Color orangeAccent;
  final Color slateBackground;
  final Color cardBorder;

  const MasariThemeExtension({
    required this.primaryGold,
    required this.deepNavy,
    required this.vibrantCyan,
    required this.orangeAccent,
    required this.slateBackground,
    required this.cardBorder,
  });

  @override
  ThemeExtension<MasariThemeExtension> copyWith({
    Color? primaryGold,
    Color? deepNavy,
    Color? vibrantCyan,
    Color? orangeAccent,
    Color? slateBackground,
    Color? cardBorder,
  }) {
    return MasariThemeExtension(
      primaryGold: primaryGold ?? this.primaryGold,
      deepNavy: deepNavy ?? this.deepNavy,
      vibrantCyan: vibrantCyan ?? this.vibrantCyan,
      orangeAccent: orangeAccent ?? this.orangeAccent,
      slateBackground: slateBackground ?? this.slateBackground,
      cardBorder: cardBorder ?? this.cardBorder,
    );
  }

  @override
  ThemeExtension<MasariThemeExtension> lerp(
    ThemeExtension<MasariThemeExtension>? other,
    double t,
  ) {
    if (other is! MasariThemeExtension) return this;
    return MasariThemeExtension(
      primaryGold: Color.lerp(primaryGold, other.primaryGold, t)!,
      deepNavy: Color.lerp(deepNavy, other.deepNavy, t)!,
      vibrantCyan: Color.lerp(vibrantCyan, other.vibrantCyan, t)!,
      orangeAccent: Color.lerp(orangeAccent, other.orangeAccent, t)!,
      slateBackground: Color.lerp(slateBackground, other.slateBackground, t)!,
      cardBorder: Color.lerp(cardBorder, other.cardBorder, t)!,
    );
  }
}

/// Approved Design System Themes
class AppTheme {
  // Spacing System
  static const double space4 = 4.0;
  static const double space8 = 8.0;
  static const double space12 = 12.0;
  static const double space16 = 16.0;
  static const double space24 = 24.0;
  static const double space32 = 32.0;

  // Radius System
  static const double radius8 = 8.0;
  static const double radius12 = 12.0;
  static const double radius16 = 16.0;
  static const double radius24 = 24.0;

  // Elevation System
  static const List<BoxShadow> shadowLow = [
    BoxShadow(
      color: Color(0x0A000000),
      offset: Offset(0, 2),
      blurRadius: 4,
    ),
  ];

  static const List<BoxShadow> shadowMedium = [
    BoxShadow(
      color: Color(0x12000000),
      offset: Offset(0, 4),
      blurRadius: 8,
    ),
  ];

  static const List<BoxShadow> shadowHigh = [
    BoxShadow(
      color: Color(0x1B000000),
      offset: Offset(0, 8),
      blurRadius: 16,
    ),
  ];

  static final lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: const Color(0xFF1E3A8A), // Masari Deep Navy
    colorScheme: const ColorScheme.light(
      primary: Color(0xFF1E3A8A),
      secondary: Color(0xFFD97706), // Royal Amber/Gold
      surface: Color(0xFFF8FAFC), // Slate 50
      onSurface: Color(0xFF0F172A), // Slate 900
      error: Color(0xFFEF4444),
    ),
    scaffoldBackgroundColor: const Color(0xFFF8FAFC),
    textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme).copyWith(
      displayLarge: GoogleFonts.spaceGrotesk(fontSize: 32, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A)),
      displayMedium: GoogleFonts.spaceGrotesk(fontSize: 24, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A)),
      titleLarge: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w600, color: const Color(0xFF0F172A)),
      bodyLarge: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.normal, color: const Color(0xFF334155)),
      bodyMedium: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.normal, color: const Color(0xFF64748B)),
      labelLarge: GoogleFonts.jetbrainsMono(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF1E3A8A)),
    ),
    extensions: const [
      MasariThemeExtension(
        primaryGold: Color(0xFFD97706),
        deepNavy: Color(0xFF1E3A8A),
        vibrantCyan: Color(0xFF06B6D4),
        orangeAccent: Color(0xFFF97316),
        slateBackground: Color(0xFFF8FAFC),
        cardBorder: Color(0xFFE2E8F0),
      )
    ],
  );

  static final darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    primaryColor: const Color(0xFF0F172A),
    colorScheme: const ColorScheme.dark(
      primary: Color(0xFF38BDF8), // Light Sky Blue
      secondary: Color(0xFFF59E0B), // Golden Amber
      surface: Color(0xFF0B0F19), // Deep slate background
      onSurface: Color(0xFFF8FAFC),
      error: Color(0xFFF87171),
    ),
    scaffoldBackgroundColor: const Color(0xFF020617),
    textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).copyWith(
      displayLarge: GoogleFonts.spaceGrotesk(fontSize: 32, fontWeight: FontWeight.bold, color: const Color(0xFFF8FAFC)),
      displayMedium: GoogleFonts.spaceGrotesk(fontSize: 24, fontWeight: FontWeight.bold, color: const Color(0xFFF8FAFC)),
      titleLarge: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w600, color: const Color(0xFFF8FAFC)),
      bodyLarge: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.normal, color: const Color(0xFFCBD5E1)),
      bodyMedium: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.normal, color: const Color(0xFF94A3B8)),
      labelLarge: GoogleFonts.jetbrainsMono(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF38BDF8)),
    ),
    extensions: const [
      MasariThemeExtension(
        primaryGold: Color(0xFFF59E0B),
        deepNavy: Color(0xFF0F172A),
        vibrantCyan: Color(0xFF22D3EE),
        orangeAccent: Color(0xFFFB923C),
        slateBackground: Color(0xFF020617),
        cardBorder: Color(0xFF1E293B),
      )
    ],
  );
}
