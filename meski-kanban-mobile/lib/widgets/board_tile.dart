import 'package:flutter/material.dart';

class BoardTile extends StatelessWidget {
  final String title;
  final VoidCallback onTap;

  const BoardTile({required this.title, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Color(0xFFe6f2f8),
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.shade300,
              offset: Offset(1, 2),
              blurRadius: 4,
            ),
          ],
        ),
        child: Center(
          child: Text(
            title,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 16,
              color: Color(0xFF006eae),
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}
